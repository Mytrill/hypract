import hypract, { App, SimpleType, factories } from '../../src/index';
import firebaseConfig from '../firebaseConfig';

const Comps = factories.Components;
const Actions = factories.Actions;
const Data = factories.Data;

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
    'Todo.sync.all': Comps.sync('Todo.all', 'Todo.card'),
    'Todo.card': Comps.card('Todo', {actions: ['Todo.edit']}),
    'Todo.form': Comps.form('Todo', ['title', 'description']),
  },
  actions: {
    'Todo.edit': Actions.editToComponent(('Todo.form')),
  },
  queries: {
    'Todo.all': { entity: 'Todo' },
    'Todo.one': { entity: 'Todo', whereIdEquals: ':id' }
  }
}

hypract(app);