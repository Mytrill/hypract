import React from 'react'
import { isEqual, isFunction } from 'lodash'

import { QueryResults } from './QueryResults'
import { ExecuteQuery } from './ExecuteQuery'
import { PropSelector } from '../propSelectors'
import { Query as EntityQuery, Where } from '../types'
import { element } from '../element'

export interface QueryProps {
  datasource: string
  query?: UnresolvedQuery
}

export interface UnresolvedQuery {
  entityType: PropSelector | string
  where?: UnresolvedWhere
  refresh?: boolean
}

export interface UnresolvedWhere {
  attribute: string
  equals: PropSelector | any
}

const resolveQuery = (query: UnresolvedQuery, props: any): EntityQuery => {
  const where: Where = query.where
    ? {
        attribute: query.where.attribute,
        equals: isFunction(query.where.equals) ? query.where.equals(props) : query.where.equals
      }
    : undefined
  return {
    entityType: isFunction(query.entityType) ? query.entityType(props) : query.entityType,
    where,
    refresh: query.refresh
  }
}

export class Query extends React.Component<QueryProps, any> {
  query: EntityQuery

  private resolveQuery(props: QueryProps): boolean {
    const query = resolveQuery(props.query, props)

    const eq = isEqual(query, this.query)
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
    const { children, datasource, query, ...rest } = this.props

    return (
      <ExecuteQuery datasource={datasource} query={this.query}>
        <QueryResults query={this.query}>{element(children, rest)}</QueryResults>
      </ExecuteQuery>
    )
  }
}
