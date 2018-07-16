import { connect } from 'react-redux'
import App from '../components/App.jsx'
import {
  getCoreName,
  getNumDocs,
  receiveNumDocs
} from '../actions/solr'

function mapStateToProps(state) {
  return {
    router: state.router,
    solr: state.solr
  };
}

const appContainer = connect(mapStateToProps, {
  getCoreName,
  getNumDocs,
  receiveNumDocs
})(App);

export default appContainer;
