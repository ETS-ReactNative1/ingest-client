import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import Navbar from '../containers/navbar_container'

import IngestCSV from '../containers/ingest_csv_container'
import IngestDatabase from '../containers/ingest_database_container'
import IngestApi from '../containers/ingest_api_container'

const routes = [
  {
    path: "/csv",
    exact: true,
    main: () => <IngestCSV/>
  },
  {
    path: "/database",
    main: () => <IngestDatabase/>
  },
  {
    path: "/api",
    main: () => <IngestApi/>
  }
];

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentDidMount() {
    return this.props.getCoreName()
      .then(() => this.props.getNumDocs())
      .then(() => this.props.receiveNumDocs())
  }

  render() {

    const numberWithCommas = (x) => {
      try {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;
      }
      catch(err) {
        return "0"
      }
    }

    return (
      <div id="ingest">
        <Navbar/>
        <div className="main">
          <div className="left-panel">
            <section className="section">
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
                  <div>
                    {routes.map((route, index) => (
                      <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        component={route.main}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}
