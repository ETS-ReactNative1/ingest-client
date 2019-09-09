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

const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
})
const initialState = {}
const socketClient = new SocketClient();
const apiClient = axios.create({
  baseURL: `${window.location.protocol}//${window._env_.API_HOST}`,
  responseType: 'json',
  withCredentials: true
});
const store = configureStore(initialState, socketClient, apiClient, history);
loadUser(store, userManager);

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
