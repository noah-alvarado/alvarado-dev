import { Component } from 'solid-js';
import { Link } from 'solid-app-router';

const Home: Component = () => {
  return (
    <>
      <h1>Noah Alvarado</h1>
      <Link href="/projects">projects</Link>
    </>
  );
};

export default Home;
