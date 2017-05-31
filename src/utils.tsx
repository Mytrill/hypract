import { App, Component, Entity, Model, Query, SimpleType } from './types';


// /////////////////////////////////////////////////////////////////////////////////////
// 
// ResolveXXX
// 
// /////////////////////////////////////////////////////////////////////////////////////


const resolve = (item: any, library, itemName) => {
  if (typeof item !== 'string') {
    return item;
  }

  const result = library ? library[item] : null;

  if(!result) {
    throw new Error('No ' + itemName + ' found with name: ' + item);
  }

  return result;
}

export function resolveComponent<T extends Component>(component: string | Component, app: App): T {
  const result = resolve(component, app.components || {}, 'component');
  return result;
}

export const resolveEntity = (model: string | Entity, app: App): Entity => {
  return resolve(model, app.model || {}, 'entity');
}

export const resolveQuery = (query: string | Query, app: App): Query => {
  return resolve(query, app.queries || {}, 'query');
}


// /////////////////////////////////////////////////////////////////////////////////////
// 
// String
// 
// /////////////////////////////////////////////////////////////////////////////////////


export const capitalizeFirstLetter = (text: string): string => {
  if(!text) {
    return text;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}


// /////////////////////////////////////////////////////////////////////////////////////
// 
// Entity.getXXX
// 
// /////////////////////////////////////////////////////////////////////////////////////


export const getTitle = (entity: Entity, value: object): string | null => {
  for(let key of Object.keys(entity.attributes)) {
    if(entity.attributes[key].type === SimpleType.TITLE && value[key]) {
      return value[key];
    }
  }

  return null;
}

export const getUrl = (entity: Entity, value: object): string | null => {
  for(let key of Object.keys(entity.attributes)) {
    if(entity.attributes[key].type === SimpleType.URL && value[key]) {
      return value[key];
    }
  }

  return null;
}
