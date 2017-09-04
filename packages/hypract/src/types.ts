import * as React from 'react';

// # Components

export interface ComponentProps {
  children?: ReactNode;
}

export type ReactElement = React.ReactElement<any>;

export type ReactNode = React.ReactNode;

export type ReactComponent = React.ComponentType<any>;

export type HypractComponent = ReactComponent | ReactNode;

// # Data

export interface EntitiesByType {
  [type: string]: EntitiesById
}

export interface EntitiesById {
  [id: string]: Entity
}

export interface Entity {
  _id: string
  _type: string
  _datasource: string
  _deleted?: boolean
  _previous?: Entity
}

// # edits

export type Edit = Create | Update | Delete

export interface Create {
  type: 'Create'
  entityType: string
  entity: any
  /** The id to set to the created entity. This field should be filled in be the data source. */
  id?: string
}

export interface Update {
  type: 'Update'
  entityType: string
  id: string
  updates?: any
}

export interface Delete {
  type: 'Delete'
  entityType: string
  id: string
}

export interface Query {
  entityType: string
  where?: Where
  refresh?: boolean
}

export interface Where {
  attribute: string
  equals: any
}

export interface PendingEditsByDatasource {
  [datasource: string]: Edit[]
}

// # Errors

export interface OperationError {
  message: string
}

// # Query states

export interface QueryStatesByType {
  [type: string]: QueryStates
}

export interface QueryStates {
  all?: QueryState
  [name: string]: QueryState
}

export interface QueryState {
  done: boolean
  success: boolean
}
