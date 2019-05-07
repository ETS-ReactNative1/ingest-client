const initialState = {
  status: 'waiting for socket.io client',
  className: 'is-warning',
  isConnecting: false,
  isReconnecting: false,
  isDisconnecting: false,
  reconnectionAttempts: 0,
  isConnected: false,
  connectError: null,
  disconnectError: null
};

export function socketReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SOCKET_CONNECT':
      return {
        ...state,
        status: 'websocket connecting',
        className: 'is-warning',
        isConnecting: true,
        isReconnecting: false,
        isDisconnecting: false,
        reconnectionAttempts: 0,
        connectError: null,
        disconnectError: null
      };
    case 'SOCKET_CONNECT_SUCCESS':
      return {
        ...state,
        status: 'websocket connected',
        className: 'is-success',
        isConnecting: false,
        isReconnecting: false,
        isDisconnecting: false,
        reconnectionAttempts: 0,
        isConnected: true,
        connectError: null,
        disconnectError: null
      };
    case 'SOCKET_CONNECT_FAIL':
      return {
        ...state,
        status: 'websocket connection failure',
        className: 'is-danger',
        isConnecting: false,
        isReconnecting: false,
        isDisconnecting: false,
        reconnectionAttempts: 0,
        isConnected: false,
        connectError: action.error,
        disconnectError: null
      };
    case 'SOCKET_DISCONNECT':
      return {
        ...state,
        status: 'websocket disconnecting',
        className: 'is-warning',
        isConnecting: false,
        isReconnecting: false,
        isDisconnecting: true,
        reconnectionAttempts: 0,
        connectError: null,
        disconnectError: null
      };
    // case 'SOCKET_DISCONNECT_SUCCESS':
    //   return {
    //     ...state,
    //     isConnecting: false,
    //     isConnected: false,
    //     isDisconnecting: false,
    //     connectError: null,
    //     disconnectError: null
    //   };
    // case 'SOCKET_DISCONNECT_FAIL':
    //   return {
    //     ...state,
    //     isConnecting: false,
    //     isConnected: false,
    //     isDisconnecting: false,
    //     connectError: null,
    //     disconnectError: action.error,
    //   };
    case 'SOCKET_DISCONNECTED':
      return {
        ...state,
        status: 'websocket disconnected',
        className: 'is-danger',
        isConnecting: false,
        isReconnecting: false,
        isDisconnecting: false,
        reconnectionAttempts: 0,
        isConnected: false,
        connectError: null,
        disconnectError: null,
      }
    case 'SOCKET_RECONNECTING':
      return {
        ...state,
        status: `websocket reconnection attempt #${state.reconnectionAttempts + 1}`,
        className: 'is-warning',
        isConnecting: false,
        isReconnecting: true,
        isDisconnecting: false,
        reconnectionAttempts: state.reconnectionAttempts + 1,
        isConnected: false,
        connectError: null,
        disconnectError: null
      }
    case 'SOCKET_RECONNECT_SUCCESS':
     return {
       ...state,
       status: 'websocket reconnected',
       className: 'is-success',
       isConnecting: false,
       isReconnecting: false,
       isDisconnecting: false,
       reconnectionAttempts: 0,
       isConnected: true,
       connectError: null,
       disconnectError: null
     }
    case 'SOCKET_RECONNECT_FAILURE':
      return {
        ...state,
        status: 'websocket reconnect failure',
        className: 'is-danger',
        isConnecting: false,
        isReconnecting: false,
        isDisconnecting: false,
        isConnected: false,
        connectError: action.error,
        disconnectError: null
      }
    default:
      return state;
  }
}
