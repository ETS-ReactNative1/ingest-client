import { connect } from 'react-redux'
import IngestCSV from '../components/IngestCSV.jsx'
import {
  ingest,
  parseHeader,
  initial as getInitial,
  pair,
  addText,
  toggleInput,
  receiveCsvIngestUpdate
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
  ingest,
  parseHeader,
  addText,
  toggleInput,
  receiveCsvIngestUpdate
})(IngestCSV);

export default ingestCSVContainer;
