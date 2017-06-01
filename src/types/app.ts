import { Actions } from './actions';
import { Component, Components } from './components';
import { Model } from './model';
import { Queries } from './queries';
import { Pages } from './pages';


/** The root object that parameterize the entire web app. */
export interface App {
  config: Config;
  model?: Model;
  queries?: Queries;
  actions?: Actions;
  pages?: Pages;
  components?: Components;
}

/** Configuration of the application itself (e.g. name, layout, firebase config, etc...). */
export interface Config {
  title: string;
  /** The widget (name or actual implementation) to use as layout for this app, if any. */
  layout?: string | Component;
  /** The firebase configuration for this app. */
  firebaseConfig: FirebaseConfig | string;
}

/** The configuration for Firebase. */
export interface FirebaseConfig {
  apiKey?: string,
  authDomain?: string,
  databaseURL: string,
  storageBucket?: string,
  messagingSenderId?: string,
}