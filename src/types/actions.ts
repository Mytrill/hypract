import { Component } from './components';


export interface Actions {
  [name: string]: Action;
}

export type Action = EditAction | UpdateAction;

/** The action to edit an entity. */
export interface EditAction {
  type: 'Edit';
  /** The component to redirect to for edit, this attribute should not be set if targetUrl is set. */
  targetComponent?: string | Component;
  /** The url to redirect to for edit, this attribute should not be set if targetComponent is set. */
  targetUrl?: string;
}

export interface UpdateAction {
  type: 'Update';
  displayName?: string;
  displayIcon?: string;
  values: UpdateValues;
}

export interface UpdateValues {
  [attribute: string]: any;
}

// TODO figure this one out after
// export interface ToggleAction {
//   type: 'Toggle';
// }