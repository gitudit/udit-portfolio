/* Change this file to get your personal Portfolio */

import iiitmLogo from "./assets/images/ABVIIITM_logo.jpg";
import leenaAI from "./assets/images/leenaAI.png";
import cars24Logo from "./assets/images/cars24_logo.jpg";
import cerebryLogo from "./assets/images/cerebry_logo.jpg";
import scalerLogo from "./assets/images/scaler_logo.jpg";
import altairLogo from "./assets/images/altair_logo.jpg";
import byjusLogo from "./assets/images/logo_by.jpeg";
import playOdysseyImage from "./assets/images/playodyssey.png";
import ambulanceImage from "./assets/images/ambulance.webp";
import foodAppImage from "./assets/images/foodApp.png";
import droneAppImage from "./assets/images/droneApp.png";
import kassandraImage from "./assets/images/kassandralogo.webp";
import bourbakiImage from "./assets/images/logo512.webp";
import codeInLogo from "./assets/images/codeInLogo.webp";
import googleAssistantLogo from "./assets/images/googleAssistantLogo.webp";
import pwaLogo from "./assets/images/pwaLogo.webp";

// Summary And Greeting Section

const illustration = {
  animated: true // set to false to use static SVG
};

const greeting = {
  username: "Udit Singh",
  title: "Hey there, I'm Udit",
  subTitle:
    "A passionate Full Stack Software Developer 🚀 having an experience of designing and building Web and Mobile applications with JavaScript / Reactjs / Nodejs besides extending the application functionalities to a suite of stacks and frameworks.",
  resumeLink:
    "https://drive.google.com/file/d/1kL5-REwkZzt-0l-7uUTDWoYrV7cj0_Ui/view?usp=sharing",
  displayGreeting: true // Set false to hide this section, defaults to true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/udit1707",
  linkedin: "https://www.linkedin.com/in/udit-singh/",
  kaggle: "https://www.kaggle.com/udit1907",
  gmail: "uditsingh294@gmail.com",
  hackerrank: "https://www.hackerrank.com/pinkman1707",
  // gitlab: "https://gitlab.com/",
  // facebook: "https://www.facebook.com/",
  // medium: "https://medium.com/",
  // stackoverflow: "https://stackoverflow.com/",
  // instagram: "https://www.instagram.com/",
  // twitter: "https://twitter.com/",
  display: true // Set true to display this section, defaults to false
};

// Skills Section

