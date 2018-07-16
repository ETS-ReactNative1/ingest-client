const initialState = {
  isActive: true
};

export function loadReducer(state = initialState, action = {}) {
  switch(action.type) {
    case 'LOADED':
      return {
        ...state,
        isActive: false
      }
    case 'ME':
      return {
        ...state,
        isActive: true,
        message: 'Loading session...'
      };
    case 'ME_SUCCESS':
      return {
        ...state,
        isActive: true,
      };
    case 'ME_FAILURE':
      return {
        ...state,
        isActive: true,
        message: 'Problem loading session...'
      };
    case 'SOCKET_CONNECT':
      return {
        ...state,
        isActive: true,
        message: 'Making websocket connection...'
      };
    case 'SOCKET_CONNECT_SUCCESS':
      return {
        ...state,
        isActive: true
      };
    case 'SOCKET_CONNECT_FAIL':
      return {
        ...state,
        isActive: true,
        message: 'Problem making websocket connection...'
      };
    case 'SOCKET_DISCONNECTED':
      return {
        ...state,
        isActive: true,
        message: 'Websocket has disconnected...'
      }
    case 'SOCKET_RECONNECTING':
      return {
        ...state,
        isActive: true,
        message: 'Websocket is attempting to reconnect...'
      }
    case 'SOCKET_RECONNECT_SUCCESS':
      return {
        ...state,
        isActive: false
      }
    case 'SOCKET_RECONNECT_FAILURE':
      return {
        ...state,
        isActive: true,
        message: 'Websocket failed to reconnect...'
      }
    default:
      return state;
  }
}
