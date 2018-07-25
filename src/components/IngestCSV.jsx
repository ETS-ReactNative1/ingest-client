import React, { Component } from 'react';
import Papa from 'papaparse';
import filesize from 'filesize';
import Toggle from 'react-toggle'
import "react-toggle/style.css" // for ES6 modules
import Resumable from 'resumablejs'
import $ from "jquery";

export default class IngestCSV extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      progressBar: 0,
      progressBarInt: 0,
      messageStatus: '',
      fileList: {files: []},
      isPaused: false
    };
  }

  componentWillMount() {
  }

  componentDidMount() {

    let ResumableField = new Resumable({
      target: `${process.env.REACT_APP_API_URL}/upload`,
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
      return this.props.scheduleIngestJob(this.props.csv.ingestId)
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
      .then(() => this.props.receiveCsvIngestUpdate())
  }

  handleUploadFile = (event) => {
    return this.props.parseHeader(event)
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

    // this.setState({
    //   [name]: value
    // });

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

  handleStartIngest = () => {
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

  render() {
    const isSubmitInProgress = this.props.csv.isSubmitInProgress;

    const startButton = <span disabled={this.props.csv.isFileUploading || this.props.csv.isFileUploaded} className="button is-info is-outline" onClick={() => this.handleResumeFileUpload()}>
                          <i className="fas fa-play"></i>
                        </span>;

    const pauseButton = <span disabled={!this.props.csv.isFileUploading || this.props.csv.isFileUploaded} className="button is-info is-outline" onClick={() => this.handlePauseFileUpload()}>
                          <i className="fas fa-pause"></i>
                        </span>;

    const cancelButton = <span disabled={this.props.csv.isFileUploaded} className="button is-info is-outline" onClick={() => this.handleCancelFileUpload()}>
                          <i className="fas fa-times"></i>
                        </span>;

    function validationClass(requiredType, isError) {
      if (isError) {
        if (requiredType === 'hard') {
          return 'validation-error';
        } else {
          return 'validation-warning';
        }
      } else {
        return '';
      }
    }

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
                        <i className="fas fa-upload"></i>
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
                  <table className="table is-fullwidth">
                    <thead>
                      <tr>
                        <th>SOLR FIELDS</th>
                        <th>SOURCE FIELDS</th>
                        <th>Use CSV?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.csv.destinationArr.map((dest, index) => (
                        <React.Fragment key={index}>
                          <tr className={`mapping-main-row ${validationClass(dest.requiredType, this.props.csv.form.errors[dest.key])}`}>
                            <td className="solr-field-name">{dest.name}</td>
                            { dest.type == 'select' &&
                              <td>
                                <div className="select">
                                  <select
                                    onChange={(e) => this.handlePair(dest.key, e)}
                                    name="sourceField"
                                    defaultValue="default"
                                  >
                                    <option value="default" disabled="disabled">Select Source Field</option>
                                    {this.props.csv.sourceArr.map(x => <option value={x.key} key={x.key}>{x.name}</option>)}
                                  </select>
                                </div>
                              </td>
                            }
                            { dest.type == 'text' &&
                              <td>
                                <input
                                  className="input"
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
                              />
                            </td>
                          </tr>
                          { this.props.csv.form.errors[dest.key] &&
                          <tr className={`mapping-validation-message-row ${ dest.requiredType == 'hard' ? 'validation-error' : 'validation-warning'}`}>
                            <td colSpan="3"><span className="validation-title">{`${dest.name} ${dest.requiredType == 'hard' ? 'Error' : 'Warning'}`}:&nbsp;</span><span>{dest.validationMessage}</span></td>
                          </tr>
                          }
                        </React.Fragment>
                      ))}

                    </tbody>
                  </table>
                </div>
              </div>
              <div className="start-ingest">
                <a className={`button is-link ${isSubmitInProgress ? 'is-loading' : ''}`} onClick={() => this.handleStartIngest()} disabled={isSubmitInProgress ? true : false}>{isSubmitInProgress ? 'Ingesting...' : 'Start Ingest'}</a>
              </div>
              { this.props.csv.status &&
                <div className="status">Status: {this.props.csv.status}</div>
              }
            </div>
          </div>
        </section>
        <div className="file-upload-progress-bar">
          { (this.props.csv.isSubmitInProgress || this.props.csv.isSubmitSuccessful) &&
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
      </div>
    )
  }
}
