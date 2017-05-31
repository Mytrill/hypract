import { h, Component } from 'preact';
import { Card } from 'preact-mdl';
import { observer } from 'preact-mobx';
import { sortBy } from 'lodash';

import { resolveEntity } from '../utils';
import { AppContext } from './types';
import { CardComponent as Config, ComponentProps, Entity, SimpleType } from '../types';

export interface CardProps {
  config: Config;
  props: ComponentProps;
}

export interface CardState {

}

const isSingleResult = (value: object): boolean => {
  return value['id'];
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

const getTitleAttribute = (entity: Entity, attributes: Array<string>): string | null => {
  for(let key of attributes) {
    if(entity.attributes[key].type === SimpleType.TITLE) {
      return key;
    }
  }

  return null;
}

const sortValues = (entity: Entity, config: Config, value: object): Array<object> => {
  let toSort = getTitleAttribute(entity, config.attributes) || 'id';
  const values = Object.keys(value).map(key => value[key]);
  // console.log('Attribute to sort by: ' + toSort + ' values: ' + JSON.stringify(values));
  return sortBy(values, toSort);
}

@observer
export class CardComponent extends Component<CardProps, CardState> {

  render(props: CardProps, state: CardState, context: AppContext) {

    const valueProp = props.config.prop || 'value';
    const value = props.props[valueProp];

    console.log('Rendering card for value: ' + JSON.stringify(value, null, 2));

    const entity = resolveEntity(props.config.entity, context.app);

    if(isSingleResult(value)) {
      return renderSingleValue(entity, props.config, value);
    } else {
      const children = sortValues(entity, props.config, value).map(val => {
        console.log('Rendering card for sorted value: ' + JSON.stringify(val));
        return renderSingleValue(entity, props.config, val);
      });
      return <div>{children}</div>;
    }
  }
}
export default CardComponent;
