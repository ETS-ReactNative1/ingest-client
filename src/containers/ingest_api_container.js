import { connect } from 'react-redux'
import IngestApi from '../components/IngestApi.jsx'
import { me } from '../actions/session'

function mapStateToProps(state) {
  return {
    session: state.session,
    router: state.router
  };
}

const ingestApiContainer = connect(mapStateToProps, {
  me
})(IngestApi);

export default ingestApiContainer;
