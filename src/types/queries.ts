
export interface Queries {
  [name: string]: Query;
}

export interface Query {
  /** The entity to query. */
  entity: string;
  /** The ID to fetch if fetching by id, may be a parameter, e.g. ':id'. */
  whereIdEquals?: string;
}

/** The map of parameter values by their name, each value may also be a props parameter, e.g. ':id' references props.id. */
export interface QueryParameters {
  /** Parameter values by name. */
  [parameter: string]: any;
}
