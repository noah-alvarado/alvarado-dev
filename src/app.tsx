import { Router, useRoutes } from 'solid-app-router';

import { Component } from 'solid-js';
import { routes } from './routes';

export const App: Component = () => {
  const Routes = useRoutes(routes);
  return (
    <Router>
      {/* header goes here */}
      <Routes />
      {/* footer goes here */}
    </Router>
  );
};
