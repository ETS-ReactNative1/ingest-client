import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import { csvReducer } from './csv_reducer'
import { solrReducer } from './solr_reducer'
import { authReducer } from './auth_reducer'
import { loadReducer } from './load_reducer'
import { socketReducer } from './socket_reducer'
import { ingestReducer } from './ingest_reducer'
import { reducer as oidcReducer } from 'redux-oidc'

export default (history) => combineReducers({
  router: connectRouter(history),
  oidc: oidcReducer,
  csv: csvReducer,
  solr: solrReducer,
  socket: socketReducer,
  auth: authReducer,
  load: loadReducer,
  ingest: ingestReducer
})
