import { App } from '../types';

/** The context accessible by all the components. */
export interface AppContext {
  app: App;
  showMessage: (message: string) => void;
}
