import React from 'react'

import { ComponentProps } from '../types'
import { elements } from '../element'

export interface ThenProps {
  conditionMet?: any
}

export const Then = ({ conditionMet, children, ...rest }: ThenProps & ComponentProps) => {
  if (conditionMet) {
    return <div>{elements(children, rest)}</div>
  }
  return <div />
}
