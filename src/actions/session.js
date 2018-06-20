export function me() {
  return {
    types: ['ME', 'ME_SUCCESS', 'ME_FAILURE'],
    promise: (client) => client.get('/me'),
  };
}
