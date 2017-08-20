import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { reduxForm } from 'redux-form';
import { h, Component } from 'preact';

import { actions } from '../../firebase';
import { createComponentConfFactory, renderChildrenToArray, data } from '../../utils';
import { ComponentProps, ComponentConf, PreactComponent, WithChildren, Data, DataOrArray } from '../../types';

export interface FormConf extends WithChildren {
  name: Data;
  path: DataOrArray;
}

interface FormRawProps extends ComponentProps<FormConf> {
  handleSubmit(): void;
}

const FormRaw = (props: FormRawProps) => {
  const { handleSubmit, conf } = props;
  return (
    <form onSubmit={handleSubmit}>
      {renderChildrenToArray(props)}
    </form>
  );
}

const mapStateToProps = (state: any, ownProps: ComponentProps<FormConf>) => ({
  // emtpy for now
});

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: ComponentProps<FormConf>) => ({
  onSubmit: (updates: any) => {
    dispatch<any>(actions.push(data.toStringArray(ownProps.conf.path, ownProps), updates)); 
  }
});

export class Form extends Component<ComponentProps<FormConf>, {}> {

  form: PreactComponent;

  componentWillMount() {
    const conf = this.props.conf;
    this.form = connect(
      mapStateToProps,
      mapDispatchToProps
    )
    // reduxForm allows only constants, not functions of props, 
    // so we have to wrap it in its own component...
    (reduxForm({
      form: conf.name
    })
    (FormRaw));
  }

  render() {
    return <this.form {...this.props} />;
  }
}

export const form = createComponentConfFactory<FormConf>(Form);
