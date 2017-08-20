import { ComponentConstructor, FunctionalComponent } from 'preact';

export interface Action<P> {
  type: string;
  payload: P;
  error?: boolean;  
}

export interface Resolver<T> {
  (data: Data, props: any, defaultVal?: T): T | undefined;
}
interface StringFn {
  (props: any): string;
}
export type Data = string | StringFn;

export type DataOrArray = Data | Data[];

export type PreactComponent = ComponentConstructor<any, any> | FunctionalComponent<any>;

interface ComponentConfiguration {
  renderer?: PreactComponent;
}

export type ComponentConf = JSX.Element | PreactComponent | ComponentConfiguration;

export interface WithChildren {
  children?: ComponentConf[];
}

export interface WithTypedChildren<T> {
  children: Array<T & ComponentConf>;
}

export interface WithWrappers {
  wrappers?: Array<ComponentConf & WithChildren>;
}

export interface ComponentProps<T> {
  conf: T;
}
