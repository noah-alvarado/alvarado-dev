import React from 'react';
import { pageContentClassName } from '../styles/styles.js';
import noahProfile from "../assets/noah/noah-profile.js";
import OptimizedImage from '../components/OptimizedImage.jsx';
import GitHubIcon from '../components/GitHubIcon.jsx';
import PhotoGrid from '../components/PhotoGrid.jsx';
import Cupboard from '../components/Cupboard.jsx';

// Main content columns
const contentColClass = `flex flex-col gap-4`;

// Section container
const sectionClass = `
    w-full max-w-2xl
    bg-white/80 dark:bg-gray-900/80
    border border-gray-200 dark:border-gray-700
    rounded-3xl shadow-lg
    p-6
    flex flex-col gap-4`;

// Headings
const headingClass = `
    text-2xl font-bold
    text-gray-900 dark:text-gray-100
    tracking-tight`;
const subheadingClass = `
    text-lg font-semibold
    text-gray-700 dark:text-gray-300`;

// Labels and values
const labelClass = `font-semibold text-gray-700 dark:text-gray-300`;
const valueClass = `text-gray-800 dark:text-gray-200`;

const featuredPhotos = [
  {
    src: 'noah/sioux-falls-seated-zoom',
    alt: 'Noah sitting on rocks at Sioux Falls in South Dakota, with waterfalls cascading in the background',
    span: { x: 2, y: 1 },
  },
  {
    src: 'noah/chi-selfie',
    alt: 'Noah taking a selfie in Chicago with Sears Tower in the background',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/nu-game',
    alt: 'Noah at a Northwestern University sporting event, showing school spirit',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/biker',
    alt: 'Noah with his bicycle on a cycling adventure, wearing helmet and cycling gear',
    span: { x: 1, y: 2 },
  },
  {
    src: 'noah/seated-professional-square',
    alt: 'Professional portrait of Noah seated, wearing business casual attire',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/norby-finn',
    alt: 'Noah with his cat Finn',
    span: { x: 1, y: 2 },
  },
  {
    src: 'noah/aegina',
    alt: 'Noah visiting the Greek island of Aegina with his girlfriend',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/bosphorus-wide',
    alt: 'Wide panoramic view of Noah at the Bosphorus strait in Istanbul, Turkey',
    span: { x: 2, y: 1 },
  },
  {
    src: 'noah/biking-headshot',
    alt: 'Close-up portrait of Noah wearing cycling helmet and gear, ready for a bike ride',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/green-river',
    alt: 'Noah at the Chicago river while it\'s dyed green to celebrate St. Patrick\'s Day',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/walking',
    alt: 'Noah walking on a trail, exploring the outdoors',
    span: { x: 1, y: 2 },
  },
  {
    src: 'noah/pink-house-crew',
    alt: 'Noah with friends',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/peace-o-pizza',
    alt: 'Noah holding a slice of pizza between two fingers in a peace sign gesture',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/atvs',
    alt: 'Noah on an ATV adventure, exploring off-road terrain',
    span: { x: 2, y: 1 },
  },
  {
    src: 'noah/carlsbad-hike',
    alt: 'Noah hiking in Carlsbad, California, enjoying the desert landscape and trails',
    span: { x: 1, y: 2 },
  },
  {
    src: 'noah/uk-with-abram',
    alt: 'Noah with his sibling Abram during a trip to the United Kingdom',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/lakeshore',
    alt: 'Noah standing by the beautiful Chicago lakeshore with his friends',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/ba-observatory',
    alt: 'Noah visiting an observatory in Buenos Aires, Argentina',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/bariloche-hike',
    alt: 'Noah hiking in Bariloche, Argentina, with Patagonian mountains and landscapes',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/esther-the-goat',
    alt: 'Noah meeting Esther the goat, having a fun encounter with farm animals',
    span: { x: 1, y: 1 },
  },
  {
    src: 'noah/lambda',
    alt: 'Noah at the Lambda Project in Athens, Greece',
    span: { x: 2, y: 1 },
  },
  {
    src: 'noah/waterfall',
    alt: 'Noah standing in front of a waterfall on a trail in North Carolina',
    span: { x: 1, y: 1 },
  },
];

