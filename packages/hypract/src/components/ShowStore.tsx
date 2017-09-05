import React from 'react'
import { connect } from 'react-redux'

import { PropSelectorOr, Eval } from '../propSelectors'
import { ComponentProps } from '../types'
import { get, Path } from '../immutable'
import { element } from '../element'

export interface ShowStoreProps {
  title?: PropSelectorOr<string>
  path?: Path
  hidden?: boolean
}

const showStoreRaw = (props: ShowStoreProps & ComponentProps) => {
  const { title, path, hidden, children, ...rest } = props
  const state = props['state']
  if (hidden) {
    return <div>{element(children, rest)}</div>
  }
  const titleResolved = Eval.toString(title, props) || (path ? 'State for path ' + path : 'Complete State')
  delete props['state']
  return (
    <div>
      <h3>{titleResolved}</h3>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      {element(children, rest)}
    </div>
  )
}

const mapStateToProps = (state, ownProps: ShowStoreProps) => ({
  state: ownProps.path ? get(state, ownProps.path) : state
})

export const ShowStore: React.ComponentClass<ShowStoreProps> = connect(mapStateToProps)(showStoreRaw)
