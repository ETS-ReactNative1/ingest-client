import { connect } from 'react-redux'
import IngestApi from '../components/IngestApi.jsx'

function mapStateToProps(state) {
  return {
    router: state.router
  };
}

const ingestApiContainer = connect(mapStateToProps, {})(IngestApi);

export default ingestApiContainer;
