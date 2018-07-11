import { connect } from 'react-redux'
import App from '../components/App.jsx'

function mapStateToProps(state) {
  return {
    router: state.router
  };
}

const appContainer = connect(mapStateToProps, {})(App);

export default appContainer;
