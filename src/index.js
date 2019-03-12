import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/Root";
import "./style/style.scss";

import SocketClient from "./helpers/SocketClient";
import ApiClient from "./helpers/ApiClient";
import configureStore from "./store/store";

const initialState = {};
const socketClient = new SocketClient();
const apiClient = new ApiClient();

const store = configureStore(initialState, socketClient, apiClient);

ReactDOM.render(<Root store={store} />, document.getElementById("root"));
