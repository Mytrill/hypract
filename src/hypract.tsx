import React from 'react'
import { render } from 'react-dom'
import { applyMiddleware, createStore, Reducer, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import { ReactElement } from './types'
import { thunk, logger } from './middlewares'
import { State, hypractReducer, HypractState } from './reducer'

export interface HypractConf {
  appReducer?: Reducer<any>
  useLogger?: boolean
  initialState?: HypractState
}

export const hypract = (App: ReactElement, { appReducer, useLogger, initialState = {} }: HypractConf = {}) => {
  const reducer = appReducer
    ? combineReducers<State>({ app: appReducer, hypract: hypractReducer(initialState) })
    : combineReducers<State>({ hypract: hypractReducer(initialState) })

  const store = createStore(reducer, useLogger ? applyMiddleware(thunk, logger) : applyMiddleware(thunk))
  render(<Provider store={store}>{App}</Provider>, document.body)
}
