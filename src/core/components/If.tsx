import * as React from 'react';
import { connect } from 'react-redux';

import { ComponentProps, Condition, WithCondition } from '../../types';
import { computeConditionMet } from '../../utils';
import { elements } from '../../element';
import { Else } from './Else';

export interface IfProps extends WithCondition {

}

interface IfRawProps {
  conditionMet: boolean;
}

const IfRaw = (props: IfRawProps & ComponentProps) => {
  const { children, ...rest } = props;
  return <div>{elements(children, rest)}</div>;
}

const mapStateToProps = (state:any, ownProps: IfProps) => ({
  conditionMet: computeConditionMet(state, ownProps)
})

export const If: React.StatelessComponent<IfProps> = connect(mapStateToProps)(IfRaw);
