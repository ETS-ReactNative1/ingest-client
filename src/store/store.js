import { createStore, applyMiddleware } from 'redux'

// ROOT REDUCER
import rootReducer from '../reducers/root_reducer'

// MIDDLEWARES
import thunk from 'redux-thunk'
import { createLogger } from "redux-logger"
import socketMiddleware from '../middleware/socketMiddleware';
import clientMiddleware from '../middleware/clientMiddleware';

export default function configureStore(initialState, socketClient, apiClient) {

  const logger = createLogger()

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, socketMiddleware(socketClient), clientMiddleware(apiClient), logger)
  )

  return store;

}
