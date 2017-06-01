import hypract, { App, SimpleType, factories } from '../../src';
import firebaseConfig from '../firebaseConfig';

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
      components: ['Todo.sync.all'],
    }
  },
  components: {
    'Todo.sync.all': factories.Components.sync('Todo.all', 'Todo.card'),
    'Todo.card': factories.Components.card('Todo', ['title']),
  },
  queries: {
    'Todo.all': { entity: 'Todo' },
    'Todo.one': { entity: 'Todo', whereIdEquals: ':id' }
  }
}

hypract(app);