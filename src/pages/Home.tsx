import { Component } from 'solid-js';
import Contact from '../components/Contact';
import Intro from '../components/Intro';

const Home: Component = () => {
  return (
    <>
      <div class="relative">
        <div class="border-b-2 border-orange-400 min-h-[48.35vw] xl:min-h-0 xl:h-[48.35vw] xl:max-h-[60.0vh] overflow-hidden">
          <img class="object-fill object-center" src="assets/wndr-museum.jpg" alt="Noah Alvarado at the WNDR Museum in Chicago, IL" />
        </div>
        <div class="mx-auto justify-between items-center min-h-[48.35vw] xl:min-h-0 xl:max-h-[60.0vh]
                    xl:absolute xl:top-0 xl:inset-x-0 xl:container xl:flex xl:flex-row-reverse xl:px-12 xl:py-4">

          <div class="bg-stone-800 prose text-stone-300 text-center px-6 py-2 rounded-md h-fit w-fit border-2 border-turquoise-400
                      absolute xl:static
                      top-4 right-4 md:top-12 md:right-12 lg:top-20 lg:right-20 xl:mr-16">
            <div class="leading-4 font-semibold text-sm md:text-lg lg:text-2xl xl:text-4xl">Noah Alvarado</div>
            <div class="leading-4 italic text-xs md:text-sm lg:text-md xl:text-lg">Software Engineer</div>
          </div>

          <div class="relative inset-x-0 -top-4 md:-top-20 lg:-top-32 xl:top-auto">
            <div class="bg-stone-800 border-2 border-turquoise-400 mx-auto px-5 py-3 rounded-md
                        prose prose-stone dark:prose-invert">
              <Intro />
            </div>
          </div>

        </div>
      </div>

      <div class="container relative max-w-prose my-10 xl:mt-20 mx-auto px-5 py-3 pt-6 rounded-md border-2 border-orange-400
                  prose prose-stone dark:prose-invert">
        <label class="absolute -top-5 left-8 bg-base px-7 py-0.5 rounded-md border-2 border-orange-400 text-lg">Talk to me</label>
        <Contact />
      </div>
    </>
  );
};

export default Home;
