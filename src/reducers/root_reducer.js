import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import { csvReducer } from './csv_reducer'
import { solrReducer } from './solr_reducer'
import { authReducer } from './auth_reducer'
import { loadReducer } from './load_reducer'
import { socketReducer } from './socket_reducer'

const rootReducer = combineReducers({
  router: routerReducer,
  csv: csvReducer,
  solr: solrReducer,
  socket: socketReducer,
  auth: authReducer,
  load: loadReducer
});

export default rootReducer;
