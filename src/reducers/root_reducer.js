import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import { csvReducer } from './csv_reducer'

const rootReducer = combineReducers({
  router: routerReducer,
  csv: csvReducer
});

export default rootReducer;
