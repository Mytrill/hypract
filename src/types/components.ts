import { AnyComponent } from 'preact';

import { Action } from './actions';
import { Entity } from './model';
import { Query } from './queries';

/** All the components in this applications referenced by name. */
export interface Components {
  [name: string]: Component;
}

export type Component = CardComponent | FormComponent | PreactComponent| SyncComponent;

/** Component backed by one, or multiple, material cards. type = 'Card' */
export interface CardComponent {
  type: 'Card';
  /** The name of the entity to display. */
  entity: string;
  /** The attributes to include, if not set, the card tries to use the correct attributes
   *  based on the attribute mappings of the entity. */
  attributes?: CardAttributes;
  /** The name of the property to look into for the entity instance. defaults to 'value' */
  prop?: string;
}

export interface CardAttributes {
  /** The title to display, may use :propName.attributeName to access props, or #attributeName to access an attribute of the currently displayed entity. */
  title?: string | DataTemplate | DataResolver;
  /** The subtitle to display, may use :propName.attributeName to access props, or #attributeName to access an attribute of the currently displayed entity. */
  subtitle?: string | DataTemplate | DataResolver;
  /** The text to display, may use :propName.attributeName to access props, or #attributeName to access an attribute of the currently displayed entity. */
  supportingText?: string | DataTemplate | DataResolver;
  /** The actions to offer on each card. */
  actions?: Array<string | Action>,
  /** The actions to offer in the context menu on each card. */
  menu?: Array<string | Action>,
}

export type DataResolver = (props: ComponentProps, data: any) => string | JSX.Element;

export interface DataTemplate {
  text?: string;
  attribute?: string;
  pathInProps?: Array<string>;
}

/** Component type for a form. */
export interface FormComponent {
  type: 'Form';
  /** The name of the entity to edit/create. */
  entity: string;
  /** The attributes to edit. */
  attributes: Array<string>;
  /** The name of the property to look into for the entity instance. defaults to 'value' */
  prop?: string;
}

/** Component type for a list. */
export interface ListComponent {
  type: 'List',
  /** The name of the entity to display. */
  entity: string;
  // TODO: no, we can do better than this..
  /** The attributes to include, includes title and url attribute if not set. */
  attributes?: Array<string>;
  /** The name of the property to look into for the entity instance. defaults to 'value' */
  prop?: string;
}

/** A component implemented with an actual Preact component. */
export interface PreactComponent {
  type: 'Preact';
  /** The underlying Preact component. */
  component: AnyComponent<any, any>;
}

/** A single component, e.g. a self contained element that deals with logic and UI for an entity. */
export interface SyncComponent {
  type: 'Sync';
  /** The query to execute to find the data to display/edit. */
  query?: string | Query;
  /** The name of the props to store the query result into. defaults to 'value'. */
  targetProp?: string;
  /**The props to use for the query, it is possible to reference other props, e.g.: { 'subjectId': ':id' } will copy the value
   * of 'id' in 'subjectId'. */
  props?: ComponentProps;
  /** The component to use do CRUD operations on the data. */
  component?: Component | string;
  /** The component to use if query !== null and the query returns only one result, defaults to the 'component' attribute if not set. */
  componentSingleResult?: Component | string;
  /** The component to use if query !== null and the query does not return any result, defaults to the 'component' attribute if not set. */
  componentNoResult?: Component | string;
}

/** The map of props that gets populated/transmitted from the page down to the widgets. */
export interface ComponentProps {
  [name: string]: any;
}
