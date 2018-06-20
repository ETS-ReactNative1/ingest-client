import { connect } from 'react-redux'
import Navbar from '../components/Navbar'

function mapStateToProps(state) {
  return {
  };
}


const navbarContainer = connect(mapStateToProps, {})(Navbar);

export default navbarContainer;
