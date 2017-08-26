import * as React from 'react';
import MCard, * as M from 'material-ui/Card';

import { element } from '../../element';
import { ComponentProps } from '../../types';
import { Data, DataOrArray, toString, toStringArray } from '../../data';

/* --------------------------------------------------------------------- */

export interface CardHeaderProps {
  title: Data;
  titleTag?: string;
  subtitle?: Data;
  subtitleTag?: string;
}
  
export const CardHeader = (props: CardHeaderProps) => {
  // console.log('rendering card header', props);
  const title = props.titleTag ? 
    <props.titleTag>{toString(props.title, props)}</props.titleTag> : 
    toString(props.title, props);
  const subtitle = props.subtitle ? 
    (props.subtitleTag ? 
      <props.subtitleTag>{toString(props.subtitle, props)}</props.subtitleTag> : 
      toString(props.subtitle, props)) : 
    undefined;

  return <M.CardHeader title={title} subtitle={subtitle} />;
}

/* --------------------------------------------------------------------- */

// TODO add other card features

/* --------------------------------------------------------------------- */

export interface CardProps {
  expandable?: boolean
}

export const Card = (props: CardProps & ComponentProps) => {
  const { expandable = false, ...rest } = props;
  return <MCard expandable={expandable}>{element(rest.children, rest)}</MCard>;
}

/* --------------------------------------------------------------------- */
