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
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        {!this.props.session.loaded ? <Loading/> : <App/>}
      </div>
    )
  }
}
