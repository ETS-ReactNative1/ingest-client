import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Loading from '../containers/loading_container';
import App from '../containers/app_container';
import Transient from './Transient';
import userManager from "../utils/userManager";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faSpinner } from '@fortawesome/free-solid-svg-icons';
library.add(faBars, faSpinner);

export default class IngestApp extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // return this.props.me()
    // .then(() => this.props.connectSocket())
    // .then(() => this.props.loaded())
    // .then(() => this.props.onSocketDisconnected())
    // .then(() => this.props.onSocketReconnecting())
    // .then(() => this.props.onSocketReconnectSuccess())
    // .then(() => this.props.onSocketReconnectFailure())
  }

  render() {
    return (
      <React.Fragment>
        {this.props.oidc.user ? <App/> : <Transient/>}
      </React.Fragment>
    )
  }
}
