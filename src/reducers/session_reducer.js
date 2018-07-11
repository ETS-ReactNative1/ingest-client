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
    // case 'REPLACE_SOURCE':
    //   return {
    //     ...state,
    //     source: action.result,
    //     sourceArr: Object.keys(action.result).map((key, index) => {
    //       return {
    //         ...action.result[key],
    //         key: key
    //       }
    //     }),
    //     availableSources: Object.keys(action.result).map((key, index) => {
    //       return {
    //         ...action.result[key],
    //         key: key
    //       }
    //     })
    //   }
    default:
      return state;
  }
}
