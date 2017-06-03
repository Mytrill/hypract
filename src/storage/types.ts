import { Entity } from '../types';

/**
 * Query for which all the parameters values have been computed from
 * the ComponentProps. Such a query can be executed directly.
 */
export interface ResolvedQuery {
  entity: Entity;

  whereIdEquals?: string;
};
