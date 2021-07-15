import { Component } from 'solid-js';
import { Link } from 'solid-app-router';

const Projects: Component = () => {
  return (
    <>
      <h1>Welcome to projects!</h1>
      <Link href="/">return home</Link>
    </>
  );
};

export default Projects;
