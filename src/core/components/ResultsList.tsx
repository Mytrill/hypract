import { h } from 'preact';
import { sortBy, isBoolean } from 'lodash';

import { DataOrArray, ComponentConf, ComponentProps, WithChildren, WithWrappers } from '../../types';
import { createComponentConfFactory, renderChildrenToElement, renderToElement, data } from '../../utils';

export interface ResultsListConf extends WithChildren, WithWrappers {
  orderBy?: DataOrArray;
  orderByValues?: boolean;
  noResults?: ComponentConf;
  oneResult?: ComponentConf;
  repeat?: boolean | ComponentConf;
}

interface ResultsListProps extends ComponentProps<ResultsListConf> {
  results?: any;
  children?: JSX.Element[];
}

export const ResultsList = (props: ResultsListProps) => {
  const { conf, children, ...rest } = props;

  const orderBy = data.toArray(conf.orderBy, props, data.toString);

  const resultsObj = rest.results || {};
  const results = conf.orderByValues ? Object.keys(resultsObj).map(key => resultsObj[key]).sort() :
    orderBy ? sortBy(Object.keys(resultsObj).map(key => resultsObj[key]), conf.orderBy) :
      Object.keys(resultsObj).sort().map(key => resultsObj[key]);

  if (results.length === 0 && conf.noResults) {
    return renderToElement(conf.noResults, rest, { results });
  }

  if(results.length === 1 && conf.oneResult) {
    return renderToElement(conf.oneResult, rest, { results, result: results[0], resultIndex: 0 });
  }

  if(conf.repeat) {
    // workaround for typescript type system
    const repeat = conf.repeat;
    if(typeof repeat === 'boolean') {
      return <div>{results.map((result, resultIndex) => renderToElement(children, rest, { results, result, resultIndex }))}</div>;
    } else {
      return <div>{results.map((result, resultIndex) => renderToElement(repeat, rest, { results, result, resultIndex }))}</div>;
    }
  }

  return renderChildrenToElement(props, { 
    results, 
    result: results.length === 1 ? results[0]: undefined,
    resultIndex: results.length === 1 ? 0: undefined
  });
}

export const resultsList = createComponentConfFactory<ResultsListConf>(ResultsList);
