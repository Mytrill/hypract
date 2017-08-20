import { h, Component } from 'preact';
import MCard, * as M from 'material-ui/Card';

import { Data, ComponentConf, ComponentProps, WithChildren } from '../../types';
import { createComponentConfFactory, data, renderChildrenToArray, renderToElement } from '../../utils';

/* --------------------------------------------------------------------- */

export interface CardHeaderConf {
  title: Data;
  titleTag?: string;
  subtitle?: Data;
  subtitleTag?: string;
}
  
export const CardHeader = (props: ComponentProps<CardHeaderConf>) => {
  // console.log('rendering card header', props);
  const conf = props.conf;
  
  const title = conf.titleTag ? 
    <conf.titleTag>{data.toString(conf.title, props)}</conf.titleTag> : 
    data.toString(conf.title, props);
  const subtitle = conf.subtitle ? 
    (conf.subtitleTag ? 
      <conf.subtitleTag>{data.toString(conf.subtitle, props)}</conf.subtitleTag> : 
      data.toString(conf.subtitle, props)) : 
    undefined;

  return <M.CardHeader title={title} subheader={subtitle} />;
}

export const cardHeader = createComponentConfFactory<CardHeaderConf>(CardHeader);

/* --------------------------------------------------------------------- */

export interface CardContentConf extends WithChildren {
  // collapsible?: boolean;
}

export const CardContent = (props: ComponentProps<CardContentConf>) => {
  // const conf = props.conf;
  // if(conf.collapsible) {
  // }
  return <M.CardContent>{renderChildrenToArray(props)}</M.CardContent>;
}

export const cardContent = createComponentConfFactory<CardContentConf>(CardContent);

/* --------------------------------------------------------------------- */

export interface CardConf extends WithChildren {
  raised?: boolean;
}

export const Card = (props: ComponentProps<CardConf>) => {
  // console.log('rendering card', props);
  return <MCard raised={props.conf.raised}>{renderChildrenToArray(props)}</MCard>;
}

export const card = createComponentConfFactory<CardConf>(Card);

/* --------------------------------------------------------------------- */
