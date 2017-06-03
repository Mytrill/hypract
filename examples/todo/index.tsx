import hypract, { App, SimpleType, factories } from '../../src/index';
import firebaseConfig from '../firebaseConfig';

const C = factories.Components;
const A = factories.Actions;

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
        },
        'description': {
          type: SimpleType.TEXT,
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
    'Todo.sync.all': C.sync('Todo.all', 'Todo.card'),
    'Todo.card': C.card('Todo', {actions: ['Todo.edit']}),
    'Todo.form': C.form('Todo', ['title', 'description']),
  },
  actions: {
    'Todo.edit': A.editToComponent(('Todo.form')),
  },
  queries: {
    'Todo.all': { entity: 'Todo' },
    'Todo.one': { entity: 'Todo', whereIdEquals: ':id' }
  }
}

hypract(app);