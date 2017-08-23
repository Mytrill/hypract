import { Data } from '../data';

export interface OperationError {
  message: string;
}

export interface SingleQueryState {
  done: boolean;
  success: boolean;
}

export interface QueryState {
  all?: SingleQueryState;
  [name: string]: SingleQueryState;  
}

export interface QueryStateTreeNode {
  __state?: SingleQueryState
}

export interface QueryStateTree {
  [child: string]: QueryStateTree;
}

export type QueryStates = QueryStateTreeNode & QueryStateTreeNode;

export interface Query {
  where?: string | string[];
  equals?: string;
}

export interface UnresolvedQuery {
  where?: Data | Data[];
  equals?: Data;
}
