import { ComponentConstructor, FunctionalComponent } from 'preact';

export type PreactComponent = ComponentConstructor<any, any> | FunctionalComponent<any>;

export type HypractComponent = PreactComponent | JSX.Element;