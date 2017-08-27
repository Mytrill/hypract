import * as React from 'react';
import { connect } from 'react-redux';

import { Query } from '../types';
import { State } from '../../reducer';
import { selectQueryResults } from '../selectors';
import { Data, DataOrArray, toString, toStringArray } from '../../data';
import { element } from '../../element';
import { ComponentProps } from '../../types';

export interface QueryResultsProps {
  path: string[];
  query: Query;
}

interface QueryResultsRawProps extends QueryResultsProps, ComponentProps {
  results: any;
}

const mapStateToProps = (state: State, ownProps: QueryResultsProps) => ({
  results: selectQueryResults(state, ownProps.path, ownProps.query),
});

const QueryResultsRaw = (props: QueryResultsRawProps) => {
  const { children, ...rest } = props;
  return element(children, rest);
};

export const QueryResults: React.ComponentClass<QueryResultsProps> = connect(mapStateToProps)(QueryResultsRaw);
