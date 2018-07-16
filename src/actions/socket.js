export function connect() {
  return {
    type: 'socket',
    types: ['SOCKET_CONNECT', 'SOCKET_CONNECT_SUCCESS', 'SOCKET_CONNECT_FAIL'],
    promise: socket => socket.connect(),
  };
}

//disconnect socket manually
export function disconnect() {
  return {
    type: 'socket',
    types: ['SOCKET_DISCONNECT', 'SOCKET_DISCONNECT_SUCCESS', 'SOCKET_DISCONNECT_FAIL'],
    promise: socket => socket.disconnect(),
  }
}

// when socket disconnects
export function onDisconnected() {
  return (dispatch) => {
    const disconnected = () => {
      return dispatch({
        type: 'SOCKET_DISCONNECTED'
      });
    };

    return dispatch({
      type: 'socket',
      types: [null, null, null],
      promise: (socket) => socket.on('disconnect', disconnected),
    });
  }
}

// when socket attempts to reconnect
export function onReconnecting() {
  return (dispatch) => {
    const reconnecting = () => {
      return dispatch({
        type: 'SOCKET_RECONNECTING'
      });
    }

    return dispatch({
      type: 'socket',
      types: [null, null, null],
      promise: (socket) => socket.on('reconnecting', reconnecting)
    });
  }
}

// when socket reconnects successfully
export function onReconnectSuccess() {
  return (dispatch) => {
    const reconnect = () => {
      return dispatch({
        type: 'SOCKET_RECONNECT_SUCCESS'
      });
    }

    return dispatch({
      type: 'socket',
      types: [null, null, null],
      promise: (socket) => socket.on('reconnect', reconnect)
    });
  }
}

// when socket reconnects UNsuccessfuly
export function onReconnectFailure() {
  return (dispatch) => {
    const reconnect_failure = () => {
      return dispatch({
        type: 'SOCKET_RECONNECT_FAILURE'
      });
    }

    return dispatch({
      type: 'socket',
      types: [null, null, null],
      promise: (socket) => socket.on('reconnect_error', reconnect_failure)
    });
  }
}
