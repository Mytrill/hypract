import { combineReducers, AnyAction } from 'redux'

import * as data from './data'
import * as errors from './errors'
import * as queries from './queries'

export interface State {
  data: data.State
  errors: errors.State
  queries: queries.State
}

export const reducer = (initial: Partial<State> = {}) =>
  combineReducers<State>({
    data: data.reducer(initial.data),
    errors: errors.reducer(initial.errors),
    queries: queries.reducer(initial.queries)
  })
