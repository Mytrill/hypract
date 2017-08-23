import { h, Component, ComponentProps } from 'preact';
import MCard, * as M from 'material-ui/Card';

import { element, elements, wrap } from '../../element';
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

  return <M.CardHeader title={title} subheader={subtitle} />;
}

/* --------------------------------------------------------------------- */

export interface CardContentProps {
  // collapsible?: boolean;
}

export const CardContent = (props: CardContentProps & ComponentProps<any>) => {
  // const conf = props.conf;
  // if(conf.collapsible) {
  // }
  return <M.CardContent>{elements(props.children, props)}</M.CardContent>;
}

/* --------------------------------------------------------------------- */

export interface CardProps {
  raised?: boolean;
}

export const Card = (props: CardProps & ComponentProps<any>) => {
  // console.log('rendering card', props);
  return <MCard raised={props.raised}>{elements(props.children, props)}</MCard>;
}

/* --------------------------------------------------------------------- */
