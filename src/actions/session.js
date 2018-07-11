export function me() {
  return {
    types: ['ME', 'ME_SUCCESS', 'ME_FAILURE'],
    promise: (client) => client.get('/me'),
  };
}

export function replaceSource(source) {
  console.log('source: ',source);
  return (dispatch) => {
    return dispatch({
      type: 'REPLACE_SOURCE',
      result: source,
    });
  }
}

export function pair(params) {
  console.log('params: ',params);
  return {
    types: ['PAIR', 'PAIR_SUCCESS', 'PAIR_FAILURE'],
    promise: client => client.post('/pair', {
      data: {
        sourceKey: params.sourceKey,
        destKey: params.destKey
      }
    })
  };
}
