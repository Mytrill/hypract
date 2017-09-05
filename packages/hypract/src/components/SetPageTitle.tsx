import { PropSelectorOr, Eval } from '../propSelectors'
import { ComponentProps } from '../types'
import { element } from '../element'

export interface SetPageTitleProps {
  title: PropSelectorOr<string>
}

export const SetPageTitle = (props: SetPageTitleProps & ComponentProps) => {
  const { title, children, ...rest } = props
  document.title = Eval.toString(title, rest)
  return element(children, rest)
}
