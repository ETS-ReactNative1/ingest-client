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
  }

  render() {
    return (
      <div id="ingest">
        <Navbar/>
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-half is-offset-one-quarter">
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
          </div>
        </section>
      </div>
    )
  }
}
