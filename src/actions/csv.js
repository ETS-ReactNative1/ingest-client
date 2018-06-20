export function upload(params) {
  return {
    types: ['UPLOAD', 'UPLOAD_SUCCESS', 'UPLOAD_FAILURE'],
    promise: client => client.post('/upload_csv', {
      data: {
        // userId: params.userId,
        // deviceId: params.deviceId
      }
    })
  };
}
