import { h, ComponentProps, FunctionalComponent } from 'preact';
import { connect } from 'react-redux';

import { Query } from '../types';
import { State } from '../../reducer';
import { querySelector } from '../selectors';
import { Data, DataOrArray, toString, toStringArray } from '../../data';
import { element, elements, wrap } from '../../element';
import { PreactComponent } from '../../types';

export interface QueryResultsProps {
  path: string[];
  query: Query;
}

const mapStateToProps = (state: State, ownProps: QueryResultsProps) => ({
  results: querySelector(state, ownProps.path, ownProps.query),
});

const QueryResultsRaw = (props: QueryResultsProps & ComponentProps<any>) => {
  const { children, ...rest } = props;
  return wrap(elements(children, rest));
};

export const QueryResults: FunctionalComponent<QueryResultsProps> = connect(mapStateToProps)(QueryResultsRaw);
