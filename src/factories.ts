import { AnyComponent } from 'preact';

import * as T from './types';


export const Components = {
  /** Factory function for the Card component. */
  card: (entity: string, attributes: T.CardAttributes, prop?: string): T.CardComponent => ({
    type: 'Card',
    entity,
    attributes,
    prop
  }),
  /** Factory function for the Form component. */
  form: (entity: string, attributes: Array<string>, prop?: string): T.FormComponent => ({
    type: 'Form',
    entity,
    attributes,
    prop
  }),
  /** Factory function for the Preact component. */
  preact: (component: AnyComponent<any, any>): T.PreactComponent => ({
    type: 'Preact',
    component,
  }),
  /** Factory function for the Sync component. */
  sync: (query?: string | T.Query, component?: string | T.Component): T.SyncComponent => ({
    type: 'Sync',
    query,
    component
  }),
};

export const Actions = {
  // editToUrl: (targetUrl: string): T.EditAction => ({
  //   type: 'Edit',
  //   targetUrl
  // }),
  // editToComponent: (targetComponent: string): T.EditAction => ({
  //   type: 'Edit',
  //   targetComponent
  // }),
  // update: (values: T.UpdateValues, displayName?: string, displayIcon?: string): T.UpdateAction => ({
  //   type: 'Update',
  //   values,
  //   displayName,
  //   displayIcon
  // })
};

export const Data = {
  constant: (constant: any): T.Data => ({ constant })
}