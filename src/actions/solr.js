export function getCoreName() { //using redux axios middleware
  return {
    types: [ 'GET_CORE_NAME', 'GET_CORE_NAME_SUCCESS', 'GET_CORE_NAME_FAILURE'],
    payload: {
      request: {
        method: 'get',
        url: `/solr/core`
      }
    }
  }
}

export function getNumDocs() {
  return {
    types: ['GET_NUM_DOCS', 'GET_NUM_DOCS_SUCCESS', 'GET_NUM_DOCS_FAILURE'],
    promise: client => client.get('/solr/numDocs')
  }
}

export function receiveNumDocs() {
  return (dispatch) => {
    const numDocsUpdate = (numDocs) => {
      return dispatch({
        type: 'RECEIVE_NUM_DOCS',
        result: numDocs,
      });
    };

    return dispatch({
      type: 'socket',
      types: ['a', 'b', null],
      promise: (socket) => socket.on('numDocsUpdate', numDocsUpdate),
    });
  }
}
