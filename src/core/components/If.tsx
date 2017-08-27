import * as React from 'react';

import { ComponentProps } from '../../types';
import { wrapInSelectors, Selector } from '../../selectors';
import { elements } from '../../element';

export interface IfProps {
  condition: Selector;
}

interface IfRawProps {
  conditionMet: boolean;
}

const IfRaw = (props: IfRawProps & ComponentProps) => {
  const { children, ...rest } = props;
  return <div>{elements(children, rest)}</div>;
}

export const If = wrapInSelectors<IfProps>({ condition: 'conditionMet' })(IfRaw);
