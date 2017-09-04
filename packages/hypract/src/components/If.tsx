import * as React from 'react'

import { ComponentProps } from '../../types'
import { wrap, Selector } from '../../selectors'
import { elements } from '../../element'

export interface IfProps {
  condition: Selector
}

interface IfRawProps {
  conditionMet: boolean
}

const IfRaw = (props: IfRawProps & ComponentProps) => {
  const { children, ...rest } = props
  return <div>{elements(children, rest)}</div>
}

export const If = wrap<IfProps>({ conditionMet: 'condition' })(IfRaw)
