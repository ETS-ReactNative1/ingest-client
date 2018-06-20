import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import { sessionReducer } from './session_reducer'
import { csvReducer } from './csv_reducer'

const rootReducer = combineReducers({
  router: routerReducer,
  session: sessionReducer,
  csv: csvReducer,
});

export default rootReducer;
