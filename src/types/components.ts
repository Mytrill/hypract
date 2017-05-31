import { AnyComponent } from 'preact';

import { Query } from './queries';

/** All the components in this applications referenced by name. */
export interface Components {
  [name: string]: Component;
}

export type Component = CardComponent | FormComponent | PreactComponent| SyncComponent;

/** Component backed by one, or multiple, material cards. type = 'Card' */
export interface CardComponent {
  type: 'Card';
  /** The name of the entity to edit/create. */
  entity: string;
  /** The attributes to include. */
  attributes: Array<string>;
  /** The name of the property to look into for the entity instance. defaults to 'value' */
  prop?: string;
  // /** The widget (name or actual implementation) to use around this widget when rendering results. 
  //  * Cannot be set if wrapperTag is set. */
  // wrapper?: string | Component,
  // /** The wrapper tag to use around this widget when rendering results. 
  //  * Supports CSS selectors, e.g. 'div .result-list .highlight'
  //  * Cannot be set if wrapper is set. */
  // wrapperTag?: string,
  // /** The template to render as title, may content ':prop.attribute' to render the attribute of a property. */
  // title?: 'string';
  // /** The content. */
  // content?: Array<CardContent>;
}

export interface CardContent {
  /** The template to render as content, may content ':prop.attribute' to render the attribute of a property. */
  content: string;
  /** true to create a collapsible section, false by default. */
  collapsible?: boolean;
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
