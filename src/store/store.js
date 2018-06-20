import { createStore, applyMiddleware } from 'redux'

// ROOT REDUCER
import rootReducer from '../reducers/root_reducer'

// MIDDLEWARES
import thunk from 'redux-thunk'
import { createLogger } from "redux-logger"
import clientMiddleware from '../middleware/clientMiddleware';

export default function configureStore(initialState, apiClient) {

  const logger = createLogger()

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, clientMiddleware(apiClient), logger)
  )

  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('../reducers/root_reducer', () => {
  //     const nextRootReducer = require('../reducers/root_reducer').default;
  //     store.replaceReducer(nextRootReducer);
  //   });
  // }

  return store;

}
