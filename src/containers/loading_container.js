import { connect } from 'react-redux'
import Loading from '../components/Loading'

function mapStateToProps(state) {
  return {
    router: state.router
  };
}


const loadingContainer = connect(mapStateToProps, {})(Loading);

export default loadingContainer;
