import { h, Component } from 'preact';
import { Card } from 'preact-mdl';
import { observer } from 'preact-mobx';
import { sortBy } from 'lodash';

import resolveData from '../resolveData';

import { AppContext } from './types';
import { resolveEntity } from '../utils';
import { QueryResult, isQueryResult } from '../storage';
import { CardComponent as Config, CardAttributes, ComponentProps, Entity, SimpleType } from '../types';

export interface CardProps {
  config: Config;
  props: ComponentProps;
}

export interface CardState {

}

const renderMenu = (entity: Entity, config: Config, value: object): JSX.Element | null => {
  return null;
}

const renderActions = (entity: Entity, config: Config, value: object): JSX.Element | null => {
  return null;
}

const evalAttribute = (props: CardProps, cardAttr: string, value: object, entity?: Entity, entityAttr?: string): string | JSX.Element | null => {
  let result = null;

  if(props.config.attributes && props.config.attributes[cardAttr]) {
    result = resolveData(props.config.attributes[cardAttr], props.props, value);
  }
  if(!result && entityAttr && entity && entity.mappings && entity.mappings[entityAttr]) {
    result = value[entity.mappings[entityAttr]];
  }

  return result;
}

const renderEntity = (entity: Entity, props: CardProps, value: object): JSX.Element => {
  const children: JSX.Element[] = [];

  const attributes = props.config.attributes || {};

  const title = evalAttribute(props, 'title', value, entity, 'title');
  if(title) {
    let subtitle = evalAttribute(props, 'subtitle', value);//, entity, null, value);
    let subtitleElt = subtitle ? <div class='mdl-card__subtitle-text'>{subtitle}</div> : undefined;
    children.push(<Card.Title><Card.TitleText>{title}</Card.TitleText>{subtitle}</Card.Title>);
  }

  const supportingText = evalAttribute(props, 'supportingText', value, entity, 'description');
  if(supportingText) {
    children.push(<Card.Text>{supportingText}</Card.Text>);
  }

  if(attributes.actions) {

  }

  return <Card class='main-card mdl-shadow--2dp'>{children}</Card>
}

@observer
export class CardComponent extends Component<CardProps, CardState> {

  render(props: CardProps, state: CardState, context: AppContext) {
    return this._render(props, state, context);
  }

  _render(props: CardProps, state: CardState, context: AppContext) {
    const valueProp = props.config.prop || 'value';
    const value = props.props[valueProp];

    // console.log('Rendering card for value: ' + JSON.stringify(value));

    const entity = resolveEntity(props.config.entity, context.app);
    
    // console.log('before is query result');
    
    if(!value) {
      return <div></div>;
    }

    if(isQueryResult(value)) {
      // console.log('is query result, result: ' + JSON.stringify(value.list()));
      const children = value.list().map(val => {
        // console.log('Rendering card for sorted value: ' + JSON.stringify(val));
        return renderEntity(entity, props, val);
      });
      return <div>{children}</div>;
    }
    
    // console.log('is not query result');

    return <div>Rendering CardComponent with props: {JSON.stringify(props)}</div>;
  }
}
export default CardComponent;
