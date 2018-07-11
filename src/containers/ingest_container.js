import { connect } from 'react-redux'
import IngestApp from '../components/IngestApp.jsx'
import { me } from '../actions/session'

function mapStateToProps(state) {
  return {
    session: state.session,
    router: state.router
  };
}

const ingestContainer = connect(mapStateToProps, {
  me
})(IngestApp);

export default ingestContainer;
