import React from 'react'

import { ComponentProps } from '../types'
import { wrap, WithSelector } from '../selectors'
import { elements } from '../element'
import { Else } from './Else'

export interface ElseIfProps extends WithSelector {
  condition?: any
}

interface ElseIfRawProps {
  conditionMet?: any
  elseIfConditionMet?: any
}

const ElseIfRaw = ({ conditionMet, elseIfConditionMet, children, ...rest }: ElseIfRawProps & ComponentProps) => {
  if (conditionMet || !elseIfConditionMet) {
    return <div />
  }
  return <div>{elements(children, rest)}</div>
}

export const ElseIf = wrap({ elseIfConditionMet: 'condition' })(ElseIfRaw)
