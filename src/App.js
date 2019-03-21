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
  baseURL: `http://${window._env_.REACT_APP_API_HOST}`,
  responseType: 'json',
  withCredentials: true
});
const store = configureStore(initialState, socketClient, apiClient, history);
loadUser(store, userManager);

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById('root')
);
