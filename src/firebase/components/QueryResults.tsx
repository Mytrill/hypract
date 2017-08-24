import { StatelessComponent } from 'react';
import { connect } from 'react-redux';

import { Query } from '../types';
import { State } from '../../reducer';
import { querySelector } from '../selectors';
import { Data, DataOrArray, toString, toStringArray } from '../../data';
import { element } from '../../element';
import { ComponentProps } from '../../types';

export interface QueryResultsProps {
  path: string[];
  query: Query;
}

const mapStateToProps = (state: State, ownProps: QueryResultsProps) => ({
  results: querySelector(state, ownProps.path, ownProps.query),
});

const QueryResultsRaw = (props: QueryResultsProps & ComponentProps) => {
  const { children, ...rest } = props;
  return element(children, rest);
};

export const QueryResults: StatelessComponent<QueryResultsProps> = connect(mapStateToProps)(QueryResultsRaw);
