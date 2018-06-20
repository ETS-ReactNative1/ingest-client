const initialState = {
  loaded: false
};

export function sessionReducer(state = initialState, action = {}) {
  switch(action.type) {
    case 'ME':
      return {
        ...state,
        isLoading: true
      };
    case 'ME_SUCCESS':
      return {
        ...state,
        isLoading: false,
        loaded: true
      };
    case 'ME_FAILURE':
      return {
        ...state,
        isLoading: false,
        loaded: false,
        loadError: action.error
      };
    default:
      return state;
  }
}
