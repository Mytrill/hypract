import { h, Component } from 'preact';
import { CheckBox, Radio, RadioProps, TextField, TextFieldProps } from 'preact-mdl';


import { Attribute, SimpleType } from '../types';

export interface FormFieldProps {
  attribute: Attribute;
  updateAttribute: (attribute: Attribute, value: any) => void;
  widgetProps: FormFieldWidgetProps;
}

export interface FormFieldState {

}

/** Standard/normalized properties to use to display any form field. */
export interface FormFieldWidgetProps {
  /** The value to display. */
  value?: any;
  /** The error message to display, if any. */
  errorMessage?: string;
}

// textfield props:
// "floating-label"?: boolean;
// errorMessage?: string;
// expandable?: boolean;
// multiline?: boolean;
// label?: string;
// value?: string;
// onSearch?: ((event) => boolean|void);
// onInput: this.linkState('attr') method provided by preact :)

const fieldWidget = (attribute: Attribute, updateAttribute: (event: Event) => void, props: FormFieldWidgetProps): JSX.Element => {
  const type = attribute.type;
  if (typeof type === 'string') {
    // TODO complex stuff
    throw new Error('Not supported yet.');
  } else {
    switch(attribute.type) {
      case SimpleType.TITLE:
      case SimpleType.STRING:
      case SimpleType.URL:
        return <TextField 
                    class='form-field'
                    label={attribute.displayName} 
                    floating-label 
                    errorMessage={props.errorMessage}
                    value={props.value || ''} 
                    onInput={updateAttribute} />;
      case SimpleType.TEXT:
        return <TextField 
                    class='form-field'
                    label={attribute.displayName} 
                    floating-label 
                    multiline 
                    errorMessage={props.errorMessage}
                    value={props.value || ''} 
                    onInput={updateAttribute} />;
      case SimpleType.ENUM:
        // TODO
        // return 
      case SimpleType.BOOLEAN:
        // TODO
        // return <CheckBox>
      default:
        throw new Error('Unsupported type for attribute ' + JSON.stringify(attribute));
    }
  }
}

export class FormField extends Component<FormFieldProps, FormFieldState> {

  constructor(props?: FormFieldProps, context?: any) {
    super(props, context);

    this.updateAttribute = this.updateAttribute.bind(this);
  }

  updateAttribute(e) {
    this.props.updateAttribute(this.props.attribute, e.target.value);
  }

  render(props: FormFieldProps) {
    return fieldWidget(props.attribute, this.updateAttribute, this.props.widgetProps);
  }
}
export default FormField;
