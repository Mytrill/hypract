import React from 'react'

import { PropSelectorOr, Eval } from '../propSelectors'
import { ComponentProps } from '../types'
import { get, Path } from '../immutable'
import { element } from '../element'

export interface ShowPropsProps {
  title?: PropSelectorOr<string>
  path?: Path
  hidden?: boolean
}

export const ShowProps = (props: ShowPropsProps & ComponentProps) => {
  const { hidden, title, path, children, ...rest } = props
  if (hidden) {
    return element(children, rest)
  }
  const titleResolved = Eval.toString(title, rest) || (path ? 'Props for path ' + path : 'Complete Props')
  const propsToShow = path ? get(props, path) : props
  return (
    <div>
      <h3>{titleResolved}</h3>
      <pre>{JSON.stringify(propsToShow, null, 2)}</pre>
      {element(children, rest)}
    </div>
  )
}
