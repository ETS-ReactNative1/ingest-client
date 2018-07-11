import { connect } from 'react-redux'
import App from '../components/App.jsx'
import { me } from '../actions/session'

function mapStateToProps(state) {
  return {
    session: state.session,
    router: state.router
  };
}

const appContainer = connect(mapStateToProps, {
  me
})(App);

export default appContainer;
