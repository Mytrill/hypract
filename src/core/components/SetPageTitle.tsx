import { Data, toString } from '../../data';
import { ComponentProps } from '../../types';
import { element } from '../../element';

export interface SetPageTitleProps {
  title: Data;
}

export const SetPageTitle = (props: SetPageTitleProps & ComponentProps) => {
  const { title, children, ...rest } = props;
  document.title = toString(props.title, props);
  return element(children, rest);
}
