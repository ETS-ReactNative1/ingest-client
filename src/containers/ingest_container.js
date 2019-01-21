import { connect } from 'react-redux'
import IngestApp from '../components/IngestApp.jsx'
import { me } from '../actions/auth'
import { loaded } from '../actions/app'
import {
  connect as connectSocket,
  onDisconnected as onSocketDisconnected,
  onReconnecting as onSocketReconnecting,
  onReconnectSuccess as onSocketReconnectSuccess,
  onReconnectFailure as onSocketReconnectFailure
} from '../actions/socket'

function mapStateToProps(state) {
  return {
    router: state.router,
    auth: state.auth,
    socket: state.socket,
    load: state.load,
    oidc: state.oidc
  };
}

const ingestContainer = connect(mapStateToProps, {
  me,
  loaded,
  connectSocket,
  onSocketDisconnected,
  onSocketReconnecting,
  onSocketReconnectSuccess,
  onSocketReconnectFailure
})(IngestApp);

export default ingestContainer;
