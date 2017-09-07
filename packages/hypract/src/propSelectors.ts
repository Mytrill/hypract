import React from 'react'

import isArray from 'lodash/isArray'
import isNil from 'lodash/isNil'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import isUndefined from 'lodash/isUndefined'
import toString from 'lodash/toString'

import { get, Path } from './immutable'

export interface PropSelector<T = any> {
  (props: any): T
}

export const props = (path: Path): PropSelector => {
  return (props: any) => {
    return get(props, path)
  }
}

export const value = (value: any): PropSelector => {
  return (props: any) => {
    return value
  }
}

export const not = (selector: PropSelector): PropSelector<boolean> => {
  return (props: any) => {
    return !selector(props)
  }
}

export const and = (...selectors: PropSelector[]): PropSelector => {
  return (props: any) => {
    let result = false
    for (const selector of selectors) {
      result = selector(props)
      if (!result) {
        return result
      }
    }
    return result
  }
}

export const or = (...selectors: PropSelector[]): PropSelector => {
  return (props: any) => {
    let result = false
    for (const selector of selectors) {
      result = selector(props)
      if (result) {
        return result
      }
    }
    return result
  }
}

export const eq = (...selectors: PropSelector[]): PropSelector<boolean> => {
  return (props: any) => {
    let result = undefined
    for (const selector of selectors) {
      const newResult = selector(props)
      if (!isUndefined(result) && result !== newResult) {
        return false
      }
      result = newResult
    }
    return true
  }
}

export interface PropSelectorMap {
  [key: string]: string | PropSelector
}

export const object = <T>(selectors: PropSelectorMap): PropSelector<T> => {
  return (props: any) => {
    const result = {}

    Object.keys(selectors).forEach(key => {
      const selector = selectors[key]
      if (isString(selector)) {
        result[key] = props[key]
      } else {
        result[key] = selector(props)
      }
    })

    return result as T
  }
}

export const applySelectorMap = (selectors: PropSelectorMap, ownProps: any) => {
  const result = {}
  Object.keys(selectors).forEach(key => {
    const prop = selectors[key]
    if (isString(prop)) {
      const ownProp = ownProps[prop]
      result[key] = isFunction(ownProp) ? ownProp(ownProps) : ownProp
    } else {
      result[key] = prop(ownProps)
    }
  })

  return result
}

export type PropSelectorOr<T> = PropSelector<T> | T | null | undefined

export type PropSelectorOrArray<T> = PropSelector<T> | T | T[] | null | undefined

export const Eval = {
  toString: (data: PropSelectorOr<any>, props: any, defaultVal?: string): string | undefined => {
    if (isNil(data)) {
      return defaultVal
    }
    if (isFunction(data)) {
      return toString(data(props))
    }
    return toString(data)
  },
  toBoolean: (data: PropSelectorOr<boolean>, props: any, defaultVal?: boolean): boolean | undefined => {
    if (isNil(data)) {
      return defaultVal
    }
    if (isFunction(data)) {
      return data(props)
    }
    return data
  },
  toArray: <T>(data: PropSelectorOrArray<T>, props: any, defaultVal?: T[]): undefined | T[] => {
    if (isNil(data)) {
      return defaultVal
    }

    const res = isFunction(data) ? data(props) : data
    if (isArray(res)) {
      return res
    }
    return [res]
  },
  toStringArray: (data: PropSelectorOrArray<string>, props: any, defaultVal?: string[]): undefined | string[] => {
    if (isNil(data)) {
      return defaultVal
    }

    const res = isFunction(data) ? data(props) : data
    if (isArray(res)) {
      return res
    }
    return [toString(res)]
  }
}
