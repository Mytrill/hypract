import React from 'react'
import { connect } from 'react-redux'

import { ComponentProps, Query, EntitiesById } from '../types'
import { State } from '../rootReducer'
import { element } from '../element'
import { selectData } from '../selectors'

export interface QueryResultsProps {
  query: Query
}

interface QueryResultsRawProps extends QueryResultsProps, ComponentProps {
  results: EntitiesById
}

const mapStateToProps = (state: State, ownProps: QueryResultsProps) => ({
  results: selectData(state, ownProps.query)
})

const QueryResultsRaw = (props: QueryResultsRawProps) => {
  const { children, ...rest } = props
  return element(children, rest)
}

export const QueryResults: React.ComponentClass<QueryResultsProps> = connect(mapStateToProps)(QueryResultsRaw)
