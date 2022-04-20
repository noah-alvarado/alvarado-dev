import { Component } from 'solid-js';
import Contact from '../components/Contact';
import Intro from '../components/Intro';

const NameTitle: Component = () => {
  return (
    <div class="absolute bg-opacity-80 bg-stone-800 prose text-stone-300 text-center py-4 px-6 rounded-md top-1/2 -translate-y-1/2
                right-6 lg:right-10 xl:right-20">
      <div class="font-semibold text-lg lg:text-2xl xl:text-4xl">Noah Alvarado</div>
      <div class="font italic text-sm lg:text-md xl:text-lg">Software Engineer</div>
    </div>
  );
};

const Home: Component = () => {
  return (
    <>
      <div class="relative mx-auto">
        <img src="assets/wndr-museum.jpg" alt="Noah Alvarado at the WNDR Museum in Chicago, IL" />
        <NameTitle />
      </div>

      <div class="container my-10 mx-auto p-5 py-3 rounded-md
                  prose prose-stone dark:prose-invert">
        <Intro />
      </div>

      <div class="container relative max-w-prose my-10 mx-auto p-5 py-3 pt-6 rounded-md border-2 border-orange-400
                  prose prose-stone dark:prose-invert">
        <label class="absolute -top-5 left-8 bg-base px-7 py-0.5 rounded-md border-2 border-orange-400 text-lg">Talk to me</label>
        <Contact />
      </div>
    </>
  );
};

export default Home;
