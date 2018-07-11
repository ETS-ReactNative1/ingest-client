import { connect } from 'react-redux'
import IngestDatabase from '../components/IngestDatabase.jsx'

function mapStateToProps(state) {
  return {
    router: state.router
  };
}

const ingestDatabaseContainer = connect(mapStateToProps, {
})(IngestDatabase);

export default ingestDatabaseContainer;
