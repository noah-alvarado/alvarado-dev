import { Router, useRoutes } from 'solid-app-router';

import { Component } from 'solid-js';
// import Header from './components/Header';
import { routes } from './routes';

export const App: Component = () => {
  const Routes = useRoutes(routes);
  return (
    <Router>
      {/* <Header /> */}
      <Routes />
      {/* footer goes here */}
    </Router>
  );
};
