import { h } from 'preact';
import { Card } from 'preact-mdl';

import CardComponent from './components/CardComponent';
import FormComponent from './components/FormComponent';
import SyncComponent from './components/SyncComponent';

import { Component } from './types';

export const renderComponent = (component: Component, props: any): JSX.Element => {

  // console.log('Rendering component ' + JSON.stringify(component));

  switch(component.type) {
    case 'Card': return <CardComponent config={component} {...props} />;
    case 'Form': return <FormComponent config={component} {...props} />;
    case 'Preact': return <component.component {...props} />;
    case 'Sync': return <SyncComponent config={component} {...props} />;
    default: throw new Error('Could not render component ' + JSON.stringify(component));
  }
};
export default renderComponent;
