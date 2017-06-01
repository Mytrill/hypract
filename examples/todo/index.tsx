import start from '../../src/start';
import firebaseConfig from '../firebaseConfig';

import { App, SimpleType } from '../../src/types';

const app: App = {
  config: {
    title: 'Todo example App',
    firebaseConfig
  },
  model: {
    'Todo': {
      attributes: {
        'title': {
          type: SimpleType.TITLE,
          nullable: false,
        }
      }
    }
  },
  
}