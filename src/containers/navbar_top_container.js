import { connect } from 'react-redux'
import NavbarTop from '../components/NavbarTop'
import { push } from 'connected-react-router'

function mapStateToProps(state) {
  return {
    router: state.router,
    oidc: state.oidc,
    socket: state.socket
  };
}

const navbarTopContainer = connect(mapStateToProps, {
  push,
})(NavbarTop);

export default navbarTopContainer;
