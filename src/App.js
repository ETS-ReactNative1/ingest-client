import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root';
import "./style/style.scss";
import axios from 'axios';
import { loadUser } from "redux-oidc";
import userManager from "./utils/userManager";
import SocketClient from './helpers/SocketClient';
import configureStore from './store/store';
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()
const initialState = {}
const socketClient = new SocketClient();
const apiClient = axios.create({
  baseURL:'http://localhost:5003', //TODO swap in env to ingest-api, do we need multi client config?
  responseType: 'json',
  withCredentials: true
});
const store = configureStore(initialState, socketClient, apiClient, history);
loadUser(store, userManager);

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
