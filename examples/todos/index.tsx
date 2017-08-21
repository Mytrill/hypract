import { createStore, applyMiddleware } from 'redux';
import { h } from 'preact';
import 'preact/devtools';

import { hypract, firebase as fb } from '../../src';
import { core, firebase, material } from '../../src/components';

fb.init({ databaseURL: 'https://learn-project-dev.firebaseio.com' });

const app = (
  <core.App conf={{ title: 'My App' }}>
    <firebase.Query conf={{ path: 'todos' }}>
      <core.ResultsList conf={{ orderBy: 'title', repeat: true }}>
        <core.ShowProps conf={{ title: 'Props for todo="{{=result.title}}" index={{=resultIndex}}', hidden: true }} />
        <material.Card conf={{ }}>
          <material.CardHeader conf={{ title: '{{=result.title}}' }} >
          </material.CardHeader>
        </material.Card>
      </core.ResultsList>
    </firebase.Query>

    <material.Form conf={{ name: 'AddTodo', path: 'todos' }}>
      <core.ShowStore conf={{ title: 'Props for form', path: 'form', hidden: true }} />
      <material.FormField conf={{ label: 'Title', name: 'title', type: 'string' }} />
      <material.FormField conf={{ label: 'Description', name: 'description', type: 'text' }} />
      <material.FormField conf={{ label: 'Done', name: 'done', type: 'boolean' }} />
    </material.Form>
  </core.App>
);

hypract(app);
