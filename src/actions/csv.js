import axios from 'axios';
import Papa from 'papaparse';

export function ingest(mappings, file) {
  const data = new FormData();
  data.append('mappings', JSON.stringify(mappings));
  data.append('csv', file);
  return dispatch => {
    dispatch(ingestRequestedAction());
    return axios(process.env.REACT_APP_API_URL+'/ingest/csv', {
      method: "post",
      data: data,
      withCredentials: true
    }).then((response) => {
      dispatch(ingestFulfilledAction(response.data));
      return response.data;
    })
    .catch((error) => {
      dispatch(ingestRejectedAction());
    });
  }
}

function ingestRequestedAction() {
  return {
    type: 'INGEST_REQUESTED'
  };
}

function ingestRejectedAction() {
  return {
    type: 'INGEST_REJECTED'
  }
}

function ingestFulfilledAction(data) {
  return {
    type: 'INGEST_FULFILLED',
    result: data
  };
}

export function initial() {
  return {
    types: ['GET_INITIAL', 'GET_INITIAL_SUCCESS', 'GET_INITIAL_FAILURE'],
    promise: client => client.get('/csv/initial')
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

export function parseHeader(event) {
  const file = event.target.files[0];
  return dispatch => {
    dispatch(parseHeaderRequestedAction());
    Papa.parse(file, {
      header: false,
      preview: 1,
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
