import React from 'react'
import { render } from 'react-dom'
import mapValues from 'lodash/mapValues'
import { applyMiddleware, createStore, Reducer, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import { ReactElement } from './types'
import { thunk, logger } from './middlewares'
import { State, reducer } from './reducer'

export interface MiddlewareConf {
  logger?: boolean
}

export interface InitialRootState {
  hypract: Partial<State>
}

export type InitialState<S> = Partial<S & InitialRootState>

export interface HypractConf<S> {
  middlewares?: MiddlewareConf
  initialState?: InitialState<S>
}

const reducers = {
  // nothing
}

export const registerReducer = (name: string, reducer: Reducer<any>) => {
  reducers[name] = reducer
}

const reducerFactories = {
  hypract: reducer
}

export const registerReducerFactory = (name: string, reducerFactory: Reducer<any>) => {
  reducers[name] = reducerFactory
}

function getReducers(initialState) {
  const reducersFromFactories = mapValues(reducerFactories, (factory, key) => {
    return factory(initialState[key])
  })

  return Object.assign({}, reducers, reducersFromFactories)
}

export function hypract<S>(App: ReactElement, conf: HypractConf<S> = {}) {
  const { middlewares = {}, initialState = {} } = conf

  const store = createStore(
    combineReducers<S>(getReducers(initialState)),
    middlewares.logger ? applyMiddleware(thunk, logger) : applyMiddleware(thunk)
  )

  render(<Provider store={store}>{App}</Provider>, document.body)
}
