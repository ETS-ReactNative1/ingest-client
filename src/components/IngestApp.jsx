import React, { Component } from 'react';
import App from '../containers/app_container';
import Transient from './Transient';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faSpinner, faUpload, faTimes, faPlay, faPause, faPlug } from '@fortawesome/free-solid-svg-icons';
library.add(faBars, faSpinner, faUpload, faTimes, faPlay, faPause, faPlug);

export default class IngestApp extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    return this.props.connectSocket()
    .then(() => this.props.onSocketDisconnected())
    .then(() => this.props.onSocketReconnecting())
    .then(() => this.props.onSocketReconnectSuccess())
    .then(() => this.props.onSocketReconnectFailure())
  }

  componentWillUnmount() {
    return this.props.disconnectSocket();
  }

  render() {
    return (
      <React.Fragment>
        {this.props.oidc.user ? <App/> : <Transient/>}
      </React.Fragment>
    )
  }
}
