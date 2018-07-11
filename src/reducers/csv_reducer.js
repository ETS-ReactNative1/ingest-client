const initialState = {
  loaded: false,
  destination: {},
  destinationArr: [],
  source: {},
  sourceArr: [],
  availableSources: [],
  file: null,
  isIngesting: false,
  isIngestError: false
};
export function csvReducer(state = initialState, action = {}) {
  switch(action.type) {
    case 'INGEST_REQUESTED': {
      return {
        ...state,
        isIngesting: true
      }
    }
    case 'INGEST_REJECTED': {
      return {
        ...state,
        isIngesting: false,
        isIngestError: true
      }
    }
    case 'INGEST_FULFILLED': {
      return {
        ...state,
        isIngesting: false,
        isIngestError: false
      }
    }
    case 'GET_INITIAL':
      return {
        ...state,
        isLoading: true
      }
    case 'GET_INITIAL_FAILURE':
      return {
        ...state,
        isLoading: false,
        loaded: false,
        loadError: action.error
      }
    case 'GET_INITIAL_SUCCESS':
      return {
        ...state,
        isLoading: false,
        loaded: true,
        destination: action.result,
        destinationArr: Object.keys(action.result).map((key, index) => {
          return {
            ...action.result[key],
            key: key
          }
        })
      }
    case 'PARSE_HEADER_REQUESTED':
     return {
       ...state,
       isLoading: true,
       loadAttempted: false
     }
    case 'PARSE_HEADER_REJECTED':
      return {
        ...state,
        isLoading: false,
        loadError: true,
        loadAttempted: true
      }
    case 'PARSE_HEADER_FULFILLED':
      const sourceArr = action.result.data[0].map( source => {
          return {
            destinationField: null,
            name: source,
            key: source
          }
        });

      return {
        ...state,
        sourceArr: sourceArr,
        source: sourceArr.reduce((obj, source) => {
          obj[source.key] = source
          return obj
        }, {}),
        file: action.result.file,
        isLoading: false,
        loadError: false,
        loadAttempted: true
      }
    case 'TOGGLE_INPUT': {
      console.log('params: ',action.result);
      const destinationArr = state.destinationArr.map(dest => {
        if (dest.key === action.result.destKey) {
          return {
            ...dest,
            sourceField: null,
            type: !action.result.value ? 'text' : 'select',
            value: null
          }
        }
        return dest;
      });
      return {
        ...state,
        destinationArr: destinationArr,
        destination: {
          ...state.destination,
          [action.result.destKey]: {
            ...state.destination[action.result.destKey],
            sourceField: null,
            type: !action.result.value ? 'text' : 'select',
            value: null
          }
        },
      }
    }
    case 'PAIR': {
     const sourceArr = state.sourceArr.map(source => {
       if (source.key === action.result.sourceKey) {
         return {
           ...source,
           destinationField: action.result.destKey
         }
       }
       return source;
     });

     const destinationArr = state.destinationArr.map(dest => {
       if (dest.key === action.result.destKey) {
         return {
           ...dest,
           sourceField: action.result.sourceKey
         }
       }
       return dest;
     });

     return {
       ...state,
       source: {
         ...state.source,
         [action.result.sourceKey]: {
           ...state.source[action.result.sourceKey],
           destinationField: action.result.destKey
         }
       },
       sourceArr: sourceArr,
       destination: {
         ...state.destination,
         [action.result.destKey]: {
           ...state.destination[action.result.destKey],
           sourceField: action.result.sourceKey
         }
       },
       destinationArr: destinationArr
     }
    }
    case 'ADD_TEXT': {
      const destinationArr = state.destinationArr.map(dest => {
        if (dest.key === action.result.destKey) {
          return {
            ...dest,
            value: action.result.value
          }
        }
        return dest;
      });

      return {
        ...state,
        destination: {
          ...state.destination,
          [action.result.destKey]: {
            ...state.destination[action.result.destKey],
            value: action.result.value
          }
        },
        destinationArr: destinationArr
      }
    }
    default:
      return state;
  }
}
