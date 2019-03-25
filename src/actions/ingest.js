export function getIngestPage(page) {
  return {
    types: ['GET_INGEST_PAGE', 'GET_INGEST_PAGE_SUCCESS', 'GET_INGEST_PAGE_FAILURE'],
    payload: {
      request: {
        method: 'get',
        url: `/api/ingest${page ? '?page='+page+'' : '' }`
      }
    }
  }
}

export function deleteIngestRecord(ingestId) {
  return {
    types: ['DELETE_INGEST_RECORD', 'DELETE_INGEST_RECORD_SUCCESS', 'DELETE_INGEST_RECORD_FAILURE'],
    payload: {
      request: {
        method: 'get',
        url: `/api/ingest/${ingestId}/delete`
      }
    }
  }
}

export function toggleDeleteIngestModal(ingestId, action) {
  return (dispatch) => {
    return dispatch({
      type: 'TOGGLE_DELETE_INGEST_MODAL',
      result: {
        id: ingestId,
        action: action
      }
    });
  }
}

export function receiveIngestRecordStatusUpdate() {
  return (dispatch) => {
    const ingestRecordStatusUpdate = (update) => {
      return dispatch({
        type: 'RECEIVE_INGEST_RECORD_STATUS_UPDATE',
        result: update,
      });
    };

    return dispatch({
      type: 'socket',
      types: ['a', 'b', null],
      promise: (socket) => socket.on('ingestRecordStatusUpdate', ingestRecordStatusUpdate),
    });
  }
}
