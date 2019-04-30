import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import userManager from "../utils/userManager";
import { push } from 'connected-react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class NavbarTop extends Component {

  constructor(props) {
    super(props);
  }

  handleLogout = () => {
    return userManager.signoutRedirect();
  }

  render() {
    return (
      <nav className="navbar-sso navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a role="button"  onClick={(e) => this.props.toggle(e)} className="hamburger navbar-item">
            <FontAwesomeIcon
              icon="bars"
              className="sso-bars"
            />
          </a>
          <a role="button" href="/" className="brandname navbar-item">ClarityNLP</a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">

          <div className="navbar-end">
            { this.props.oidc.user &&
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">
                  <span>{`${this.props.oidc.user.profile.name}`}</span>
                </a>

                <div className="navbar-dropdown is-right">
                  <a
                    className="navbar-item"
                    onClick={() => this.handleLogout()}
                  >
                    Logout
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      </nav>

    )
  }
}

export default NavbarTop
