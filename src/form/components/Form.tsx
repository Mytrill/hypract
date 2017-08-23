import { h, Component, ComponentProps, FunctionalComponent } from 'preact';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { reduxForm } from 'redux-form';

import { actions } from '../../firebase';
import { Data, DataOrArray, toStringArray } from '../../data';
import { element, elements, wrap } from '../../element';
import { PreactComponent } from '../../types';

export interface FormProps {
  name: Data;
  path: DataOrArray;
}

interface FormRawProps extends FormProps {
  handleSubmit(): void;
}

const FormRaw = (props: FormRawProps & ComponentProps<any>) => {
  const { handleSubmit, children, ...rest } = props;
  return (
    <form onSubmit={handleSubmit}>
      {elements(children, rest)}
    </form>
  );
}

const mapStateToProps = (state: any, ownProps: FormProps) => ({
  // emtpy for now
});

const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: FormProps) => ({
  onSubmit: (updates: any) => {
    dispatch<any>(actions.push(toStringArray(ownProps.path, ownProps), updates)); 
  }
});

export class Form extends Component<FormProps, any> {

  form: PreactComponent;

  componentWillMount() {
    const { name } = this.props;
    this.form = connect(
      mapStateToProps,
      mapDispatchToProps
    )
    // reduxForm allows only constants, not functions of props, 
    // so we have to wrap it in its own component...
    (reduxForm({
      form: name
    })
    (FormRaw));
  }

  render() {
    return <this.form {...this.props} />;
  }
}