function ExperienceItem({ company, title, dates, location, details }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
        <span className={labelClass}>{company}</span>
        <span className="text-gray-500 dark:text-gray-400">
          {title}
        </span>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {dates}
        {location ? `, ${location}` : ""}
      </span>
      {details && details.length > 0 && (
        <ul className="list-disc list-inside ml-4 text-gray-800 dark:text-gray-200 mt-1">
          {details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Noah() {
  return (
    <div className={pageContentClassName}>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className={contentColClass}>
          {/* Profile Header */}
          <section className={`${sectionClass} !grid !grid-cols-1 sm:!grid-cols-[8rem_auto] items-center`}>
            <div className="w-32 h-32 rounded-2xl bg-gray-200 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center text-gray-400 text-4xl select-none overflow-hidden">
              <OptimizedImage
                basePath="noah/professional-headshot"
                alt="Noah outside Roscoe Village Bikes in Chicago, wearing a purple shirt, turquoise Joshua Tree National Park tote bag, and earbuds"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {noahProfile.name}
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                {noahProfile.title}
              </p>
              <p className="text-md text-gray-500 dark:text-gray-400">
                {noahProfile.location}
              </p>
              <p className="flex flex-wrap gap-x-4 gap-y-1">
                <a
                  href="mailto:contact.noah@alvarado.dev"
                  aria-label="Email Noah"
                  className="underline text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                >
                  contact.noah@alvarado.dev
                </a>
                <span className='flex gap-4'>
                  <a
                    href={noahProfile.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Noah's GitHub profile"
                    className="underline text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    GitHub
                  </a>
                  <a
                    href={noahProfile.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    LinkedIn
                  </a>
                </span>
              </p>
            </div>
          </section>

          {/* Photo Feature */}
          <section className={`${sectionClass} !p-2 !gap-2 !rounded-xl`}>
            <PhotoGrid photos={featuredPhotos} />
          </section>
        </div>

        {/* Right Column */}
        <div className={contentColClass}>
          {/* Summary */}
          <section className={sectionClass}>
            <h2 className={headingClass}>About</h2>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              {noahProfile.summary}
            </p>
            <div>
              <h3 className={subheadingClass}>Top Skills</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 list-disc list-inside text-gray-800 dark:text-gray-200">
                {noahProfile.skills.map((skill) => (
                  <li className="w-fit" key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={subheadingClass}>Languages</h3>
              <ul className="list-disc list-inside text-gray-800 dark:text-gray-200">
                {noahProfile.languages.map((lang) => (
                  <li key={lang.language}>
                    {lang.language}{" "}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({lang.proficiency})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Projects */}
          <section className={`${sectionClass} grid grid-cols-1 gap-2`}>
            <div className="col-span-full">
              <h2 className={headingClass}>Projects</h2>
            </div>

            {/* Project 1 */}
            <div className="flex flex-col gap-2">
              <span className={labelClass}>
                <GitHubIcon
                  href="https://github.com/noah-alvarado/alvarado-dev"
                  label="Source code for this website on GitHub"
                  className="mr-2"
                />
                Personal Portfolio Website (This Website!)
              </span>
              <span className={valueClass}>Modern, responsive portfolio built with React and Tailwind CSS</span>
              <ul className="list-disc list-inside ml-4 text-gray-800 dark:text-gray-200 mt-1">
                <li>Designed and developed a performant, accessible personal website</li>
                <li>React, Vite, Tailwind CSS, optimized images, responsive, dark mode support</li>
              </ul>
            </div>

            {/* Project 2 */}
            <div className="flex flex-col gap-2">
              <span className={labelClass}>
                <GitHubIcon
                  href="https://github.com/noah-alvarado/pacific"
                  label="Source code for PACIFIC on GitHub"
                  className="mr-2"
                />
                PACIFIC
              </span>
              <span className={valueClass}>Two-player WWII board game by Sir Ian Hamilton Finlay</span>
              <ul className="list-disc list-inside ml-4 text-gray-800 dark:text-gray-200 mt-1">
                <li>Research, playtesting, and digital adaptation of a artist's board game</li>
                <li>Interactive layer built in SolidJS + TypeScript</li>
                <li>P2P game sessions via direct WebRTC play or a Go-based centralized service</li>
              </ul>
            </div>

            {/* Project 3 */}
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Data Aggregation Pipeline (Capital One)</span>
              <span className={valueClass}>Serverless data pipeline migration and modernization</span>
              <ul className="list-disc list-inside ml-4 text-gray-800 dark:text-gray-200 mt-1">
                <li>Back-end engineer for a high-throughput data pipeline</li>
                <li>Go, AWS Lambda, Step Functions, S3, ECS, CloudWatch</li>
              </ul>
            </div>

            {/* Project 4 */}
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Unfound (formerly Nooks)</span>
              <span className={valueClass}>Cross-platform mobile app for finding and booking study spaces</span>
              <ul className="list-disc list-inside ml-4 text-gray-800 dark:text-gray-200 mt-1">
                <li>Leadership of the tech team, deployed to multiple marketplaces</li>
                <li>React Native, Node.js, TypeScript, PostgreSQL, AWS, Docker</li>
              </ul>
            </div>
          </section>

          {/* Education */}
          <section className={sectionClass}>
            <h2 className={headingClass}>Education</h2>
            <div className="flex flex-col gap-2">
              {noahProfile.education.map((edu, idx) => (
                <div key={edu.school + idx} className="flex flex-col gap-1">
                  <span className={labelClass}>{edu.school}</span>
                  <span className={valueClass}>{edu.degree}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {edu.dates}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className={sectionClass}>
            <h2 className={headingClass}>Experience</h2>
            <Cupboard className="flex flex-col gap-6"
              source={noahProfile.experience}
              cutoffIndex={4}
              transform={(exp, i) => <ExperienceItem {...exp} key={i} />}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
