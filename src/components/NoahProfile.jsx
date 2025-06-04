import OptimizedImage from '../components/OptimizedImage.jsx';
import React from "react";
import noahProfile from "../assets/noah/noah-profile.js";

// Section container
const sectionClass = `
    w-full max-w-2xl
    bg-white/80 dark:bg-gray-900/80
    border border-gray-200 dark:border-gray-700
    rounded-3xl shadow-lg
    p-8 mb-8
    flex flex-col gap-4`;

// Headings
const headingClass = `
    text-2xl font-bold
    text-gray-900 dark:text-gray-100
    mb-1
    tracking-tight`;
const subheadingClass = `
    text-lg font-semibold
    text-gray-700 dark:text-gray-300
    mt-4 mb-1`;

// Labels and values
const labelClass = `font-semibold text-gray-700 dark:text-gray-300`;
const valueClass = `text-gray-800 dark:text-gray-200`;

const NoahProfile = () => (
    <main className="flex flex-col items-center w-full gap-8">
        {/* Profile Header (leave space for image) */}
        <section className={`${sectionClass} grid grid-cols-1 sm:!grid-cols-[8rem_auto] items-center gap-8`}>
            <div className="w-32 h-32 rounded-2xl bg-gray-200 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center text-gray-400 text-4xl select-none overflow-hidden">
                <OptimizedImage
                    basePath="noah/noah-1"
                    alt="Noah outside Roscoe Village Bikes in Chicago, wearing a purple shirt, turquoise Joshua Tree National Park tote bag, and earbuds"
                />
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {noahProfile.name}
                </h1>
                <p className="text-xl text-gray-700 dark:text-gray-300">
                    {noahProfile.title}
                </p>
                <p className="text-md text-gray-500 dark:text-gray-400">
                    {noahProfile.location}
                </p>
                <div className="flex gap-4 mt-2">
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
                </div>
            </div>
        </section>

        {/* Summary */}
        <section className={sectionClass}>
            <h2 className={headingClass}>About</h2>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                {noahProfile.summary}
            </p>
            <div>
                <h3 className={subheadingClass}>Top Skills</h3>
                <ul className="grid grid-cols-1 sm:!grid-cols-2 gap-x-6 list-disc list-inside text-gray-800 dark:text-gray-200">
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
                    Personal Portfolio Website (This Website!)
                    <GitHubIcon
                        href="https://github.com/noah-alvarado/alvarado-dev"
                        label="View source code for Personal Portfolio Website on GitHub"
                    />
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
                    PACIFIC
                    <GitHubIcon
                        href="https://github.com/noah-alvarado/pacific"
                        label="View source code for PACIFIC on GitHub"
                    />
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
            <div className="flex flex-col gap-2 mt-2">
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
            <div className="flex flex-col gap-6 mt-2">
                {noahProfile.experience.map((exp, idx) => (
                    <div
                        key={exp.company + exp.title + idx}
                        className="flex flex-col gap-1"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                            <span className={labelClass}>{exp.company}</span>
                            <span className="text-gray-500 dark:text-gray-400">
                                {exp.title}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {exp.dates}
                            {exp.location ? `, ${exp.location}` : ""}
                        </span>
                        {exp.details && exp.details.length > 0 && (
                            <ul className="list-disc list-inside ml-4 text-gray-800 dark:text-gray-200 mt-1">
                                {exp.details.map((d, i) => (
                                    <li key={i}>{d}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </section>
    </main>
);

// GitHubIcon component for accessible inline SVG icon and link
function GitHubIcon({ href, label }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="ml-2 align-middle inline-block text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18" height="18" viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
                className="inline align-text-bottom"
            >
                <title>GitHub</title>
                <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
            </svg>
        </a>
    );
}

export default NoahProfile;
