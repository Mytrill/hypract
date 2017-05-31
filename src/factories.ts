import { AnyComponent } from 'preact';

import * as T from './types';

// TODO
const cardComponent = (entity: string, attributes: Array<string>, prop?: string): T.CardComponent => ({
  type: 'Card',
  entity,
  attributes,
  prop
});

/**
 * Creates a Form component.
 * 
 * prop: the name of the props to look into for the entity, if not set, defaults to 'value'
 */
const formComponent = (entity: string, attributes: Array<string>, prop?: string): T.FormComponent => ({
  type: 'Form',
  entity,
  attributes,
  prop
});

const preactComponent = (component: AnyComponent<any, any>): T.PreactComponent => ({
  type: 'Preact',
  component,
});

// TODO
const syncComponent = (query?: string | T.Query, component?: string | T.Component): T.SyncComponent => ({
  type: 'Sync',
  query,
  component
})

export const Components = {
  card: cardComponent,
  form: formComponent,
  preact: preactComponent,
  sync: syncComponent,
}