const skillsSection = {
  title: "What I do",
  subTitle: "SOFTWARE DEVELOPER WHO NEVER SETTLES FOR ONE STACK",
  skills: [
    " Likes to think along the lines of clean, robust and object-oriented code, be it a project or solving a real-time problem in a coding contest.",
    " Develops highly scalable web-services and robust feature endpoints using Node.js. Make engaging user interfaces using Reactjs framework",
    " Integrating my application softwares with machine learning problem-solving and creating respective pipelines.",
    " Integration, testing and deployment on third party cloud based services such as AWS, Azure and firebase."
  ],

  /* Icon classes come from the self-hosted subsets in src/styles/icons.css.
     To add an icon: add its rule there and re-run `npm run fonts:subset` with the new codepoint. */

  softwareSkills: [
    {
      skillName: "JavaScript",
      fontAwesomeClassname: "fab fa-js"
    },
    {
      skillName: "reactjs",
      fontAwesomeClassname: "fab fa-react"
    },
    {
      skillName: "sass",
      fontAwesomeClassname: "fab fa-sass"
    },
    {
      skillName: "html",
      fontAwesomeClassname: "fab fa-html5"
    },
    {
      skillName: "nodejs",
      fontAwesomeClassname: "fab fa-node"
    },
    {
      skillName: "mongodb",
      fontAwesomeClassname: "icon-mongodb"
    },
    {
      skillName: "sql-database",
      fontAwesomeClassname: "fas fa-database"
    },
    {
      skillName: "redis",
      fontAwesomeClassname: "icon-redis"
    },
    {
      skillName: "aws",
      fontAwesomeClassname: "icon-aws"
    },
    {
      skillName: "git",
      fontAwesomeClassname: "icon-git"
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

// Education Section

const educationInfo = {
  display: true, // Set false to hide this section, defaults to true
  schools: [
    {
      schoolName: "Indian Institue of Information Technology, Gwalior",
      logo: iiitmLogo,
      subHeader: "Integrated Bachelors and Masters in Information Technology",
      duration: "July 2018 - May 2023",
      desc: "CGPA: 8.17/10.0",
      descBullets: [""]
    }
  ]
};

// Your top 3 proficient stacks/tech experience

const techStack = {
  viewSkillBars: true, //Set it to true to show Proficiency Section
  experience: [
    {
      Stack: "Frontend",
      progressPercentage: "96%"
    },
    {
      Stack: "Server Design and Architecture / Backend", //Insert stack or technology you have experience in
      progressPercentage: "90%" //Insert relative proficiency in percentage
    },
    {
      Stack: "Data Structures and Algorithm",
      progressPercentage: "90%"
    },
    {
      Stack: "Data Science",
      progressPercentage: "80%"
    }
  ],
  displayCodersrank: true
};

// Work experience section
// `bannerColor` is the dominant colour of the logo, as computed by ColorThief in the browser.
// It is stored here so the card renders in its final colour immediately (and in the pre-rendered
// HTML). Omit it for a new logo and the card will compute it at runtime instead.

const workExperiences = {
  display: true, //Set it to true to show workExperiences Section
  experience: [
     {
      role: "SDE 2",
      company: "Leena AI",
      companylogo: leenaAI,
      bannerColor: [12, 116, 236],
      date: "March 2026 - Current",
      desc: "",
      descBullets: [
        "Designed and maintained internal design system library adopted by 5+ business verticals"
      ]
    },
    {
      role: "SDE Frontend",
      company: "Cars24",
      companylogo: cars24Logo,
      bannerColor: [70, 54, 247],
      date: "Jan 2025 – March 2026",
      desc: "",
      descBullets: [
        "Designed and maintained internal design system library adopted by 5+ business verticals"
      ]
    },
    {
      role: "SDE Frontend",
      company: "Cerebry",
      companylogo: cerebryLogo,
      bannerColor: [237, 247, 250],
      date: "Oct 2023 – Jan 2025",
      desc: "",
      descBullets: [
        "Elevated system performance, fixed critical UI issues, and boosted user engagement by 15% through an accessibility feature,"
      ]
    },
    {
      role: "SDE Intern",
      company: "Scaler By InterviewBit",
      companylogo: scalerLogo,
      bannerColor: [212, 214, 217],
      date: "Jan 2023 – Sept 2023",
      desc: "",
      descBullets: [
        "Enhancing mentee retention working on the mentorship pod",
        "Optimizing scaler interview pod using modular CSS"
      ]
    },
    {
      role: "SDE Intern",
      company: "Altair",
      companylogo: altairLogo,
      bannerColor: [251, 237, 227],
      date: "May 2022 – Dec 2022",
      desc: "",
      descBullets: [
        "Migrating the entire Hypermesh local framework and enabling access on cloud",
        "Translating UI using Python GUI wrapping MS Fluent UI"
      ]
    },
    {
      role: "Software Engineer Intern",
      company: "BYJU'S",
      companylogo: byjusLogo,
      bannerColor: [113, 48, 123],
      date: "November 2021 – March 2022",
      desc: "",
      descBullets: [
        "Working with the Animation and Arts tech team.",
        "Translated design wire-frames into website elements.",
        "Curated the business logic from scratch for slide navigation."
      ]
    }
  ]
};

/* Your Open Source Section to View Your Github Pinned Projects
   Set VITE_GITHUB_TOKEN in .env and `display: true` to enable it. */

const openSource = {
  githubConvertedToken: import.meta.env.VITE_GITHUB_TOKEN,
  githubUserName: "udit1707", // Change to your github username to view your profile in Contact Section.
  showGithubProfile: "true", // Set true or false to show Contact profile using Github, defaults to true
  display: false // Set false to hide this section, defaults to true
};

// Some big projects you have worked on

const bigProjects = {
  title: "Big Projects",
  subtitle: "",
  projects: [
    {
      image: playOdysseyImage,
      projectName: "Play Odyssey",
      projectDesc:
        "A cutting-edge web-playlist manager and inhouse-video player.",
      footerLink: [
        {
          name: "Github Source",
          url: "https://github.com/udit1707/PlayOdyssey"
        }
      ]
    },
    {
      image: ambulanceImage,
      projectName: "Wheels For Wellness",
      projectDesc:
        "Emergency ambulance allocation and health-crisis management system.",
      footerLink: [
        {
          name: "Github Source",
          url: "https://github.com/udit1707/wheels-for-wellnesss"
        }
      ]
    },
    {
      image: foodAppImage,
      projectName: "Table Time",
      projectDesc: "A comprehensive Food Delivery app",
      footerLink: [
        {
          name: "Github Source",
          url: "https://github.com/udit1707/TableTime"
        }
      ]
    },
    {
      image: droneAppImage,
      projectName: "Drone Simulator @ Mapbox",
      projectDesc:
        "Paint drone motion on Google Maps based on user-provided information",
      footerLink: [
        {
          name: "Github Source",
          url: "https://github.com/udit1707/drone-simulator"
        }
      ]
    },
    {
      image: kassandraImage,
      projectName: "Kassandra",
      projectDesc:
        "Smart Retail Analytics and Employee Empowerment Solution powered by Azure Cloud Services.",
      footerLink: [
        {
          name: "Github Source",
          url: "https://github.com/udit1707/welcomeToKassandra"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: bourbakiImage,
      projectName: "Bourbaki",
      projectDesc:
        "An android application that can automatically solve mathematical problems from both handwritten text images and computer font text.",
      footerLink: [
        {
          name: "Github Source",
          url: "https://github.com/udit1707/BourBaki"
        }
      ]
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

// Achievement Section
// Include certificates, talks etc

const achievementSection = {
  title: "Achievements And Certifications 🏆 ",
  subtitle:
    "Achievements, Certifications, Award Letters and Some Cool Stuff that I have done !",

  achievementsCards: [
    {
      title: "Google Code-In Finalist",
      subtitle:
        "First Pakistani to be selected as Google Code-in Finalist from 4000 students from 77 different countries.",
      image: codeInLogo,
      footerLink: [
        {
          name: "Certification",
          url: ""
        },
        {
          name: "Award Letter",
          url: ""
        },
        {
          name: "Google Code-in Blog",
          url: ""
        }
      ]
    },
    {
      title: "Google Assistant Action",
      subtitle:
        "Developed a Google Assistant Action JavaScript Guru that is available on 2 Billion devices world wide.",
      image: googleAssistantLogo,
      footerLink: [
        {
          name: "View Google Assistant Action",
          url: ""
        }
      ]
    },
    {
      title: "PWA Web App Developer",
      subtitle: "Completed Certifcation from SMIT for PWA Web App Development",
      image: pwaLogo,
      footerLink: [
        { name: "Certification", url: "" },
        {
          name: "Final Project",
          url: ""
        }
      ]
    }
  ],
  display: false // Set false to hide this section, defaults to true
};

// Blogs Section

const blogSection = {
  title: "Blogs",
  subtitle:
    "With Love for Developing cool stuff, I love to write and teach others what I have learnt.",

  blogs: [
    {
      url: "https://blog.usejournal.com/create-a-google-assistant-action-and-win-a-google-t-shirt-and-cloud-credits-4a8d86d76eae",
      title: "Win a Google Assistant Tshirt and $200 in Google Cloud Credits",
      description:
        "Do you want to win $200 and Google Assistant Tshirt by creating a Google Assistant Action in less then 30 min?"
    },
    {
      url: "https://medium.com/@saadpasta/why-react-is-the-best-5a97563f423e",
      title: "Why REACT is The Best?",
      description:
        "React is a JavaScript library for building User Interface. It is maintained by Facebook and a community of individual developers and companies."
    }
  ],
  display: false // Set false to hide this section, defaults to true
};

// Talks Sections

const talkSection = {
  title: "TALKS",
  subtitle: "",

  talks: [
    {
      title: "",
      subtitle: "",
      slides_url: "",
      event_url: ""
    }
  ],
  display: false // Set false to hide this section, defaults to true
};

// Podcast Section

const podcastSection = {
  title: "Podcast 🎙️",
  subtitle: "I LOVE TO TALK ABOUT MYSELF AND TECHNOLOGY",

  // Please Provide with Your Podcast embeded Link
  podcast: [""],
  display: false // Set false to hide this section, defaults to true
};

const contactInfo = {
  title: "Contact Me ☎️",
  subtitle:
    "Discuss a project or just want to say hi? My Inbox is open for all.",
  number: "",
  email_address: "uditsingh294@gmail.com"
};

// Twitter Section (component removed; kept for the UI revamp)

const twitterDetails = {
  userName: "",
  display: false // Set true to display this section, defaults to false
};

export {
  illustration,
  greeting,
  socialMediaLinks,
  skillsSection,
  educationInfo,
  techStack,
  workExperiences,
  openSource,
  bigProjects,
  achievementSection,
  blogSection,
  talkSection,
  podcastSection,
  contactInfo,
  twitterDetails
};
