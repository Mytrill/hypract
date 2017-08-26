import * as React from 'react';

export interface ComponentProps {
  children?: ReactNode;
}

export type ReactElement = React.ReactElement<any>;

export type ReactNode = React.ReactNode;

export type ReactComponent = React.ComponentType<any>;

export type HypractComponent = ReactComponent | ReactNode;

export interface Condition {
  (state: any, props?: any): boolean;
}

export interface WithCondition {
  condition: string | Condition;
}