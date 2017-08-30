import * as React from 'react'
import { isBoolean } from 'lodash'
import { get } from '../../immutable'

import { Data, toString } from '../../data'
import { ComponentProps } from '../../types'
import { element } from '../../element'

export interface ShowPropsProps {
  title?: Data
  path?: string | string[]
  hidden?: boolean
}

export const ShowProps = (props: ShowPropsProps & ComponentProps) => {
  const { hidden, title, path, children, ...rest } = props
  if (hidden) {
    return element(children, rest)
  }
  const titleResolved = toString(title, props) || (path ? 'Props for path ' + path : 'Complete Props')
  const propsToShow = path ? get(props, path) : props
  return (
    <div>
      <h3>{titleResolved}</h3>
      <pre>{JSON.stringify(propsToShow, null, 2)}</pre>
      {element(children, rest)}
    </div>
  )
}
