import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Transient extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="transient">
        <FontAwesomeIcon
          icon="spinner"
          spin
          className="transient-spinner"
        />
      </div>
    )
  }
}
