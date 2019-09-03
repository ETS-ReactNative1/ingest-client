import React, { Component } from 'react'
import Papa from 'papaparse'
import filesize from 'filesize'
import Toggle from 'react-toggle'
import "react-toggle/style.css" // for ES6 modules
import Resumable from 'resumablejs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Formik } from 'formik'
import * as Yup from 'yup'
import MySelect from './MySelect'

const initialValues = {
  friendlyName: '',
  keyName: '',
  suffix: null,
  inputType: null,
  lockInput: null,
  requiredType: null,
  validationMessage: ''
};

export default class IngestCSV extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      progressBar: 0,
      progressBarInt: 0,
      messageStatus: '',
      fileList: {files: []},
      isPaused: false,
      customFieldForm: {
        friendlyName: '',
        keyName: '',
        suffix: '_attr',
        inputType: 'select',
        lockInput: 'no',
        requiredType: 'none',
        validationMessage: ''
      }
    };
  }

  handleSubmit = (values, { setSubmitting, setStatus, resetForm }) => {
      const payload = {
        ...values,
        suffix: values.suffix.value,
        inputType: values.inputType.value,
        lockInput: values.lockInput.value,
        requiredType: values.requiredType.value
      };
      this.props.saveCustomField(payload)
      .then((res) => {
        setSubmitting(false);
        const { payload, error } = res;
        if (error) {
          return setStatus({ msg: error.response.data || 'Problem creating custom field. Please try again.'});
        }
        resetForm(initialValues);
        return this.props.toggleAddCustomFieldModal('close')
      })
      .catch((err) => {
        return setStatus({ msg: 'Problem creating custom field. Please try again.' });
      })
  }

  componentWillMount() {
  }

  componentDidMount() {

    let ResumableField = new Resumable({
      target: `${window.location.protocol}//${window._env_.API_HOST}/ingest/upload`,
      headers: {
        Authorization: 'Bearer ' + this.props.oidc.user.access_token
      },
      chunkSize:1*1024*1024,
      simultaneousUploads:4,
      testChunks:true,
      throttleProgressCallbacks:1
    });

    ResumableField.assignBrowse(this.uploader);

    // Handle file add event
    ResumableField.on('fileAdded', (file, event) => {
      return this.props.parseHeader(file.file);
    });

    ResumableField.on('fileSuccess', (file, message) => {
      //dispatch action saying file has been uploaded...
      this.props.fileUploadSuccess();
      this.props.scheduleIngestJob(this.props.csv.ingestId);
      this.resumable.cancel();
      return this.props.reset();
    });

    ResumableField.on('fileProgress', file => {
      this.setState({
          isUploading: true
      });

      if ((file.progress() * 100) <= 100) {
          this.setState({
              messageStatus: parseInt(file.progress() * 100, 10) + '%',
              progressBar: file.progress() * 100,
              progressBarInt: parseInt(file.progress() * 100, 10)
          });
      } else {
          setTimeout(() => {
              this.setState({
                  progressBar: 0
              })
          }, 1000);
      }
    });

    ResumableField.on('fileError', function(file, message){
      return this.props.fileUploadFailure()
    });

    this.resumable = ResumableField;

    return this.props.getInitial()
    //   .then(() => this.props.receiveCsvIngestUpdate())
  }

  handleToggled = (event) => {
    const target = event.target;
    const value = target.checked;
    const name = target.name;
    return this.props.toggleInput({
      name: name,
      value: value
    });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    return this.props.addText({
      destKey: name,
      value: value
    });
  }

  handlePair = (dest, src) => {
    return this.props.pair({
      sourceKey: src.target.value,
      destKey: dest
    });
  }

  handleStartIngest = (isSubmitInProgress, numErrors) => {
    if (isSubmitInProgress || numErrors > 0) { //prevent submission
      return;
    }
    return this.props.createIngestRecord(this.props.csv.form)
      .then(() => this.resumable.upload())
      .then(() => this.props.fileUploadStarted())
      .catch(() => {
        //do nothing...
      })
  }

  handlePauseFileUpload = () => {
    this.resumable.pause();
    this.props.fileUploadPaused();
  }

  handleResumeFileUpload = () => {
    this.resumable.upload();
    this.props.fileUploadResume();
  }

  handleCancelFileUpload = () => {
    this.resumable.cancel();
    this.props.fileUploadCancelled();
    return this.props.reset();
  }

  handleToggleAddCustomFieldModal = (action) => {
    return this.props.toggleAddCustomFieldModal(action);
  }

  handleDeleteCustomField = (fieldId, isDefaultField) => {
    if (!isDefaultField) { //since `disabled` input still propagating onClick event
      return this.props.deleteCustomField(fieldId);
    }
  }

  render() {
    const isSubmitInProgress = this.props.csv.isSubmitInProgress;

    const startButton = <span disabled={this.props.csv.isFileUploading || this.props.csv.isFileUploaded} className="button is-info is-outline" onClick={() => this.handleResumeFileUpload()}>
                          <FontAwesomeIcon icon="play"/>
                        </span>;

    const pauseButton = <span disabled={!this.props.csv.isFileUploading || this.props.csv.isFileUploaded} className="button is-info is-outline" onClick={() => this.handlePauseFileUpload()}>
                          <FontAwesomeIcon icon="pause"/>
                        </span>;

    const cancelButton = <span disabled={this.props.csv.isFileUploaded} className="button is-info is-outline" onClick={() => this.handleCancelFileUpload()}>
                          <FontAwesomeIcon icon="times"/>
                        </span>;

    function validationClass(requiredType, isError, forInput) {
      if (isError) {
        if (requiredType === 'hard') {
          return !forInput ? 'validation-error' : 'is-danger';
        } else if (requiredType === 'soft') {
          return !forInput ? 'validation-warning' : 'is-warning';
        } else {
          return '';
        }
      } else {
        return '';
      }
    }

    const inputs = {
      file: {
        ...this.props.csv.form.file
      },
      ...this.props.csv.form.mappings
    };

    const counts = Object.keys(inputs).reduce((counts, key) => {
      const errors = this.props.csv.form.errors;
      const requiredType = inputs[key].requiredType;
      counts[requiredType] = errors[key] ? counts[requiredType] + 1 : counts[requiredType];
      return counts;
    }, { hard: 0, soft: 0});

    const loginSchema = Yup.object().shape({
      friendlyName: Yup.string()
        .required('Required'),
      keyName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
      suffix: Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      }).required('Required').nullable(),
      inputType: Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      }).required('Required').nullable(),
      lockInput: Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      }).required('Required').nullable(),
      requiredType: Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required()
      }).required('Required').nullable(),
      validationMessage: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required')
    });

    return (
      <div className="csv-ingest">
        <section className="section">
          <div className="columns">
            <div className="column">
              <div className="file-upload">
                <div className="file">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      ref={node => this.uploader = node}
                      id='my-uploader-id'
                      name='file'
                      accept='csv'
                    />
                    <span className="file-cta">
                      <span className="file-icon">
                        <FontAwesomeIcon icon="upload"/>
                      </span>
                      <span className="file-label">
                        {!this.props.csv.isParsing && !this.props.csv.parseAttempted &&
                          <span>Parse CSV Headers</span>
                        }
                        {this.props.csv.isParsing &&
                          <span>Parsing...</span>
                        }
                        {!this.props.csv.isParsing && this.props.csv.parseError && this.props.csv.parseAttempted &&
                          <span>Error Parsing</span>
                        }
                        {!this.props.csv.isParsing && !this.props.csv.parseError && this.props.csv.parseAttempted &&
                          <span>Parsing Successful</span>
                        }
                      </span>
                    </span>
                  </label>
                </div>
                {!this.props.csv.form.errors.file && this.props.csv.form.file.value &&
                  <div>
                    <span className="file-meta">Filesize: {filesize(this.props.csv.form.file.value.size)}</span>
                    <span className="file-meta">Filename: {this.props.csv.form.file.value.name}</span>
                  </div>
                }
                { this.props.csv.form.errors.file &&
                  <div>
                    <span className="file-meta validation-error">No file selected. Click the button and select a file from your local file system</span>
                  </div>
                }
                <br/>
              </div>
              <div className="table-reset">
                <div className="field-mapping">
                  <table className="table is-fullwidth is-bordered">
                    <thead>
                      <tr>
                        <th>SOLR FIELDS</th>
                        <th>SOURCE FIELDS</th>
                        <th>Use CSV?</th>
                        <th>Delete?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.csv.destinationArr.map((dest, index) => (
                        <React.Fragment key={index}>
                          <tr className={`mapping-main-row ${validationClass(dest.requiredType, this.props.csv.form.errors[dest.key])}`}>
                            <td className="solr-field-name">{dest.name}</td>
                            { dest.type == 'select' &&
                              <td>
                                <div className={`select ${validationClass(dest.requiredType, this.props.csv.form.errors[dest.key], true)}`}>
                                  <select
                                    onChange={(e) => this.handlePair(dest.key, e)}
                                    name="sourceField"
                                    defaultValue="default"
                                  >
                                    <option value="default">Select Source Field</option>
                                    {this.props.csv.sourceArr.map(x => <option value={x.key} key={x.key}>{x.name}</option>)}
                                  </select>
                                </div>
                              </td>
                            }
                            { dest.type == 'text' &&
                              <td>
                                <input
                                  className={`input ${validationClass(dest.requiredType, this.props.csv.form.errors[dest.key], true)}`}
                                  type="text"
                                  name={dest.key}
                                  value={dest.value ? dest.value : ''}
                                  placeholder="Type value here..."
                                  onChange={(e) => this.handleInputChange(e)}
                                />
                              </td>
                            }
                            <td className="toggle-cell">
                              <Toggle
                                checked={dest.type == 'text' ? false : true}
                                onChange={(e) => this.handleToggled(e)}
                                name={dest.key}
                                disabled={dest.inputTypeLocked}
                              />
                            </td>
                            <td className="delete-field">
                              <a
                                className={`button is-small ${dest.isCustom ? 'is-danger' : ''}`}
                                onClick={() => this.handleDeleteCustomField(dest.key, !dest.isCustom)}
                                disabled={!dest.isCustom}
                              >
                                <FontAwesomeIcon icon="times"/>
                              </a>
                            </td>
                          </tr>
                          { this.props.csv.form.errors[dest.key] && dest.requiredType !== 'none' &&
                          <tr className={`mapping-validation-message-row ${ dest.requiredType == 'hard' ? 'validation-error' : 'validation-warning'}`}>
                            <td colSpan="4"><span className="validation-title">{`${dest.name} ${dest.requiredType == 'hard' ? 'Error' : 'Warning'}`}:&nbsp;</span><span>{dest.validationMessage}</span></td>
                          </tr>
                          }
                        </React.Fragment>
                      ))}

                    </tbody>
                  </table>
                </div>
                <a className="add-custom-field-button" onClick={() => this.handleToggleAddCustomFieldModal('open')}>Add Custom Field</a>
              </div>
              <div className="start-ingest">
                <a className={`button is-primary ${isSubmitInProgress ? 'is-loading' : ''}`} onClick={() => this.handleStartIngest(isSubmitInProgress, counts.hard)} disabled={(isSubmitInProgress ? true : false) || counts.hard > 0}>{isSubmitInProgress ? 'Ingesting...' : 'Start Ingest'}</a>
                { counts.soft > 0 &&
                  <span className="start-ingest-warning-count">Warning Count: {counts.soft}</span>
                }
                { counts.hard > 0 &&
                  <span className="start-ingest-error-count">Error Count: {counts.hard}</span>
                }
              </div>
              { this.props.csv.status &&
                <div className="status">Status: {this.props.csv.status}</div>
              }
            </div>
          </div>
        </section>
        <div className="file-upload-progress-bar">
          { (this.props.csv.isSubmitInProgress) &&
            <table className="table is-fullwidth is-bordered is-narrow">
              <tbody>
                <tr>
                  <td className="progress-bar">
                    <progress className="progress is-small" value={this.state.progressBarInt} max="100">{this.state.progressBarInt}%</progress>
                  </td>
                  <td className="progress-value">
                    {this.state.progressBar.toFixed(2)}%
                  </td>
                  <td className="controls">
                    <div className="buttons has-addons">
                      {this.props.csv.isFilePaused && startButton}
                      {!this.props.csv.isFilePaused && pauseButton}
                      {cancelButton}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          }
        </div>
        {/* ADD CUSTOM FIELD MODAL */}
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={(values, actions) => this.handleSubmit(values, actions)}
          render={({
            values,
            touched,
            dirty,
            errors,
            status,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
            setFieldTouched,
            isSubmitting
          }) => (
            <form onSubmit={handleSubmit}>
              <div className={`modal ${this.props.csv.addCustomFieldModalActive ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                  <header className="modal-card-head">
                    <p className="modal-card-title">Add Custom Field</p>
                    <button className="delete" onClick={() => this.handleToggleAddCustomFieldModal('close')} aria-label="close"></button>
                  </header>
                  <section className="modal-card-body">
                    {/* FRIENDLY NAME */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Friendly name</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className={`input ${errors.friendlyName && touched.friendlyName && 'is-danger'}`}
                              type="text"
                              placeholder="e.g. Report Metadata"
                              name="friendlyName"
                              value={values.friendlyName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </div>
                          { errors.friendlyName && touched.friendlyName ? (
                            <p className="help is-danger">{errors.friendlyName}</p>
                          ) : (
                            <p className="help">The name shown in the <b>SOLR FIELDS</b> column.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* SOLR DOCUMENT KEY */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Solr key</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className={`input ${errors.keyName && touched.keyName && 'is-danger'}`}
                              type="text"
                              placeholder="e.g. report_metadata"
                              name="keyName"
                              value={values.keyName}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </div>
                          { errors.keyName && touched.keyName ? (
                            <p className="help is-danger">{errors.keyName}</p>
                          ) : (
                            <p className="help">The key name in the Solr</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* SOLR KEY SUFFIX*/}
                    <MySelect
                      options={[
                        { value: "_attr", label: "_attr" },
                        { value: "_attrs", label: "_attrs" },
                        { value: "_id", label: "_id" }
                      ]}
                      field="suffix"
                      label="Suffix"
                      value={values.suffix}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      error={errors.suffix}
                      touched={touched.suffix}
                      isMulti={false}
                      isHorizontal={true}
                      tip="The dynamic suffix applied to the solr key. E.g. report_metadata_attr"
                    />

                    {/* INPUT TYPE*/}
                    <MySelect
                      options={[
                        { value: "select", label: "From File" },
                        { value: "text", label: "Manual" }
                      ]}
                      field="inputType"
                      label="Input Type"
                      value={values.inputType}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      error={errors.inputType}
                      touched={touched.inputType}
                      isMulti={false}
                      isHorizontal={true}
                      tip="Whether the field will be a select dropdown of text input (manual) field."
                    />

                    {/* LOCK INPUT TYPE*/}
                    <MySelect
                      options={[
                        { value: "no", label: "No" },
                        { value: "yes", label: "Yes" }
                      ]}
                      field="lockInput"
                      label="Lock Input?"
                      value={values.lockInput}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      error={errors.lockInput}
                      touched={touched.lockInput}
                      isMulti={false}
                      isHorizontal={true}
                      tip="Allow the input type to be toggled."
                    />

                    {/* REQUIRED TYPE */}
                    <MySelect
                      options={[
                        { value: "none", label: "None" },
                        { value: "soft", label: "Soft (Warning)" },
                        { value: "hard", label: "Hard (Error)" }
                      ]}
                      field="requiredType"
                      label="Required Type"
                      value={values.requiredType}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      error={errors.requiredType}
                      touched={touched.requiredType}
                      isMulti={false}
                      isHorizontal={true}
                      tip="Does not filling out the field trigger a warning/error?"
                    />

                    {/* VALIDATION MESSAGE */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Validation Message</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <textarea
                              className={`input ${errors.validationMessage && touched.validationMessage && 'is-danger'}`}
                              placeholder="e.g. The Report Metadata is required in order to start an ingestion job."
                              name="validationMessage"
                              value={values.validationMessage}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                            </textarea>
                          </div>
                          { errors.validationMessage && touched.validationMessage ? (
                            <p className="help is-danger">{errors.validationMessage}</p>
                          ) : (
                            <p className="help">The validation message to display when a warning/error is triggered.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      type="submit"
                      className={`button is-primary ${isSubmitting ? 'is-loading' : ''}`}
                      disabled={isSubmitting}
                    >
                      Create Field
                    </button>
                    <button className="button" onClick={() => this.handleToggleAddCustomFieldModal('close')}>Cancel</button>
                    { status && status.msg &&
                      <p className="help is-danger">{status.msg}</p>
                    }
                  </footer>
                </div>
              </div>
            </form>
          )}
        />
      </div>
    )
  }
}
