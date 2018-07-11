import { connect } from 'react-redux'
import IngestDatabase from '../components/IngestDatabase.jsx'
import { me } from '../actions/session'

function mapStateToProps(state) {
  return {
    session: state.session,
    router: state.router
  };
}

const ingestDatabaseContainer = connect(mapStateToProps, {
  me
})(IngestDatabase);

export default ingestDatabaseContainer;
