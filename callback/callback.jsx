import React, { Component } from 'react';
import { CallbackComponent } from "redux-oidc";
import userManager from "../src/utils/userManager";
import Transient from '../src/components/Transient';

export default class Callback extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={(user) => {
          return window.location = user.state.redirectUrl;
        }}
        errorCallback={error => {
          console.error(error);
          return window.location = "/";
        }}
        >
        <Transient/>
      </CallbackComponent>
    );
  }
}
