import React, { Component } from 'react';
import { Route, Link, Redirect, Switch } from 'react-router-dom';
import NavbarTop from '../containers/navbar_top_container'
import IngestCSV from '../containers/ingest_csv_container'
import IngestDatabase from '../containers/ingest_database_container'
import IngestApi from '../containers/ingest_api_container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    FaCubes,
    FaPoll,
    FaFolder,
    FaChartBar,
    FaCog,
    FaBookOpen
} from "react-icons/fa";

const routes = [
  {
    path: "/csv",
    exact: true,
    main: () => <IngestCSV/>
  },
  {
    path: "/database",
    exact: false,
    main: () => <IngestDatabase/>
  },
  {
    path: "/api",
    exact: false,
    main: () => <IngestApi/>
  }
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      progressBar: 0,
      progressBarInt: 0,
      messageStatus: '',
      fileList: {files: []},
      isPaused: false,
      isMenuOpen: true,
    };
  }

  handleSlideoutToggle = (event) => {
    this.setState(prevState => ({
      isMenuOpen: !prevState.isMenuOpen
    }));
  }

  componentDidMount() {
    return this.props.getCoreName()
      .then(() => this.props.getNumDocs())
      .then(() => this.props.receiveNumDocs())
      .then(() => this.props.getIngestPage())
      .then(() => this.props.receiveIngestRecordStatusUpdate())
  }

  handleNextPage = () => {
    if (this.props.ingest.isNextDisabled) {
      return;
    }
    return this.props.getIngestPage(this.props.ingest.currentPage + 1)
  }

  handlePrevPage = () => {
    if (this.props.ingest.currentPage == 0) {
      return;
    }
    return this.props.getIngestPage(this.props.ingest.currentPage - 1)
  }

  handleDeleteIngestRecord = (ingestId) => {
    this.handleToggleDeleteIngestModal(ingestId, 'close');
    return this.props.deleteIngestRecord(ingestId);
  }

  handleToggleDeleteIngestModal = (ingestId, action) => {
    return this.props.toggleDeleteIngestModal(ingestId, action);
  }

  render() {

    const {
      REACT_APP_DASHBOARD_URL,
      REACT_APP_RESULTS_URL,
      REACT_APP_DOCUMETATION_URL
    } = window._env_;

    const numberWithCommas = (x) => {
      try {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;
      }
      catch(err) {
        return "0"
      }
    }

    function ingestStatusPill(status) {
      switch(status) {
        case 'deleted': {
          return <span className="tag is-light is-small">{status}</span>
        }
        case 'inProgress': {
          return <span className="tag is-warning is-small">{status}</span>
        }
        case 'completed': {
          return <span className="tag is-success is-small">{status}</span>
        }
        case 'failed': {
          return <span className="tag is-danger is-small">{status}</span>
        }
      }
    }

    return (
      <React.Fragment>
        <nav id="menu" className={ this.state.isMenuOpen ? 'open' : ''}>
          <div className="nav-links">
            <a href={`http://${REACT_APP_DASHBOARD_URL}`} className="nav-link has-text-centered">
              <span className="link-icon is-size-4">
                <FaPoll/>
              </span>
              Dashboard
            </a>
            <a className="nav-link has-text-centered active">
              <span className="link-icon is-size-4">
                <FaFolder/>
              </span>
              Documents
            </a>
            <a href={`http://${REACT_APP_RESULTS_URL}/runner`} className="nav-link has-text-centered">
              <span className="link-icon is-size-4">
                <FaCubes/>
              </span>
              Query Builder
            </a>
            <a href={`http://${REACT_APP_RESULTS_URL}`} className="nav-link has-text-centered">
              <span className="link-icon is-size-4">
                <FaChartBar/>
              </span>
              Results
            </a>
            <a href={REACT_APP_DOCUMETATION_URL} className="nav-link has-text-centered">
              <span className="link-icon is-size-4">
                <FaBookOpen />
              </span>
              Documentation
            </a>
          </div>
        </nav>
        <div id="ingest">
          <NavbarTop toggle={this.handleSlideoutToggle}/>
          <div className="main">
            <div className="left-panel">
              <section className="section">
                <h6 className="left-panel-title title is-6">Solr Stats</h6>
                <table id="solr-stats-table" className="table is-fullwidth">
                  <tbody>
                    <tr>
                      <td>Core</td>
                      <td><span className="tag core-name is-success">{this.props.solr.isCoreNameLoading ? 'Loading...' : this.props.solr.coreName}</span></td>
                    </tr>
                    <tr>
                      <td>Num Docs</td>
                      <td>{this.props.solr.isNumDocsLoading ? 'Loading...' : numberWithCommas(this.props.solr.numDocs)}</td>
                    </tr>
                  </tbody>
                </table>
              </section>
              <section>
                <h6 className="left-panel-title title is-6">Ingest Records</h6>
                { this.props.ingest.itemsArr.length > 0 &&
                <React.Fragment>
                <table id="ingest-table" className="table is-fullwidth">
                  <thead>
                    <tr className="ingest-meta-head">
                      <th>Time</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.ingest.itemsArr.map((item, index) => (
                      <tr className="ingest-meta" key={item.id}>
                        <td className="time">{item.friendlyTime}</td>
                        <td className="ingest-type">{item.type}</td>
                        <td className="ingest-status">{ingestStatusPill(item.status)}</td>
                        <td className="ingest-delete">
                          { item.status !== 'deleted' &&
                            <a
                              className="button is-small"
                              onClick={() => this.handleToggleDeleteIngestModal(item.id, 'open')}
                              disabled={item.confirmDeleteModalOpen}
                            >
                              <FontAwesomeIcon icon="times"/>
                            </a>
                          }
                          { item.confirmDeleteModalOpen &&
                            <div className="delete-modal">
                              <span>Are you sure?</span>
                              <a
                                className="button is-small is-danger delete-action"
                                onClick={() => this.handleDeleteIngestRecord(item.id)}
                              >
                              Delete
                              </a>
                              <a
                                className="button is-small cancel-action"
                                onClick={() => this.handleToggleDeleteIngestModal(item.id, 'close')}
                              >
                              Cancel
                              </a>
                            </div>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav className="pagination" role="navigation" aria-label="pagination">
                  <a
                    className="pagination-previous"
                    onClick={() => this.handlePrevPage()}
                    disabled={this.props.ingest.currentPage == 0}
                  >
                    Previous
                  </a>
                  <a
                    className="pagination-next"
                    onClick={() => this.handleNextPage()}
                    disabled={this.props.ingest.isNextDisabled}
                  >
                    Next
                  </a>
                </nav>
                </React.Fragment>
                }
                { this.props.ingest.itemsArr.length == 0 &&
                  <div className="notification empty-ingest-record-notification">
                    No ingest records found.
                  </div>
                }
              </section>
            </div>
            <div className="right-panel">
              <section className="section">
                <div className="columns">
                  <div className="column">
                    <div className="tabs is-toggle is-fullwidth">
                      <ul>
                        <li className={ this.props.router.location.pathname == '/csv' ? 'is-active' : ''}>
                          <Link to="/csv">CSV</Link>
                        </li>
                        <li className={ this.props.router.location.pathname == '/database' ? 'is-active' : ''}>
                          <Link to="/database">Database</Link>
                        </li>
                        <li className={ this.props.router.location.pathname == '/api' ? 'is-active' : ''}>
                          <Link to="/api">API</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
              <Switch>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                  />
                ))}
                <Redirect to="/csv"/>
              </Switch>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
