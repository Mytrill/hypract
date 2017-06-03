import { get } from 'lodash';

import { DataResolver, DataTemplate, ComponentProps, Entity } from './types';

const getDataTemplate = (template: string): DataTemplate => {
  // path in the props, e.g. :myProps.attr1 should return ['myProps', 'attr1']
  if(template.startsWith(':')) {
    return { pathInProps: template.substr(1).split('.') };
  }

  // attribute from the current entity.
  if(template.startsWith('#')) {
    return { attribute: template.substr(1) };
  }

  // just plain text.
  return { text: template };  
}

export const resolveInObject = (object: object, props: string | string[]): void => {
  if(typeof props === 'string') {
    if(typeof object[props] === 'string') {
      object[props] = getDataTemplate(object[props]);
    }
  } else {
    props.forEach(prop => {
      if(typeof object[prop] === 'string') {
        object[prop] = getDataTemplate(object[prop]);
      }
    });
  }
}

export const evalTemplate = (template: DataTemplate | DataResolver, props?: ComponentProps, value?: object): string | JSX.Element => {
  if(typeof template === 'function') {
    return template(props, value);
  }
  
  if(template.attribute) {
    return value[template.attribute];
  }

  if(template.pathInProps) {
    return <string> get(props, template.pathInProps);
  }

  return template.text;
}

