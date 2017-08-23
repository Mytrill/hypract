import { h, ComponentProps } from 'preact';
import { sortBy, isBoolean } from 'lodash';

import { DataOrArray, toArray, toString } from '../../data';
import { element, elements, wrap } from '../../element';
import { HypractComponent } from '../../types';

export interface ResultsListProps {
  orderBy?: DataOrArray;
  orderByValues?: boolean;
  noResults?: HypractComponent;
  oneResult?: HypractComponent;
  repeat?: boolean | HypractComponent;
  defaultResults?: object;
}

export const ResultsList = (props: ResultsListProps & ComponentProps<any>) => {
  const { orderBy, orderByValues, noResults, oneResult, repeat, defaultResults, children, ...rest } = props;

  const orderByResolved = toArray(orderBy, props, toString);

  const resultsObj = rest['results'] || defaultResults || {};
  const results = orderByValues ? Object.keys(resultsObj).map(key => resultsObj[key]).sort() :
    orderByResolved ? sortBy(Object.keys(resultsObj).map(key => resultsObj[key]), orderByResolved) :
      Object.keys(resultsObj).sort().map(key => resultsObj[key]);

  if (results.length === 0 && noResults) {
    return element(noResults, rest);
  }

  if(results.length === 1 && oneResult) {
    return element(oneResult, rest, { results, result: results[0], resultIndex: 0 });
  }

  if(repeat) {
    if(typeof repeat === 'boolean') {
      return <div>{results.map((result, resultIndex) => element(children, rest, { results, result, resultIndex }))}</div>;
    } else {
      return <div>{results.map((result, resultIndex) => element(repeat, rest, { results, result, resultIndex }))}</div>;
    }
  }

  return wrap(elements(children, rest, { 
    results, 
    result: results.length === 1 ? results[0]: undefined,
    resultIndex: results.length === 1 ? 0: undefined
  }));
}
