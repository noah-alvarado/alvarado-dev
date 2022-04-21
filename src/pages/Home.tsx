import { Component, createMemo } from 'solid-js';

import Contact from '../components/Contact';
import Intro from '../components/Intro';

const Home: Component = () => {
  const imageSizingClasses = createMemo(() => 'min-h-[48.35vw] xl:min-h-[44rem] xl:h-[48.35vw] xl:max-h-[60.0vh]');

  return (
    <>
      <div class="relative">
        {/* Header image */}
        <div class="border-b-2 border-orange-400 overflow-hidden">
          <img class={`object-cover object-top w-full h-full ${imageSizingClasses()}`} src="assets/wndr-museum.jpg" alt="Noah Alvarado at the WNDR Museum in Chicago, IL" />
        </div>

        <div class={`mx-auto justify-between items-center ${imageSizingClasses()}
                     xl:absolute xl:top-0 xl:inset-x-0 xl:container xl:flex xl:flex-row-reverse xl:px-12 xl:py-4`}>

          {/* Name and title block */}
          <div class="bg-stone-800 prose text-stone-300 text-center px-6 py-2 rounded-md h-fit w-fit border-2 border-turquoise-400
                      absolute xl:static
                      top-4 right-4 md:top-12 md:right-12 lg:top-20 lg:right-20 xl:mr-16">
            <div class="leading-4 font-semibold text-sm md:text-lg lg:text-2xl xl:text-4xl">Noah Alvarado</div>
            <div class="leading-4 italic text-xs md:text-sm lg:text-md xl:text-lg">Software Engineer</div>
          </div>

          {/* Intro letter */}
          <div class="relative inset-x-0 -top-4 md:-top-20 lg:-top-32 xl:top-auto">
            <div class="bg-stone-800 mx-auto px-5 py-3
                        prose prose-stone dark:prose-invert
                        border-turquoise-400 border-y-2 xs:border-2 xs:rounded-md">
              <Intro />
            </div>
          </div>

        </div>
      </div>

      {/* Contact form */}
      <div class="container relative max-w-prose my-10 xl:mt-20 mx-auto px-5 py-3 pt-6
                  prose prose-stone dark:prose-invert
                  border-orange-400 border-y-2 xs:border-2 xs:rounded-md">
        <label class="absolute -top-5 left-8 bg-base px-7 py-0.5 rounded-md border-2 border-orange-400 text-lg">Talk to me</label>
        <Contact />
      </div>
    </>
  );
};

export default Home;
