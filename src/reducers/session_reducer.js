import {
  SESSION_TERMINATED,
  USER_EXPIRED,
  USER_EXPIRING,
  USER_SIGNED_OUT,
  USER_FOUND,
  LOADING_USER,
  LOAD_USER_ERROR,
  SILENT_RENEW_ERROR
} from "redux-oidc";

const initialState = {
  user: {
    id: null,
    firstName: null,
    lastName: null,
    profilePicture: null,
    roles: []
  },
  ttl: null,
  isLoading: true,
  isLoaded: false,
  isLoadError: false,
  isLoggingIn: null,
  isLoggedIn: null,
  isLogInError: null,
  isLoggingOut: null,
  isLoggedOut: null,
  isLogOutError: null
};

export function sessionReducer(state = initialState, action = {}) {
  switch(action.type) {
    case 'SESSION_TERMINATED': {
      return {
        ...state
      }
    }
    case 'USER_EXPIRED': {
      return {
        ...state
      }
    }
    case 'USER_EXPIRING': {
      return {
        ...state
      }
    }
    case 'USER_SIGNED_OUT': {
      return {
        ...state
      }
    }
    case 'USER_FOUND': {
      return {
        ...state
      }
    }
    case 'LOADING_USER': {
      return {
        ...state
      }
    }
    case 'LOAD_USER_ERROR': {
      return {
        ...state
      }
    }
    case 'SILENT_RENEW_ERROR': {
      return {
        ...state
      }
    }
    default:
      return state;
  }
}
