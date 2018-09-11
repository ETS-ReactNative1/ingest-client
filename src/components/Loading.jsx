import React, { Component } from 'react';

export default class Loading extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="load">
        <div className="message">{this.props.load.message}</div>
      </div>
    )
  }
}
