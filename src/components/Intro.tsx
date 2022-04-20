import { Component } from 'solid-js';
import { Link } from 'solid-app-router';

const Intro: Component = () => {
  return (
    <article>
      <p>
        Hello!
      </p>
      <p>
        My name is Noah Alvarado.
        I am a Chicago-based software engineer.
        I build websites and backend services that are useful, extensible, and reliable.
      </p>
      <p>
        I offer a proven capability to build complex applications that operate on a local to global scale.
        I can bring an application to life across the entire process of development and operate as a key contributor to a productive team.
        At a high level I design infrastructure, configure complex networks, build CI/CD pipelines, crunch analytic data, integrate complex APIs and more.
        {/* I am a certified AWS Solution Architect */}
      </p>
      <p>
        Some examples include a <Link href="https://numun.org/">website and conference solution</Link> for a Model UN organization and a <Link href="https://unfound.app/">cross-platform social media app</Link> with a worldwide presence.
        Technologies I used include React and React Native, Angular, Python + Flask, Node.js + Express, SQLite, PostgreSQL, MongoDB, NGINX, and AWS.
        {/* More projects and information is available <Link href="/projects">here</Link>. */}
      </p>
      <p>
        If you would like a copy of my resume, have a question, or just want to get in touch please contact me using the form below.
        Thanks for stopping by!
      </p>
    </article>
  );
};

export default Intro;
