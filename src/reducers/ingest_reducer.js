const initialState = {
  isLoading: true,
  isLoaded: false,
  isLoadError: false,
  items: {},
  itemsArr: [],
  isPrevDisabled: true,
  isNextDisabled: true,
  currentPage: 0,
  pageSize: 5 //api can override
};
export function ingestReducer(state = initialState, action = {}) {
  switch(action.type) {
    case 'GET_INGEST_PAGE': {
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      }
    }
    case 'GET_INGEST_PAGE_SUCCESS': {
      const items = action.result.records.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
      }, {});
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        isLoadError: false,
        itemsArr: action.result.records,
        items: items,
        isNextDisabled: action.result.isNextDisabled ? true : false,
        currentPage: action.result.page,
        pageSize: action.result.pageSize
      }
    }
    case 'GET_INGEST_PAGE_FAILURE': {
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        isLoadError: true,
      }
    }
    case 'DELETE_INGEST_RECORD': {
      return {
        ...state
      }
    }
    case 'DELETE_INGEST_RECORD_SUCCESS': {
      const itemsArr = state.itemsArr.map(item => {
        if (item.id === action.result.id) {
          return {
            ...item,
            status: 'deleted'
          }
        }
        return item;
      });
      return {
        ...state,
        items: {
          ...state.items,
          [action.result.id]: {
            ...state.items[action.result.id],
            status: 'deleted'
          }
        },
        itemsArr: itemsArr
      }
    }
    case 'DELETE_INGEST_RECORD_FAILURE': {
      return {
        ...state
      }
    }
    case 'TOGGLE_DELETE_INGEST_MODAL': {
      const itemsArr = state.itemsArr.map(item => {
        if (item.id === action.result.id) {
          return {
            ...item,
            confirmDeleteModalOpen: action.result.action == 'open' ? true : false
          }
        }
        return item;
      });
      return {
        ...state,
        items: {
          ...state.items,
          [action.result.id]: {
            ...state.items[action.result.id],
            confirmDeleteModalOpen: action.result.action == 'open' ? true : false
          }
        },
        itemsArr: itemsArr
      }
    }
    case 'RECEIVE_INGEST_RECORD_STATUS_UPDATE': {
      //if item is in UI table currently
      if (action.result.id in state.items) {
        const itemsArr = state.itemsArr.map(item => {
          if (item.id === action.result.id) {
            return {
              ...item,
              status: action.result.status
            }
          }
          return item;
        });
        return {
          ...state,
          items: {
            ...state.items,
            [action.result.id]: {
              ...state.items[action.result.id],
              status: action.result.status
            }
          },
          itemsArr: itemsArr
        }
      }
      //if item is NOT in UI table currently and on first page
      if (!(action.result.id in state.items) && state.currentPage === 0) {
        let newItemsArr = state.itemsArr;
        newItemsArr.unshift(action.result);
        if (newItemsArr.length > state.pageSize) {
          newItemsArr.pop();
        }
        return {
          ...state,
          items: {
            ...state.items,
            [action.result.id]: action.result
          },
          itemsArr: newItemsArr
        }
      }
      return {
        ...state
      }
    }
    default:
      return state;
  }
}
