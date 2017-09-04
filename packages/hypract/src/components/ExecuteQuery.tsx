import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { State } from '../../reducer'
import * as actions from '../actions'
import { selectQueryState } from '../selectors'
import { Query, QueryState } from '../types'
import { ComponentProps } from '../../types'
import { element } from '../../element'

export interface ExecuteQueryProps {
  query: Query
  datasource: string
  Loading?: React.ComponentType
  Failed?: React.ComponentType
}

export interface ExecuteQueryRawProps extends ExecuteQueryProps, ComponentProps {
  exec(query: Query, datasource: string): void
  queryState?: QueryState
}

class ExecuteQueryRaw extends React.Component<ExecuteQueryRawProps> {
  componentDidMount() {
    this.props.exec(this.props.query, this.props.datasource)
  }

  render() {
    // do not pass exec down to children
    const { queryState, exec, children, Loading, Failed, ...rest } = this.props

    // query not finished
    if (!queryState || !queryState.done) {
      if (Loading) {
        return <Loading />
      }
      return <div>Loading...</div>
    }
    // query failed, the notification component will display
    if (!queryState.success) {
      if (Failed) {
        return <Failed />
      }
      return <div />
    }
    // query succeeded
    return element(children, rest)
  }
}

const mapStateToProps = (state: State, props: ExecuteQueryProps) => ({
  queryState: selectQueryState(state, props.query)
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  exec: (query: Query, datasource: string) => {
    dispatch<any>(actions.query({ datasource, ...query }))
  }
})

export const ExecuteQuery: React.ComponentClass<ExecuteQueryProps> = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExecuteQueryRaw as any)
