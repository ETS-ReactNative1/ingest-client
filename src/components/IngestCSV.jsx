import React, { Component } from 'react';
import Papa from 'papaparse';
import filesize from 'filesize';
import Toggle from 'react-toggle'
import "react-toggle/style.css" // for ES6 modules

export default class IngestCSV extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
  }

  componentDidMount() {
    return this.props.getInitial()
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

    this.setState({
      [name]: value
    });

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
    return this.props.ingest(this.props.csv.destinationArr, this.props.csv.file);
  }

  render() {
    const isIngesting = this.props.csv.isIngesting;
    return (
      <div>
        <div className="file-upload">
          <div className="file">
            <label className="file-label">
              <input className="file-input" type="file" onChange={this.handleUploadFile}/>
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">
                  {!this.props.csv.isLoading && !this.props.csv.loadAttempted &&
                    <span>Parse CSV Headers</span>
                  }
                  {this.props.csv.isLoading &&
                    <span>Parsing...</span>
                  }
                  {!this.props.csv.isLoading && this.props.csv.loadError && this.props.csv.loadAttempted &&
                    <span>Error Parsing</span>
                  }
                  {!this.props.csv.isLoading && !this.props.csv.loadError && this.props.csv.loadAttempted &&
                    <span>Parsing Successful</span>
                  }
                </span>
              </span>
            </label>
          </div>
          {this.props.csv.file &&
            <div>
              <span className="file-meta">Filesize: {filesize(this.props.csv.file.size)}</span>
              <span className="file-meta">Filename: {this.props.csv.file.name}</span>
            </div>
          }
          <br/>
        </div>
        <div className="field-mapping">
          <table className="table is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>Solr</th>
                <th>Source</th>
                <th>Select?</th>
              </tr>
            </thead>
            <tbody>
              {this.props.csv.destinationArr.map((dest, index) => (
                <tr key={index}>
                  <td className="solr-field-name">{dest.name}</td>
                  { dest.type == 'select' &&
                    <td>
                      <div className="select">
                        <select
                          onChange={(e) => this.handlePair(dest.key, e)}
                          name="sourceField"
                        >
                          <option>Select Source Field</option>
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
              ))}

            </tbody>
          </table>
        </div>
        <div className="start-ingest">
          <a className="button is-link" onClick={() => this.handleStartIngest()}>{isIngesting ? 'Ingesting...' : 'Start Ingest'}</a>
        </div>
      </div>
    )
  }
}
