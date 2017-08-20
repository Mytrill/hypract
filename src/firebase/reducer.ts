import { combineReducers } from 'redux';

import * as database from './database';
import * as errors from './errors';
import * as queries from './queries';

export interface State {
  database: database.State;
  errors: errors.State;
  queries: queries.State;
}

export const reducer = combineReducers<State>({
  database: database.reducer,
  errors: errors.reducer,
  queries: queries.reducer
});
