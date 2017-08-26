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

import * as React from 'react';
import { connect } from 'react-redux';

import { ComponentProps, Condition, WithCondition } from '../../types';
import { computeConditionMet } from '../../utils';
import { elements } from '../../element';
import { Else } from './Else';

export interface ElseIfProps extends WithCondition {
  conditionMet: boolean;
}

interface ElseIfRawProps {
  conditionMet: boolean;
  elseIfConditionMet: boolean;
}

const ElseIfRaw = ({ conditionMet, elseIfConditionMet, children, ...rest }: ElseIfRawProps & ComponentProps) => {
  if(conditionMet || !elseIfConditionMet) {
    return <div></div>;
  }
  return <div>{elements(children, rest)}</div>;
}

const mapStateToProps = (state:any, ownProps: ElseIfProps) => ({
  // this || prevents the second condition to be evaluated if the if condition is already met.
  elseIfConditionMet: ownProps.conditionMet || computeConditionMet(state, ownProps)
})

export const ElseIf: React.ComponentClass<ElseIfProps> = connect(mapStateToProps)(ElseIfRaw);
