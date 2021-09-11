/* Change this file to get your personal Portfolio */

// Summary And Greeting Section

import emoji from "react-easy-emoji";

const illustration = {
  animated: true // set to false to use static SVG
};

const greeting = {
  username: "Udit Singh",
  title: "Hey there, I'm Udit",
  subTitle: emoji(
    "A passionate Full Stack Software Developer 🚀 having an experience of designing and building Web and Mobile applications with JavaScript / Reactjs / Nodejs besides extending the application functionalities to a suite of stacks and frameworks."
  ),
  resumeLink:
    "https://drive.google.com/file/d/1_3GkHMuQ-zDgqFZBVHYRzS1yMJ55wUp9/view?usp=sharing",
  displayGreeting: true // Set false to hide this section, defaults to true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/udit1707",
  linkedin: "https://www.linkedin.com/in/udit-singh/",
  kaggle:"https://www.kaggle.com/udit1907",
  gmail: "uditsingh294@gmail.com",
  hackerrank:"https://www.hackerrank.com/pinkman1707",
  // gitlab: "https://gitlab.com/",
  // facebook: "https://www.facebook.com/",
  //medium: "https://medium.com/@davidrakosi",
  //stackoverflow: "https://stackoverflow.com/users/13263979/drakosi",
  //instagram: 'https://www.instagram.com/davidrakosi/',
  //twitter: 'https://twitter.com/davidrakosi_',
  display: true // Set true to display this section, defaults to false
};

// Skills Section

const skillsSection = {
  title: "What I do",
  subTitle: "SOFTWARE DEVELOPER WHO NEVER SETTLES FOR ONE STACK",
  skills: [
    emoji(
      "⚡Likes to think along the lines of clean, robust and object-oriented code, be it a project or solving a real-time problem in a coding contest."
    ),
    emoji(
      "⚡Develops highly scalable web-services and robust feature endpoints using Node.js. Make engaging user interfaces using Reactjs framework"
    ),
    emoji("⚡Integrating my application softwares with machine learning problem-solving and creating respective pipelines."),
    emoji(
      "⚡Integration, testing and deployment on third party cloud based services such as AWS, Azure and firebase."
    )
  ],

  /* Make Sure to include correct Font Awesome Classname to view your icon
https://fontawesome.com/icons?d=gallery */

  softwareSkills: [
    {
      skillName: "JavaScript",
      fontAwesomeClassname: "fab fa-js"
    },
    {
      skillName: "python",
      fontAwesomeClassname: "fab fa-python"
    },
    {
      skillName: "cpp",
      fontAwesomeClassname: "icon-cplusplus"
    },
    {
      skillName: "reactjs",
      fontAwesomeClassname: "fab fa-react"
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
      logo: require("./assets/images/ABVIIITM_logo.jpg"),
      subHeader: "Integrated Bachelors and Masters in Information Technology",
      duration: "July 2018 - Expected May 2023",
      desc: "CGPA: 8.2/10.0",
      descBullets: [
        ""
      ]
    }
   ]
};

// Your top 3 proficient stacks/tech experience

const techStack = {
  viewSkillBars: true, //Set it to true to show Proficiency Section
  experience: [
    {
      Stack: "Server Design and Architecture / Backend", //Insert stack or technology you have experience in
      progressPercentage: "90%" //Insert relative proficiency in percentage
    },
    {
      Stack: "Frontend",
      progressPercentage: "70%"
    },
    {
      Stack: "Data Structures and Algorithm",
      progressPercentage: "80%"
    },
    {
      Stack: "Data Science",
      progressPercentage: "80%"
    }
  ],
  displayCodersrank: true // Set true to display codersrank badges section need to changes your username in src/containers/skillProgress/skillProgress.js:17:62, defaults to false
};

// Work experience section

const workExperiences = {
  display: true, //Set it to true to show workExperiences Section
  experience: [
    {
      role: "Machine Learning Intern",
      company: "Grroom",
      companylogo: require("./assets/images/grroom_logo.png"),
      date: "November 2020 – Januray 2021",
      desc:
        "",
      descBullets: [
        "Designing Deep Learning Tests and Experiments",
        "Building and training a deep learning model for AI based Fashion APP",
        "Image scraping and annotating for models"
      ]
    },
    {
      role: "Web Development Intern",
      company: "Bashank Infotech Private Limited",
      companylogo: require("./assets/images/bashank_logo.png"),
      date: "May 2020 – July 2020",
      desc:
        "I lead software developers building the UI design and integrating client side with the REST APIs for a school."
    }
  ]
};

/* Your Open Source Section to View Your Github Pinned Projects
To know how to get github key look at readme.md */

const openSource = {
  githubConvertedToken: process.env.REACT_APP_GITHUB_TOKEN,
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
      image: require("./assets/images/ambulance.png"),
      projectName: "Wheels For Wellness(Patent Applied)",
      projectDesc: "Emergency ambulance allocation and health-crisis management system.",
      footerLink: [
        {
          name: "Github Source(Coming Soon)",
          url: "#"
        }
      ]
    },
    {
      image: require("./assets/images/kassandralogo.png"),
      projectName: "Kassandra",
      projectDesc: "Smart Retail Analytics and Employee Empowerment Solution powered by Azure Cloud Services.",
      footerLink: [
        {
          name: "Github Source",
          url: "https://github.com/udit1707/welcomeToKassandra"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/logo512.png"),
      projectName: "Bourbaki",
      projectDesc: "An android application that can automatically solve mathematical problems from both handwritten text images and computer font text.",
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
  title: emoji("Achievements And Certifications 🏆 "),
  subtitle:
    "Achievements, Certifications, Award Letters and Some Cool Stuff that I have done !",

  achievementsCards: [
    {
      title: "Google Code-In Finalist",
      subtitle:
        "First Pakistani to be selected as Google Code-in Finalist from 4000 students from 77 different countries.",
      image: require("./assets/images/codeInLogo.webp"),
      footerLink: [
        {
          name: "Certification",
          url:
            ""
        },
        {
          name: "Award Letter",
          url:
            ""
        },
        {
          name: "Google Code-in Blog",
          url:
            ""
        }
      ]
    },
    {
      title: "Google Assistant Action",
      subtitle:
        "Developed a Google Assistant Action JavaScript Guru that is available on 2 Billion devices world wide.",
      image: require("./assets/images/googleAssistantLogo.webp"),
      footerLink: [
        {
          name: "View Google Assistant Action",
          url:
            ""
        }
      ]
    },

    {
      title: "PWA Web App Developer",
      subtitle: "Completed Certifcation from SMIT for PWA Web App Development",
      image: require("./assets/images/pwaLogo.webp"),
      footerLink: [
        {name: "Certification", url: ""},
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
      url:
        "https://blog.usejournal.com/create-a-google-assistant-action-and-win-a-google-t-shirt-and-cloud-credits-4a8d86d76eae",
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
  subtitle: emoji(
    ""
  ),

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
  title: emoji("Podcast 🎙️"),
  subtitle: "I LOVE TO TALK ABOUT MYSELF AND TECHNOLOGY",

  // Please Provide with Your Podcast embeded Link
  podcast: [
    ""
  ],
  display: false // Set false to hide this section, defaults to true
};

const contactInfo = {
  title: emoji("Contact Me ☎️"),
  subtitle:
    "Discuss a project or just want to say hi? My Inbox is open for all.",
  number: "(323) 768 0674",
  email_address: "contact@davidrakosi.com"
};

// Twitter Section

const twitterDetails = {
  userName: "davidrakosi_", //Replace "twitter" with your twitter username without @
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
