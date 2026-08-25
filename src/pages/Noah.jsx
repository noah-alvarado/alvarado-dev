import { pageContentClassName } from '../styles/styles.js';
import noahProfile from '../assets/noah/noah-profile.js';
import featuredPhotos from '../assets/noah/featured-photos.js';
import OptimizedImage from '../components/OptimizedImage.jsx';
import ExpandableList from '../components/ExpandableList.jsx';
import GitHubIcon from '../components/GitHubIcon.jsx';
import PhotoGrid from '../components/PhotoGrid.jsx';

const contentColClass = 'flex flex-col gap-4';

const sectionClass = `
    w-full max-w-2xl
    bg-white/80 dark:bg-gray-900/80
    border border-gray-200 dark:border-gray-700
    rounded-3xl shadow-lg
    p-6
    flex flex-col gap-4`;

const headingClass = `
    text-2xl font-bold
    text-gray-900 dark:text-gray-100
    tracking-tight`;
const subheadingClass = `
    text-lg font-semibold
    text-gray-700 dark:text-gray-300`;

const labelClass = `font-semibold text-gray-700 dark:text-gray-300`;
const valueClass = `text-gray-800 dark:text-gray-200`;

function Section({ title, className = '', children }) {
  return (
    <section className={`${sectionClass} ${className}`}>
      <h2 className={headingClass}>{title}</h2>
      {children}
    </section>
  );
}

function ProfileHeader() {
  const { name, title, location, contact } = noahProfile;

  return (
    <section className={`${sectionClass} grid! grid-cols-1! sm:grid-cols-[8rem_auto]! items-center`}>
      <div className="w-32 h-32 rounded-2xl bg-gray-200 dark:bg-gray-800 shrink-0 flex items-center justify-center text-gray-400 text-4xl select-none overflow-hidden">
        <OptimizedImage
          basePath="noah/professional-headshot"
          alt="Noah outside Roscoe Village Bikes in Chicago, wearing a purple shirt, turquoise Joshua Tree National Park tote bag, and earbuds"
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{name}</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300">{title}</p>
        <p className="text-md text-gray-500 dark:text-gray-400">{location}</p>
        <span className="flex gap-4">
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Noah's GitHub profile"
            className="underline text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
          >
            GitHub
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
          >
            LinkedIn
          </a>
        </span>
      </div>
    </section>
  );
}

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

function ProjectItem({ name, description, github, details }) {
  return (
    <div className="flex flex-col gap-2">
      <span className={labelClass}>
        {github && (
          <GitHubIcon href={github.href} label={github.label} className="mr-2" />
        )}
        {name}
      </span>
      <span className={valueClass}>{description}</span>
      <ul className="list-disc list-inside ml-4 text-gray-800 dark:text-gray-200 mt-1">
        {details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Noah() {
  return (
    <div className={pageContentClassName}>
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column */}
        <div className={contentColClass}>
          <ProfileHeader />

          <section className={`${sectionClass} p-2! gap-2! rounded-xl!`}>
            <PhotoGrid photos={featuredPhotos} />
          </section>
        </div>

        {/* Right column */}
        <div className={contentColClass}>
          <Section title="The Professional Me">
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
          </Section>

          <Section title="My Projects" className="grid grid-cols-1 gap-2">
            {noahProfile.projects.map((project) => (
              <ProjectItem key={project.name} {...project} />
            ))}
          </Section>

          <Section title="My Education">
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
          </Section>

          <Section title="My Experience">
            <ExpandableList
              className="flex flex-col gap-6"
              source={noahProfile.experience}
              cutoffIndex={4}
              transform={(exp, i) => <ExperienceItem {...exp} key={i} />}
            />
          </Section>
        </div>
      </main>
    </div>
  );
}
