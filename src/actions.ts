import { isFunction } from 'lodash'
import { Store } from 'redux'

export interface Action<P = any> {
  type: string
  payload: P
  error?: boolean
}

export type ActionFactory<E = any, P = any, S = any> = (props: P, state: S, e: E) => Action<any>

export const isActionFactory = (value: any): value is ActionFactory => {
  if (isFunction(value)) {
    return value.length === 3
  }
  return false
}

export function actionCreator<P>(type: string): (payload: P) => Action<P> {
  return (payload: P) => ({
    type,
    payload
  })
}

export function actionCreatorWithoutPayload<P = {}>(type: string): () => Action<{}> {
  return () => ({
    type,
    payload: {}
  })
}

export function actionCreatorWithError<P>(type: string): (payload: P) => Action<P> {
  return (payload: P) => ({
    type,
    payload,
    error: true
  })
}

export function actionToHandler<E = any, P = any, S = any>(
  actionOrFactory: ActionFactory<E, P, S> | Action,
  props?: P,
  store?: Store<S>
) {
  if (!actionOrFactory) {
    return undefined
  }

  return (e: E) => {
    if (isActionFactory(actionOrFactory)) {
      const action = actionOrFactory(props, store.getState(), e)

      if (action) {
        store.dispatch(action)
      }
    }

    store.dispatch(<Action>actionOrFactory)
  }
}
