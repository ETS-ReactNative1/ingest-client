import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import history from '../helpers/history'

export default class Navbar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mobileMenuActive: false
    }
  }

  componentDidMount() {
  }

  handleActivateMobileMenu() {
    this.setState({
      mobileMenuActive: !this.state.mobileMenuActive
    })
  }

  render() {
    return (
      <nav className="navbar is-transparent">
        <div className="navbar-brand">
          <div className={`navbar-burger burger ${this.state.mobileMenuActive ? 'is-active' : ''}`} onClick={() => this.handleActivateMobileMenu()} data-target="navbar">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="navbar" className={`navbar-menu ${this.state.mobileMenuActive ? 'is-active' : ''}`}>
          <div className="navbar-start">
            <Link to="/" className="navbar-item">Ingest App</Link>
          </div>
        </div>
      </nav>
    )
  }
}
