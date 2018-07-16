import { connect } from 'react-redux'
import Loading from '../components/Loading'

function mapStateToProps(state) {
  return {
    router: state.router,
    socket: state.socket,
    auth: state.auth,
    load: state.load
  };
}


const loadingContainer = connect(mapStateToProps, {})(Loading);

export default loadingContainer;
