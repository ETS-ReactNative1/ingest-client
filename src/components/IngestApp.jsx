import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Navbar from '../containers/navbar_container'
import Loading from '../containers/loading_container'



const App = () => {
  return (
    <div id="ingest">
      <Navbar/>
      <div class="tabs is-medium">
        <ul>
          <li className="is-active"><a>Test</a></li>
          <li><a>Test2</a></li>
          <li><a>Test3</a></li>
          <li><a>Test4</a></li>
        </ul>
      </div>
    </div>
  )
}

export default class IngestApp extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
      // return this.props.me()
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <App/>
      </div>
    )
  }
}
