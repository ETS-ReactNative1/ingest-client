import { connect } from 'react-redux'
import IngestCSV from '../components/IngestCSV.jsx'
import {
  parseHeader,
  initial as getInitial,
  pair,
  addText,
  toggleInput,
  receiveCsvIngestUpdate,
  createIngestRecord,
  scheduleIngestJob,
  fileUploadStarted,
  fileUploadSuccess,
  fileUploadFailure,
  fileUploadPaused,
  fileUploadCancelled,
  fileUploadResume,
  toggleAddCustomFieldModal,
  saveCustomField,
  deleteCustomField
} from '../actions/csv'

function mapStateToProps(state) {
  return {
    router: state.router,
    csv: state.csv
  };
}

const ingestCSVContainer = connect(mapStateToProps, {
  getInitial,
  pair,
  parseHeader,
  addText,
  toggleInput,
  receiveCsvIngestUpdate,
  createIngestRecord,
  scheduleIngestJob,
  fileUploadStarted,
  fileUploadSuccess,
  fileUploadFailure,
  fileUploadPaused,
  fileUploadCancelled,
  fileUploadResume,
  toggleAddCustomFieldModal,
  saveCustomField,
  deleteCustomField
})(IngestCSV);

export default ingestCSVContainer;
