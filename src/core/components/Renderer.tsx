import { h } from 'preact';

import { ComponentProps } from '../../types';
import { renderToElement } from '../../utils';

export const Renderer = (props: ComponentProps<any>) => renderToElement(props.conf, props);
