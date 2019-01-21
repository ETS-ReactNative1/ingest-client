import React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import IngestApp from '../containers/ingest_container';
import { ConnectedRouter } from 'connected-react-router';
import userManager from '../utils/userManager';
import { OidcProvider } from 'redux-oidc';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <OidcProvider store={store} userManager={userManager}>
      <ConnectedRouter history={history}>
          <Route path='/' component={IngestApp} />
      </ConnectedRouter>
    </OidcProvider>
  </Provider>
);

export default Root;
