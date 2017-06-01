import hypract, { App, SimpleType, factories } from '../../src/index';
import firebaseConfig from '../firebaseConfig';

// the app itself
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
  pages: {
    'Index': {
      title: ':app - Index',
      index: true,
      components: ['Todo.sync.all', 'Todo.form'],
    }
  },
  components: {
    'Todo.sync.all': factories.Components.sync('Todo.all', 'Todo.card'),
    'Todo.card': factories.Components.card('Todo', ['title']),
    'Todo.form': factories.Components.form('Todo', ['title']),
  },
  queries: {
    'Todo.all': { entity: 'Todo' },
    'Todo.one': { entity: 'Todo', whereIdEquals: ':id' }
  }
}

hypract(app);