import { h, Component } from 'preact';
import { Card } from 'preact-mdl';
import { observer } from 'preact-mobx';
import { sortBy } from 'lodash';

import { AppContext } from './types';
import { resolveEntity } from '../utils';
import { QueryResult, isQueryResult } from '../storage';
import { CardComponent as Config, ComponentProps, Entity, SimpleType } from '../types';

export interface CardProps {
  config: Config;
  props: ComponentProps;
}

export interface CardState {

}

const renderSingleValue = (entity: Entity, config: Config, value: object): JSX.Element => {
  let title = null;
  let url = null;
  let children = [];
  config.attributes.forEach(attr => {
    const attribute = entity.attributes[attr];
    if(!attribute) {
      throw new Error('Cannot find attribute ' + attr + ' in entity ' + JSON.stringify(entity));
    }

    switch(attribute.type) {
      case SimpleType.TITLE:
        title = value[attr];
        break;
      case SimpleType.URL:
        url = value[attr];
        break;
      case SimpleType.STRING:
      case SimpleType.TEXT:
        children.push(<Card.Text>{value[attr]}</Card.Text>);
        break;
      default:
        throw new Error('Cannot handle attribute ' + JSON.stringify(attribute) + ' just yet...');
    }
  });

  if(title) {
    if(url) {
      children = [<Card.Title><a href={url}>{title}</a></Card.Title>].concat(children);
    } else {
      children = [<Card.Title>{title}</Card.Title>].concat(children);
    }
  }

  return <Card class='main-card mdl-shadow--2dp'>{children}</Card>;
}

@observer
export class CardComponent extends Component<CardProps, CardState> {

  render(props: CardProps, state: CardState, context: AppContext) {

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
        return renderSingleValue(entity, props.config, val);
      });
      return <div>{children}</div>;
    }
    
    // console.log('is not query result');

    return renderSingleValue(entity, props.config, value);
  }
}
export default CardComponent;
