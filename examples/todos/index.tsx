import { createStore, applyMiddleware } from 'redux';
import { createElement } from 'react';

import { hypract, core, firebase, form, material } from '../../src';

firebase.init({ databaseURL: 'https://learn-project-dev.firebaseio.com' });

const app = (
  <core.components.SetPageTitle title="My App">
    <firebase.components.Query path="todos">
      <core.components.ResultsList  orderBy="title" repeat={true}>
        <core.components.ShowProps title="Props for todo={{=result.title}} index={{=resultIndex}}" hidden={true} />
        <material.components.Card>
          <material.components.CardHeader title="{{=result.title}}" />
        </material.components.Card>
      </core.components.ResultsList>
    </firebase.components.Query>

    <form.components.Form name="AddTodo" path="todos">
      <core.components.ShowStore title="Props for form" path="form" hidden={true} />
      <form.components.FormField label="Title" name="title" type="string" />
      <form.components.FormField label="Description" name="description" type="text" />
      <form.components.FormField label="Done" name="done" type="boolean" />
    </form.components.Form>
  </core.components.SetPageTitle>
);

hypract(app);
