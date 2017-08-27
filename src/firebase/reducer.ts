import { combineReducers, AnyAction } from 'redux';

import * as database from './database';
import * as errors from './errors';
import * as queries from './queries';

export interface State {
  database: database.State;
  errors: errors.State;
  queries: queries.State;
}

export const reducer = (initial: Partial<State> = {}) => combineReducers<State>({
  database: database.reducer(initial.database),
  errors: errors.reducer(initial.errors),
  queries: queries.reducer(initial.queries)
});
