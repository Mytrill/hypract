import React from 'react'

import { ComponentProps } from '../types'
import { elements } from '../element'

export interface ElseProps {
  conditionMet?: any
}

export const Else = ({ conditionMet, children, ...rest }: ElseProps & ComponentProps) => {
  if (!conditionMet) {
    return <div>{elements(children, rest)}</div>
  }
  return <div />
}
