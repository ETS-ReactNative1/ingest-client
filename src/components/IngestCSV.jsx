import React, { Component } from 'react';
import Papa from 'papaparse';
import filesize from 'filesize';
import Toggle from 'react-toggle'
import "react-toggle/style.css" // for ES6 modules
import Resumable from 'resumablejs'
import $ from "jquery";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

  componentWillMount() {
  }

  componentDidMount() {

    let ResumableField = new Resumable({
      target: `${process.env.REACT_APP_API_HOST}/api/ingest/upload`,
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
  }

  handleToggleAddCustomFieldModal = (action) => {
    return this.props.toggleAddCustomFieldModal(action);
  }

  handleCustomFieldFormInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      customFieldForm: {
        ...this.state.customFieldForm,
        [name]: value
      }
    });
  }

  handleDeleteCustomField = (fieldId, isDefaultField) => {
    if (!isDefaultField) { //since `disabled` input still propagating onClick event
      return this.props.deleteCustomField(fieldId);
    }
  }

  handleSaveCustomField = (form) => {
    return this.props.saveCustomField(form)
      .then(() => this.props.toggleAddCustomFieldModal('close'))
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
        } else {
          return !forInput ? 'validation-warning' : 'is-warning';
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
                          { this.props.csv.form.errors[dest.key] &&
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
                        className="input"
                        type="text"
                        placeholder="e.g. Report Metadata"
                        value={this.state.customFieldForm.friendlyName}
                        name="friendlyName"
                        onChange={(e) => this.handleCustomFieldFormInputChange(e)}
                      />
                    </div>
                    <p className="help">
                      The name shown in the <b>SOLR FIELDS</b> column.
                    </p>
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
                        className="input"
                        type="text"
                        placeholder="e.g. report_metadata"
                        value={this.state.customFieldForm.keyName}
                        name="keyName"
                        onChange={(e) => this.handleCustomFieldFormInputChange(e)}
                      />
                    </div>
                    <p className="help">
                      The key name in the Solr
                    </p>
                  </div>
                </div>
              </div>

              {/* SOLR KEY SUFFIX*/}
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Suffix</label>
                </div>
                <div className="field-body">
                  <div className="field is-narrow">
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={this.state.customFieldForm.suffix}
                          name="suffix"
                          onChange={(e) => this.handleCustomFieldFormInputChange(e)}
                        >
                          <option value="_attr">_attr</option>
                          <option value="_attrs">_attrs</option>
                          <option value="_id">_id</option>
                        </select>
                      </div>
                    </div>
                    <p className="help">
                      The dynamic suffix applied to the solr key. E.g. report_metadata_attr
                    </p>
                  </div>
                </div>
              </div>

              {/* INPUT TYPE*/}
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Input type</label>
                </div>
                <div className="field-body">
                  <div className="field is-narrow">
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={this.state.customFieldForm.inputType}
                          name="inputType"
                          onChange={(e) => this.handleCustomFieldFormInputChange(e)}
                        >
                          <option value="select">From File</option>
                          <option value="text">Manual</option>
                        </select>
                      </div>
                    </div>
                    <p className="help">
                      Whether the field will be a select dropdown of text input (manual) field.
                    </p>
                  </div>
                </div>
              </div>

              {/* LOCK INPUT TYPE*/}
              <div className="field is-horizontal">
                <div className="field-label">
                  <label className="label">Lock Input Type?</label>
                </div>
                <div className="field-body">
                  <div className="field is-narrow">
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={this.state.customFieldForm.lockInput}
                          name="lockInput"
                          onChange={(e) => this.handleCustomFieldFormInputChange(e)}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                    </div>
                    <p className="help">
                      Allow the input type to be toggled.
                    </p>
                  </div>
                </div>
              </div>

              {/* REQUIRED TYPE */}
              <div className="field is-horizontal">
                <div className="field-label">
                  <label className="label">Required Type</label>
                </div>
                <div className="field-body">
                  <div className="field is-narrow">
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={this.state.customFieldForm.requiredType}
                          name="requiredType"
                          onChange={(e) => this.handleCustomFieldFormInputChange(e)}
                        >
                          <option value="none">None</option>
                          <option value="soft">Soft (Warning)</option>
                          <option value="hard">Hard (Error)</option>
                        </select>
                      </div>
                    </div>
                    <p className="help">
                      Does not filling out the field trigger a warning/error?
                    </p>
                  </div>
                </div>
              </div>

              {/* VALIDATION MESSAGE */}
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Validation Message</label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <div className="control">
                      <textarea
                        className="textarea"
                        placeholder="e.g. The Report Metadata is required in order to start an ingestion job."
                        name="validationMessage"
                        value={this.state.customFieldForm.validationMessage}
                        onChange={(e) => this.handleCustomFieldFormInputChange(e)}
                      >
                      </textarea>
                    </div>
                    <p className="help">
                      The validation message to display when a warning/error is triggered.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={() => this.handleSaveCustomField(this.state.customFieldForm)}>Save changes</button>
              <button className="button" onClick={() => this.handleToggleAddCustomFieldModal('close')}>Cancel</button>
            </footer>
          </div>
        </div>
      </div>
    )
  }
}
