import React from 'react'
import { isEqual } from 'lodash'

import { QueryResults } from './QueryResults'
import { ExecuteQuery } from './ExecuteQuery'
import { Query as FirebaseQuery } from '../types'
import { PropSelectorOr, PropSelectorOrArray, Eval } from '../../propSelectors'
import { element } from '../../element'

export interface QueryProps {
  path: PropSelectorOrArray<string>
  query?: UnresolvedQuery
}

export interface UnresolvedQuery {
  where?: PropSelectorOrArray<string>
  equals?: PropSelectorOr<any>
}

const resolveQuery = (query: UnresolvedQuery, props: any): FirebaseQuery => {
  if (!query) {
    return {}
  }

  return {
    equals: Eval.toString(query.equals, props),
    where: Eval.toStringArray(query.where, props)
  }
}

export class Query extends React.Component<QueryProps, any> {
  path: string[]
  query: FirebaseQuery

  private resolveQuery(props: QueryProps): boolean {
    const path = Eval.toStringArray(props.path, props)
    const query = resolveQuery(props.query, props)

    const eq = isEqual(path, this.path) && isEqual(query, this.query)
    this.path = path
    this.query = query

    return !eq
  }

  componentWillMount() {
    this.resolveQuery(this.props)
  }

  shouldComponentUpdate(nextProps: QueryProps, nextState: any) {
    return this.resolveQuery(nextProps)
  }

  render() {
    // do not pass path and query down
    const { children, path, query, ...rest } = this.props

    return (
      <ExecuteQuery path={this.path} query={this.query}>
        <QueryResults path={this.path} query={this.query}>
          {element(children, rest)}
        </QueryResults>
      </ExecuteQuery>
    )
  }
}
