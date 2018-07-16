const initialState = {
  isConnecting: true
};

export function socketReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SOCKET_CONNECT':
      return {
        ...state,
        isConnecting: true,
      };
    case 'SOCKET_CONNECT_SUCCESS':
      return {
        ...state,
        isConnecting: false,
        connectError: null,
      };
    case 'SOCKET_CONNECT_FAIL':
      return {
        ...state,
        isConnecting: false,
        connectError: action.error,
      };
    case 'SOCKET_DISCONNECT':
      return {
        ...state,
        isDisconnecting: true,
      };
    case 'SOCKET_DISCONNECT_SUCCESS':
      return {
        ...state,
        isDisconnecting: true,
        disconnectError: null,
      };
    case 'SOCKET_DISCONNECT_FAIL':
      return {
        ...state,
        isDisconnecting: false,
        disconnectError: action.error,
      };
    case 'SOCKET_DISCONNECTED':
      return {
        ...state,
        isConnecting: true
      }
    default:
      return state;
  }
}
