import { connect } from 'react-redux'
import App from '../components/App.jsx'
import {
  getCoreName,
  getNumDocs,
  receiveNumDocs
} from '../actions/solr'

import {
  getIngestPage,
  deleteIngestRecord,
  receiveIngestRecordStatusUpdate
 } from '../actions/ingest'

function mapStateToProps(state) {
  return {
    router: state.router,
    solr: state.solr,
    ingest: state.ingest
  };
}

const appContainer = connect(mapStateToProps, {
  getCoreName,
  getNumDocs,
  receiveNumDocs,
  getIngestPage,
  deleteIngestRecord,
  receiveIngestRecordStatusUpdate
})(App);

export default appContainer;
