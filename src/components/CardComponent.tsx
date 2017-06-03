import { h, Component } from 'preact';
import { Card } from 'preact-mdl';
import { observer } from 'preact-mobx';
import { sortBy } from 'lodash';

import { AppContext } from './types';
import { resolveEntity } from '../utils';
import { QueryResult, isQueryResult } from '../storage';
import { resolveInObject, evalTemplate } from '../templateUtils';
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

const renderCard = (entity: Entity, props: CardProps, value: object): JSX.Element => {
  const children: JSX.Element[] = [];

  const attributes = props.config.attributes || {};

  let title = null;
  if(attributes.title) {
    title = evalTemplate(attributes.title, props.props, value);
  }
  if(!title && entity.mappings && entity.mappings.title) {
    title = value[entity.mappings.title];
  }
  if(title) {
    let subtitle = undefined;
    if(attributes.subtitle) {
      const text = evalTemplate(attributes.subtitle, props.props, value);
      if(text) {
        subtitle = <div class='mdl-card__subtitle-text'>{text}</div>;
      }
    }
    children.push(<Card.Title><Card.TitleText>{title}</Card.TitleText>{subtitle}</Card.Title>);
  }

  let supportingText = null;
  if(attributes.supportingText) {
    supportingText = evalTemplate(attributes.supportingText, props.props, value);
  }
  if(!supportingText && entity.mappings && entity.mappings.description) {
    supportingText= value[entity.mappings.description];
  }
  if(supportingText) {
    children.push(<Card.Text>{supportingText}</Card.Text>);
  }

  if(attributes.actions) {

  }

  return <Card class='main-card mdl-shadow--2dp'>{children}</Card>
}

// const renderCard = (entity: Entity, config: Config, value: object): JSX.Element => {
//   let title = null;
//   let url = null;
//   let children = [];
//   config.attributes.forEach(attr => {
//     const attribute = entity.attributes[attr];
//     if(!attribute) {
//       throw new Error('Cannot find attribute ' + attr + ' in entity ' + JSON.stringify(entity));
//     }

//     switch(attribute.type) {
//       case SimpleType.TITLE:
//         title = value[attr];
//         break;
//       case SimpleType.URL:
//         url = value[attr];
//         break;
//       case SimpleType.STRING:
//       case SimpleType.TEXT:
//         children.push(<Card.Text>{value[attr]}</Card.Text>);
//         break;
//       default:
//         throw new Error('Cannot handle attribute ' + JSON.stringify(attribute) + ' just yet...');
//     }
//   });

//   if(title) {
//     if(url) {
//       children = [<Card.Title><a href={url}>{title}</a></Card.Title>].concat(children);
//     } else {
//       children = [<Card.Title>{title}</Card.Title>].concat(children);
//     }
//   }

//   return <Card class='main-card mdl-shadow--2dp'>{children}</Card>;
// }

const resolveAttributes = (attributes: CardAttributes): void => {
  resolveInObject(this.props.config.attributes, ['title', 'subtitle', 'supportingText']);
}

@observer
export class CardComponent extends Component<CardProps, CardState> {

  componentWilMount() {
    if(this.props.config.attributes) {
      resolveAttributes(this.props.config.attributes);
    }
  }

  componentWillReceiveProps(nextProps: CardProps) {
    if(nextProps.config.attributes) {
      resolveAttributes(nextProps.config.attributes);
    }
  }

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
        return renderCard(entity, props, val);
      });
      return <div>{children}</div>;
    }
    
    // console.log('is not query result');

    return <div>Rendering CardComponent with props: {JSON.stringify(props)}</div>;
  }
}
export default CardComponent;
