import { AnyComponent } from 'preact';

import { Component } from './components';

/** All the pages in this application referenced by name. */
export interface Pages {
  [name: string]: Page;
}

/** The parameterization for a single page of the app. */
export interface Page {
  /** The name of this page, default to the key in the Config.pages object. */
  name?: string;
  /** The title that appears in the browser, may include ':app' to reference the title of the app. */
  title?: string,
  /** The path of this page in the browser, may include variables, e.g. ['subjects', ':id', 'edit'] will match /subjects/<any string>/edit. */
  path?: Array<string>;
  /** true if this is the index page, there should be only one page in the config.pages with this flag set to true. */
  index?: boolean;
  /** If this is set, will override the rendering of the page. Useful for static pages. This or components must be set. */
  render?: AnyComponent<any, any>;
  /** The components to include in this page. This or render must be set. */
  components?: Array<Component | string>;
}
