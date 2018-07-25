import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import Loading from '../containers/loading_container'
import App from '../containers/app_container'

export default class IngestApp extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    return this.props.me()
    .then(() => this.props.connectSocket())
    .then(() => this.props.loaded())
    .then(() => this.props.onSocketDisconnected())
    .then(() => this.props.onSocketReconnecting())
    .then(() => this.props.onSocketReconnectSuccess())
    .then(() => this.props.onSocketReconnectFailure())
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        {this.props.load.isActive ? <Loading/> : <App/>}
      </div>
    )
  }
}
