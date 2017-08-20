import { h } from 'preact';
import { connect } from 'react-redux';

import { Query } from '../types';
import { State } from '../../reducer'; // TODO not correct
import { querySelector } from '../selectors';
import { createComponentConfFactory, renderChildrenToElement } from '../../utils';
import { ComponentProps, PreactComponent, WithChildren } from '../../types';

export interface QueryResultsConf extends WithChildren {
  path: string[];
  query: Query;
}

const mapStateToProps = (state: State, ownProps: ComponentProps<QueryResultsConf>) => ({
  results: querySelector(state, ownProps.conf.path, ownProps.conf.query),
});

const QueryResultsRaw = (props: ComponentProps<QueryResultsConf>) => {
  return renderChildrenToElement(props);
};

export const QueryResults = connect(mapStateToProps)(QueryResultsRaw);

export const queryResults = createComponentConfFactory<QueryResultsConf>(QueryResults);
