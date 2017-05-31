import { h, Component } from 'preact';
import { Card, Button } from 'preact-mdl';

import { create } from '../storage';
import { FormField, FormFieldWidgetProps } from './FormField';
import { FormComponent as Config, ComponentProps, Attribute, SimpleType, Entity } from '../types';
import { AppContext } from './types';


// /////////////////////////////////////////////////////////////////////////////////////
// 
// Types
// 
// /////////////////////////////////////////////////////////////////////////////////////


export interface FormProps {
  config: Config;
  props: ComponentProps;
}

interface FormValue {
  [attribute: string]: FormFieldWidgetProps;
}

export interface FormState {
  value: FormValue;
  loading?: boolean;
}


// /////////////////////////////////////////////////////////////////////////////////////
// 
// Utils
// 
// /////////////////////////////////////////////////////////////////////////////////////


const getValue = (attribute: Attribute, config: Config, props: ComponentProps): any => {
  // try to get the value passed down in the props, if any.
  const entity = props[config.prop || 'value'];
  if(typeof entity === 'object' && typeof entity[attribute.name] !== 'undefined') {
    return entity[attribute.name];
  }

  // otherwise returns a default value depending on the type of attribute
  switch(attribute.type) {
    case SimpleType.BOOLEAN:
      return false;
    case SimpleType.ENUM:
      if(attribute.nullable) {
        return null;
      }

      if(!attribute.enumValues || attribute.enumValues.length === 0) {
        throw new Error('No enum values for attribute ' + JSON.stringify(attribute));
      }
      throw new Error('I am not sure for enums, please check me!');
      // return attribute.enumValues[0];
    case SimpleType.STRING:
    case SimpleType.TEXT:
    case SimpleType.TITLE:
    case SimpleType.URL:
      return '';
    default:
      throw new Error('Unsupported type for attribute ' + JSON.stringify(attribute));
  }
}

const hasEntityInValues = (config: Config, props: ComponentProps): boolean => {
  return typeof props[config.prop || 'value'] === 'object';
}


// /////////////////////////////////////////////////////////////////////////////////////
// 
// Component
// 
// /////////////////////////////////////////////////////////////////////////////////////


export class FormComponent extends Component<FormProps, FormState> {

  state: FormState = { value: {} };

  constructor(props?: FormProps, context?: any) {
    super(props, context);

    this.updateAttribute = this.updateAttribute.bind(this);
    this.cancel = this.cancel.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {

    // console.log('Rendering form with props: ' + JSON.stringify(this.props));

    // set the values to pass down to the fields, these should be coming from
    // the component values, or set to some default value depending on the attribute type.
    const entity = this.resolveEntity(this.props.config.entity);
    this.props.config.attributes.forEach(attribute => {
      const value = getValue(entity.attributes[attribute], this.props.config, this.props.props);
      // console.log('Got value ' + value + ' for attribute ' + attribute);
      this.state.value[attribute] = { value };
    });
  }

  render(props: FormProps, state: FormState, context: AppContext) {

    const entityName = props.config.entity;
    const entity = this.resolveEntity(entityName);

    const fields = props.config.attributes.map(attr => {
      const attribute = entity.attributes[attr];
      if(!attribute) {
        throw new Error('Could not find attribute ' + attr + ' in entity ' + entityName);
      }

      return <FormField attribute={attribute} updateAttribute={this.updateAttribute} widgetProps={this.state.value[attr]} />;
    });

    // no cancel for now, that'll depend!
    // fields.push(<Button onClick={this.cancel}>Cancel</Button>);
    fields.push(<Button onClick={this.submit}>Submit</Button>);

    const title = hasEntityInValues(props.config, props.props) ? 'Edit ' + entityName : 'Create ' + entityName;

    // TODO add the title: Create/Update entity.name
    return (
      <Card class='main-card mdl-shadow--2dp' >
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          {fields}
        </Card.Text>
      </Card>
    );
  }

  resolveEntity(entity: string): Entity {
    if(!this.context.app.model) {
      throw new Error('No model defined for this app, cannot find entity ' + entity);
    }
    const result = this.context.app.model[entity];
    if(!entity) {
      throw new Error('Could not find entity with name ' + entity + ' in the App.');
    }
    return result
  }

  cancel() {
    // TODO redirect somewhere...
  }

  submit() {
    const entityName = this.props.config.entity;
    const entity = this.resolveEntity(entityName);

    let hasValidationErrors = false;
    const toCreate = {};
    const fields = this.props.config.attributes.map(attr => {
      const attribute = entity.attributes[attr];
      if(!attribute) {
        throw new Error('Could not find attribute ' + attr + ' in entity ' + entityName);
      }

      const value = this.state.value[attr];
      value.errorMessage = null;

      // console.log('Validating attribute ' + JSON.stringify(attribute) + ' value: ' + JSON.stringify(value));

      // attribute.nullable set during initialization.
      if(!attribute.nullable && (value.value === null || value.value === '')) {
        value.errorMessage = attribute.displayName + ' cannot be empty.';
        hasValidationErrors = true;
      }
      toCreate[attr] = value.value;
    });

    if(hasValidationErrors) {
      this.forceUpdate();
    } else {
      const context: AppContext = this.context;
      if(hasEntityInValues(this.props.config, this.props.props)) {
        // update entity
        throw new Error('Doesn\'t support update just yet');
      } else {
        // create entity
        create(entity, toCreate)
        .then(result => {
          context.showMessage( entity.name + ' created!');
          // TODO erase fields
          // TODO redirect if needed
        })
        .catch(error => {
          console.log('Error while creating entity: ' + JSON.stringify(error));
          context.showMessage('Error while creating ' + entity.name + '!');
        });
      }
    }
  }

  updateAttribute(attribute: Attribute, value: any) {
    this.state.value[attribute.name] = { value };
    this.forceUpdate();
  }

}
export default FormComponent;
