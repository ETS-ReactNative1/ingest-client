import Papa from 'papaparse';

export function initial() {
  return {
    types: ['GET_INITIAL', 'GET_INITIAL_SUCCESS', 'GET_INITIAL_FAILURE'],
    payload: {
      request: {
        method: 'get',
        url: `/ingest/fields`
      }
    }
  }
}

export function pair(params) {
  return (dispatch) => {
    return dispatch({
      type: 'PAIR',
      result: {
        sourceKey: params.sourceKey,
        destKey: params.destKey
      }
    });
  }
}

export function fileUploadStarted() {
  return (dispatch) => {
    return dispatch({
      type: 'FILE_UPLOAD_STARTED'
    })
  }
}

export function fileUploadSuccess() {
  return (dispatch) => {
    return dispatch({
      type: 'FILE_UPLOAD_SUCCESS'
    })
  }
}

export function fileUploadFailure() {
  return (dispatch) => {
    return dispatch({
      type: 'FILE_UPLOAD_FAILURE'
    })
  }
}

export function fileUploadPaused() {
  return (dispatch) => {
    return dispatch({
      type: 'FILE_UPLOAD_PAUSED'
    })
  }
}

export function fileUploadCancelled() {
  return (dispatch) => {
    return dispatch({
      type: 'FILE_UPLOAD_CANCELLED'
    })
  }
}

export function fileUploadResume() {
  return (dispatch) => {
    return dispatch({
      type: 'FILE_UPLOAD_RESUMED'
    })
  }
}

export function toggleInput(params) {
  return (dispatch) => {
    return dispatch({
      type: 'TOGGLE_INPUT',
      result: {
        destKey: params.name,
        value: params.value
      }
    });
  }
}

export function addText(params) {
  return (dispatch) => {
    return dispatch({
      type: 'ADD_TEXT',
      result: {
        destKey: params.destKey,
        value: params.value,
      }
    });
  }
}

export function reset() {
  return (dispatch) => {
    return dispatch({
      type: 'RESET'
    });
  }
}

export function parseHeader(file) {
  return dispatch => {
    dispatch(parseHeaderRequestedAction());
    Papa.parse(file, {
      header: false,
      preview: 1,
      delimiter: ",",
      chunk: function(chunk) {
        return dispatch(parseHeaderFulfilledAction(chunk, file));
      },
      error: function(err) {
        dispatch(parseHeaderRejectedAction(err));
      }
    });
  }
}

function parseHeaderRequestedAction() {
  return {
    type: 'PARSE_HEADER_REQUESTED'
  };
}

function parseHeaderRejectedAction() {
  return {
    type: 'PARSE_HEADER_REJECTED'
  }
}

function parseHeaderFulfilledAction(data, file) {
  return {
    type: 'PARSE_HEADER_FULFILLED',
    result: {
      ...data,
      file: file
    }
  };
}

export function receiveCsvIngestUpdate() {
  return (dispatch) => {
    const csvIngestUpdate = (update) => {
      return dispatch({
        type: 'RECEIVE_CSV_INGEST_UPDATE',
        result: update,
      });
    };

    return dispatch({
      type: 'socket',
      types: ['a', 'b', null],
      promise: (socket) => socket.on('csvIngestUpdate', csvIngestUpdate),
    });
  }
}

export function createIngestRecord(form) {
  return {
    validate: 'csv',
    data: form, //form validation middleware needs data in order to validate.
    types: [ 'CREATE_INGEST_RECORD', 'CREATE_INGEST_RECORD_SUCCESS', 'CREATE_INGEST_RECORD_FAILURE'],
    payload: {
      request: {
        method: 'post',
        url: '/ingest/csv',
        data: form
      }
    }
  }
}

export function scheduleIngestJob(ingestId) {
  return {
    types: [ 'SCHEDULE_INGEST', 'SCHEDULE_INGEST_SUCCESS', 'SCHEDULE_INGEST_FAILURE'],
    payload: {
      request: {
        method: 'post',
        url: `/ingest/${ingestId}/schedule`,
        data: {
          id: ingestId
        }
      }
    }
  }
}

export function csvValidationError(errors) {
  return {
    type: "CSV_VALIDATION_ERROR",
    errors
  }
}

export function toggleAddCustomFieldModal(action) {
  return (dispatch) => {
    return dispatch({
      type: 'TOGGLE_ADD_CUSTOM_FIELD_MODAL',
      result: {
        action: action
      }
    });
  }
}

export function saveCustomField(form) {
  return {
    types: [ 'CREATE_CUSTOM_FIELD', 'CREATE_CUSTOM_FIELD_SUCCESS', 'CREATE_CUSTOM_FIELD_FAILURE'],
    payload: {
      request: {
        method: 'post',
        url: `/ingest/fields`,
        data: form
      }
    }
  }
}

export function deleteCustomField(field) {
  return {
    types: [ 'DELETE_CUSTOM_FIELD', 'DELETE_CUSTOM_FIELD_SUCCESS', 'DELETE_CUSTOM_FIELD_FAILURE'],
    payload: {
      request: {
        method: 'delete',
        url: `/ingest/fields/${field}`,
        data: {}
      }
    }
  }
}
