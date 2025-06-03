// Noah Alvarado profile data as a JS map

function formatPresentExperienceDates(start) {
  const end = new Date();
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months--;
  months = Math.max(0, months); // Prevent negative
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  let str = `${start.toLocaleString('default', { month: 'long' })} ${start.getFullYear()} - Present (`;
  if (years > 0) str += `${years} year${years > 1 ? 's' : ''}`;
  if (years > 0 && remMonths > 0) str += ' ';
  if (remMonths > 0 || years === 0) str += `${remMonths} month${remMonths !== 1 ? 's' : ''}`;
  str += ")";
  return str;
}

const noahProfile = {
  name: "Noah Alvarado",
  title: "full stack developer",
  location: "Sioux Falls, South Dakota, United States",
  contact: {
    github: "https://github.com/noah-alvarado",
    linkedin: "https://www.linkedin.com/in/noah-alvarado"
  },
  skills: [
    "JavaScript/TypeScript",
    "Go",
    "AWS",
    "Angular",
    "React",
    "Node.js",
    "PSQL",
    "Docker",
    "Kubernetes",
    "Azure",
    "GCP"
  ],
  languages: [
    { language: "Greek", proficiency: "B2" },
    { language: "English", proficiency: "Native" }
  ],
  summary: "I enjoy building practical software solutions and solving technical problems. With a proven history of tackling a wide range of challenges, I’m comfortable adapting to new situations and requirements. My favorite pastimes are bouldering, traveling, and spending time with my cat Finn.",
  education: [
    {
      school: "Northwestern University",
      degree: "Bachelor of Science - BS, Computer Science",
      dates: "2016 - 2020"
    }
  ],
  experience: [
    {
      company: "The College Board",
      title: "Software Engineer IV",
      dates: formatPresentExperienceDates(new Date(2024, 10, 1)), // November 2024
      location: "Remote",
      details: []
    },
    {
      company: "Capital One",
      title: "Software Engineer",
      dates: "December 2021 - July 2024 (2 years 8 months)",
      location: "Chicago, Illinois, United States",
      details: [
        "Back-end engineer implementing and maintaining a data aggregation pipeline.",
        "Migrating legacy Java server to a server-less architecture written in Go. Using AWS Lambda, Step Functions, Route 53, CloudWatch, ECS/EC2, and S3."
      ]
    },
    {
      company: "Epsilon",
      title: "Associate Software Engineer",
      dates: "September 2020 - November 2021 (1 year 3 months)",
      location: "Chicago, Illinois, United States",
      details: [
        "Primarily front-end web developer in an Agile team of ~10 engineers.",
        "Contributed to a project used by hundreds of internal agents that contributed $100M+ to the bottom line.",
        "Used Angular and Node.js + Express to deliver recognizable value."
      ]
    },
    {
      company: "Unfound",
      title: "Tech Team",
      dates: "April 2020 - March 2021 (1 year)",
      location: "Chicago, Illinois, United States",
      details: [
        "Leadership of the cross-platform mobile app Unfound (formerly Nooks).",
        "Implemented scalable-by-design architecture, maintained a secure cloud ecosystem, and deployed an app to multiple marketplaces.",
        "Technologies: React Native, React.js, Node.js + Express, TypeScript, PostgreSQL, Docker, NGINX, AWS (EC2, S3, CloudFront)."
      ]
    },
    {
      company: "Conversant",
      title: "UI/UX Intern",
      dates: "June 2019 - August 2019 (3 months)",
      location: "Chicago, Illinois",
      details: [
        "Full stack web-development of a client-facing portal using modern frontend frameworks, RESTful APIs, and Agile methodologies.",
        "Contributions to, and bug fixes for, the Conversant UI component library."
      ]
    },
    {
      company: "Purple Gator",
      title: "Software Engineering Intern",
      dates: "September 2018 - June 2019 (10 months)",
      location: "Chicago, IL",
      details: [
        "Full stack web-development using AngularJS, Node.js, Express, and MongoDB.",
        "Projects: Automatic billing (Braintree) integration, interstitial marketing, Twilio, AWS S3 Buckets, Cloudfront CDN, responsive mobile UI, cache web-hosted files using IndexedDB, CSS animations."
      ]
    },
    {
      company: "Engineers Without Borders – Northwestern Student Chapter",
      title: "Programming Lead",
      dates: "March 2018 - March 2019 (1 year 1 month)",
      location: "Evanston, IL",
      details: [
        "Lead a team of 3 in editing and publication of the quarterly newsletter and publicizing events.",
        "Directed a team of 5 in planning and executing fundraising events, recruitment, public education, and coordinating joint events with similar campus groups."
      ]
    },
    {
      company: "Habitat for Humanity - Northwestern University Chapter",
      title: "Builds Coordinator",
      dates: "February 2018 - February 2019 (1 year 1 month)",
      location: "Evanston, IL",
      details: [
        "Coordinated transportation for 8 volunteers, donations, and appointments for 3-5 builds per quarter.",
        "Communicated directly with representatives of the national body of Habitat for Humanity."
      ]
    },
    {
      company: "Armedia",
      title: "Digitization Team Member",
      dates: "June 2018 - August 2018 (3 months)",
      location: "Vienna, VA",
      details: [
        "Scanned, documented, and organized over 10,000 pages of legal documents per day, including fragile material such as photos, cassettes, and transcripts.",
        "Analyzed physical content to ensure proper storage and legibility of digitized product."
      ]
    },
    {
      company: "US Navy Hospital",
      title: "IT Intern",
      dates: "September 2015 - June 2016 (10 months)",
      location: "Tutuhan, Guam",
      details: [
        "Customer service agent for over 500 clients, assessing problems and devising solutions or deferring to specialists.",
        "Performed routine repairs on network infrastructure and workstations.",
        "Upgraded 30 workstations to dual monitor capability and installed hardware.",
        "Led effort to improve data destruction procedures to exceed HIPAA and US Navy compliance standards."
      ]
    }
  ],
};

export default noahProfile;
