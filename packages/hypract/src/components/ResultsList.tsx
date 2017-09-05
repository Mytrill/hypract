import React from 'react'
import { sortBy } from 'lodash'

import { element } from '../element'
import { PropSelectorOrArray, Eval } from '../propSelectors'
import { HypractComponent, ComponentProps } from '../types'

export interface ResultsListProps {
  orderBy?: PropSelectorOrArray<string>
  orderByValues?: boolean
  noResults?: HypractComponent
  oneResult?: HypractComponent
  repeat?: boolean | HypractComponent
  defaultResults?: object
}

export const ResultsList = (props: ResultsListProps & ComponentProps) => {
  const { orderBy, orderByValues, noResults, oneResult, repeat, defaultResults, children, ...rest } = props

  let orderByResolved = Eval.toStringArray(orderBy, rest)

  const resultsObj = rest['results'] || defaultResults || {}
  const results = orderByValues
    ? Object.keys(resultsObj)
        .map(key => resultsObj[key])
        .sort()
    : orderByResolved
      ? sortBy(Object.keys(resultsObj).map(key => resultsObj[key]), orderByResolved)
      : Object.keys(resultsObj)
          .sort()
          .map(key => resultsObj[key])

  if (results.length === 0 && noResults) {
    return element(noResults, rest)
  }

  if (results.length === 1 && oneResult) {
    return element(oneResult, rest, { results, result: results[0], resultIndex: 0 })
  }

  if (repeat) {
    if (typeof repeat === 'boolean') {
      return (
        <div>{results.map((result, resultIndex) => element(children, rest, { results, result, resultIndex }))}</div>
      )
    } else {
      return <div>{results.map((result, resultIndex) => element(repeat, rest, { results, result, resultIndex }))}</div>
    }
  }

  return element(children, rest, {
    results,
    result: results.length === 1 ? results[0] : undefined,
    resultIndex: results.length === 1 ? 0 : undefined
  })
}
