import { connect } from 'react-redux'
import IngestCSV from '../components/IngestCSV.jsx'
import { ingest, parseHeader, initial as getInitial, pair, addText, toggleInput } from '../actions/csv'

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
  toggleInput
})(IngestCSV);

export default ingestCSVContainer;
