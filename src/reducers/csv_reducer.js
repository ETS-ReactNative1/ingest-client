export function csvReducer(state = {}, action = {}) {
  switch(action.type) {
    case 'UPLOAD':
      return {
        ...state,
        isLoading: true
      };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        isLoading: false,
        mode: action.result
      };
    case 'UPLOAD_FAILURE':
      return {
        ...state,
        isLoading: false,
        loadError: action.error
      };
    default:
      return state;
  }
}
