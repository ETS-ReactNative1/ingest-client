const initialState = {
  isLoading: true,
  user: {
    anonymous: true,
    roles: [],
    userId: null
  }
};

export function authReducer(state = initialState, action = {}) {
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
        isLoaded: true,
        user: {
          ...state.user,
          ...action.result
        }
      };
    case 'ME_FAILURE':
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        loadError: action.error
      };
    case 'LOGIN':
      return {
        ...state,
        isLoggingIn: true
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggingIn: false,
        loginError: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoggingIn: false,
        loginError: action.error
      };
    case 'REGISTER':
      return {
        ...state,
        isRegistering: true
      };
    case 'REGISTER_SUCCESS': {
      return {
        ...state,
        isRegistering: false,
        registerError: null
      }
    }
    case 'REGISTER_FAILURE': {
      return {
        ...state,
        isRegistering: false,
        registerError: action.error
      }
    }
    case 'LOGOUT':
      return {
        ...state,
        isLoggingOut: true
      };
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        isLoggingOut: false,
        logoutError: null,
        user: {
          anonymous: true,
          roles: [],
          userId: null
        }
      };
    case 'LOGOUT_FAILURE':
      return {
        ...state,
        isLoggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}
