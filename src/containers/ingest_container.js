import { connect } from 'react-redux'
import IngestApp from '../components/IngestApp.jsx'

function mapStateToProps(state) {
  return {
    router: state.router
  };
}

const ingestContainer = connect(mapStateToProps, {})(IngestApp);

export default ingestContainer;
