import { connect } from 'react-redux'
import IngestApp from '../components/IngestApp.jsx'
import {
  connect as connectSocket,
  disconnect as disconnectSocket,
  onDisconnected as onSocketDisconnected,
  onReconnecting as onSocketReconnecting,
  onReconnectSuccess as onSocketReconnectSuccess,
  onReconnectFailure as onSocketReconnectFailure
} from '../actions/socket'

function mapStateToProps(state) {
  return {
    router: state.router,
    socket: state.socket,
    oidc: state.oidc
  };
}

const ingestContainer = connect(mapStateToProps, {
  connectSocket,
  disconnectSocket,
  onSocketDisconnected,
  onSocketReconnecting,
  onSocketReconnectSuccess,
  onSocketReconnectFailure
})(IngestApp);

export default ingestContainer;
