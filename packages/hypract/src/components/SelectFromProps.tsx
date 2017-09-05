import React from 'react'

import { applySelectorMap, PropSelectorMap } from '../propSelectors'
import { ComponentProps } from '../types'
import { elements } from '../element'

export interface SelectFromPropsProps {
  selectors: PropSelectorMap
  // TODO add dispatchs
}

export const SelectFromProps = ({ selectors, children, ...rest }: SelectFromPropsProps & ComponentProps) => {
  return <div>{elements(this.props.children, rest, applySelectorMap(selectors, rest))}</div>
}
