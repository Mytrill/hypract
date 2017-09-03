// import * as React from 'react';

// import { ComponentProps } from '../../types';
// import { elements } from '../../element';

// export interface Else

// export interface ElseIfRawProps {
//   conditionMet: boolean
// }

// export const Else = ({ conditionMet, children, ...rest }: ElseProps & ComponentProps) => {
//   if(conditionMet) {
//     return <div>{elements(children, rest)}</div>;
//   }
//   return <div></div>;
// }

import * as React from 'react'

import { ComponentProps } from '../../types'
import { wrap, WithSelector } from '../../selectors'
import { elements } from '../../element'
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
