import * as React from 'react';

import { ComponentProps } from '../../types';

export interface ThenProps {

}

export const Then = ({ children }: ThenProps & ComponentProps) => {
  return <div>{children}</div>;
}