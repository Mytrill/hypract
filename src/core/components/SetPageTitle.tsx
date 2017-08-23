import { h, Component, ComponentProps } from 'preact';

import { Data, toString } from '../../data';
import { elements, wrap } from '../../element';

export interface SetPageTitleProps {
  title: Data;
}

export const SetPageTitle = (props: SetPageTitleProps & ComponentProps<any>) => {
  const { title, children, ...rest } = props;
  document.title = toString(props.title, props);
  return wrap(elements(children, rest));
}
