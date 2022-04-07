import { Component } from 'solid-js';
import Header from './components/Header';
import { routes } from './routes';
import { useRoutes } from 'solid-app-router';

export const App: Component = () => {
  const Routes = useRoutes(routes);

  return (
    <>
      <Header />
      <Routes />
      {/* footer goes here */}
    </>
  );
};
