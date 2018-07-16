import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import IngestApp from '../containers/ingest_container.js';
import { ConnectedRouter } from 'react-router-redux'
import history from '../helpers/history'

const Root = ({ store }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
        <Route path='/' component={IngestApp} />
    </ConnectedRouter>
  </Provider>
);

export default Root;
