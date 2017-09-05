import React from 'react'
import { connect } from 'react-redux'
import { isFunction, isString, isUndefined } from 'lodash'

import { EntitiesById, Query, PendingEditsByDatasource, QueryState } from './types'
import { queryToString, isIdAttribute } from './utils'
import { get, Path } from './immutable'
import { State } from './rootReducer'

export interface Selector<T = any> {
  (state: State, props?: any): T
}

export interface WithSelector {
  selector: Selector
}

export const state = (path: Path): Selector => {
  return (state: State) => {
    return get(state, path)
  }
}

export const uiState = (path: Path): Selector => {
  return (state: State) => {
    return get(state.hypract.ui, path)
  }
}

export const stateOrProps = (path: Path): Selector => {
  return (state: State, props: any) => {
    return get({ state, props }, path)
  }
}

export const props = (path: Path): Selector => {
  return (state: State, props: any) => {
    return get(props, path)
  }
}

export const value = (value: any): Selector => {
  return (state: State) => {
    return value
  }
}

export const not = (selector: Selector): Selector<boolean> => {
  return (state: State, props: any) => {
    return !selector(state, props)
  }
}

export const and = (...selectors: Selector[]): Selector => {
  return (state: State, props: any) => {
    let result = false
    for (const selector of selectors) {
      result = selector(state, props)
      if (!result) {
        return result
      }
    }
    return result
  }
}

export const or = (...selectors: Selector[]): Selector => {
  return (state: State, props: any) => {
    let result = false
    for (const selector of selectors) {
      result = selector(state, props)
      if (result) {
        return result
      }
    }
    return result
  }
}

export const eq = (...selectors: Selector[]): Selector<boolean> => {
  return (state: State, props: any) => {
    let result = undefined
    for (const selector of selectors) {
      const newResult = selector(state, props)
      if (!isUndefined(result) && result !== newResult) {
        return false
      }
      result = newResult
    }
    return true
  }
}

export interface SelectorMap {
  [key: string]: string | Selector
}

export const object = <T>(selectors: SelectorMap): Selector<T> => {
  return (state: State, props: any) => {
    const result = {}

    Object.keys(selectors).forEach(key => {
      const selector = selectors[key]
      if (isString(selector)) {
        result[key] = props[key]
      } else {
        result[key] = selector(state, props)
      }
    })

    return result as T
  }
}

export const applySelectorMap = (selectors: SelectorMap, state: any, ownProps: any) => {
  const result = {}
  Object.keys(selectors).forEach(key => {
    const prop = selectors[key]
    if (isString(prop)) {
      const ownProp = ownProps[prop]
      result[key] = isFunction(ownProp) ? ownProp(state, ownProps) : ownProp
    } else {
      result[key] = prop(state, ownProps)
    }
  })

  return result
}

const mapStateToProps = (selectors: SelectorMap) => {
  return (state: any, ownProps: any) => {
    return applySelectorMap(selectors, state, ownProps)
  }
}

export const wrap = <O = any, I = any>(selectors: SelectorMap) => {
  return (comp: React.ComponentType<I>) => {
    return connect(mapStateToProps(selectors))(comp) as React.ComponentClass<O>
  }
}

export const selectData = (state: State, query: Query): EntitiesById | undefined => {
  const entities = get(state, ['hypract', 'entities', 'data', query.entityType])
  // return all entities (if no restriction in query) or undefined if no data
  if (!entities || !query.where || !query.where.attribute) {
    return entities
  }

  if (isIdAttribute(query.where.attribute)) {
    if (!query.where.equals) {
      throw new Error('Cannot query where id === undefined')
    }
    const id = query.where.equals
    return { id: entities[id] }
  }

  const result = {}
  Object.keys(entities).forEach(id => {
    if (entities[id][query.where.attribute] === query.where.equals) {
      result[id] = entities[id]
    }
  })
  return result
}

export const selectPendingEdits = (state: State): PendingEditsByDatasource => {
  return get(state, ['hypract', 'entities', 'edits'])
}

export const selectQueryState = (state: State, query: Query): QueryState | undefined => {
  return get(state, ['hypract', 'entities', 'queries', queryToString(query)])
}
