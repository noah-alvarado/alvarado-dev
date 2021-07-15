import { Route, Router } from 'solid-app-router';

import { Component } from 'solid-js';
import { routes } from './routes';

export const App: Component = () => {
  return (
    <Router routes={routes}>
      {/* header goes here */}
      <Route />
      {/* footer goes here */}
    </Router>
  );
};
