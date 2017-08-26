import * as React from 'react';
import { connect } from 'react-redux';

import { ComponentProps } from '../../types';
import { elements } from '../../element';
import { Else } from './Else';

export interface IfCondition {
  (state: any, props?: any): boolean;
}

export interface IfProps {
  condition: /* string | */ IfCondition;
}

interface IfRawProps {
  conditionMet: boolean;
}

const IfRaw = (props: IfRawProps & ComponentProps) => {
  const { conditionMet, children, ...rest } = props;

  const rendered = elements(children, rest);
  const toRender = rendered.filter(child => conditionMet || child.type === Else);

  if(toRender.length === 1) {
    return toRender[0];
  }
  return <div>{toRender}</div>;
}

const mapStateToProps = (state:any, ownProps: IfProps) => ({
  conditionMet: ownProps.condition(state, ownProps)
})

export const If: React.StatelessComponent<IfProps> = connect(mapStateToProps)(IfRaw);
