// All content for The Ride. Edit here; components read from it.
import playodyssey from "../assets/images/projects/playodyssey.webp";
import wheels from "../assets/images/projects/wheels.webp";
import tabletime from "../assets/images/projects/tabletime.webp";
import drone from "../assets/images/projects/drone.webp";
import kassandra from "../assets/images/projects/kassandra.webp";
import bourbaki from "../assets/images/projects/bourbaki.webp";

export type StationId = "gwalior" | "byjus" | "altair" | "scaler" | "cerebry" | "cars24" | "leena";
export type LandId = "campus" | "training" | "thrill" | "midway";
export type StationKind = "campus" | "intern" | "fulltime";
export type AttractionName = "TrophyShelf" | "SlideDeck" | "CacheSwitch" | "LatencyGauge" | "CaptionStrip" | "BundleScene" | "PlatformPanel";
export type CaseStudyId = "onboarding-engine" | "cars24-design-system" | "security-hardening";
export type AchievementId = "boarded" | "fastpass" | "all-stops" | "night-rider" | "map" | "terminal" | "calm" | "midway" | "gift-shop" | "konami";
export type SocialId = "github" | "linkedin" | "kaggle" | "hackerrank";
export type Thrill = 1 | 2 | 3 | 4 | 5;

export interface Social {
  id: SocialId;
  label: string;
  handle: string;
  url: string;
}

export interface Person {
  name: string;
  role: string;
  tagline: string;
  boarding: string;
  location: string;
  email: string;
  resume: string;
  source: string;
  socials: readonly Social[];
}

export interface Fact {
  n: string;
  t: string;
}

export interface Land {
  id: LandId;
  numeral: string;
  name: string;
  years: string;
  tagline: string;
  /** The "height requirement" sign at the gate. */
  height: string;
  stations: readonly StationId[];
}

export interface Station {
  id: StationId;
  land: LandId;
  kind: StationKind;
  stop: number;
  year: string;
  years: string;
  label: string;
  name: string;
  title: string;
  role: string;
  org: string;
  place: string;
  story: string;
  facts: readonly Fact[];
  /** Ride-type sign on the card, e.g. "Junior coaster". */
  ride: string;
  thrill: Thrill;
  attraction: AttractionName;
  caseStudy?: CaseStudyId;
  sign: string;
}

export interface CaseStudy {
  title: string;
  org: string;
  challenge: string;
  role: string;
  decisions: readonly string[];
  outcome: readonly string[];
  lesson: string;
}

export interface Achievement {
  id: AchievementId;
  title: string;
  desc: string;
}

export type SkillGroup = "Frontend" | "Backend" | "Data" | "Cloud" | "Tools";
export type SkillIconId =
  | "typescript"
  | "javascript"
  | "react"
  | "nodedotjs"
  | "sass"
  | "html5"
  | "css"
  | "mongodb"
  | "postgresql"
  | "redis"
  | "amazonwebservices"
  | "firebase"
  | "python"
  | "rubyonrails"
  | "git"
  | "vite"
  | "zoom";

export interface Skill {
  id: string;
  name: string;
  group: SkillGroup;
  icon?: SkillIconId;
}

export interface Project {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  repo: string;
  image: string;
}

export const person: Person = {
  name: "Udit Singh",
  role: "Frontend engineer",
  tagline: "Frontend engineer who makes interfaces feel fast.",
  boarding: "Now boarding: four lands, seven stops, five years of shipping.",
  location: "Gurugram, India",
  email: "uditsingh294@gmail.com",
  resume: "https://drive.google.com/file/d/1kL5-REwkZzt-0l-7uUTDWoYrV7cj0_Ui/view?usp=sharing",
  source: "https://github.com/gitudit/udit-portfolio",
  socials: [
    { id: "github", label: "GitHub", handle: "udit1707", url: "https://github.com/udit1707" },
    { id: "linkedin", label: "LinkedIn", handle: "udit-singh", url: "https://www.linkedin.com/in/udit-singh/" },
    { id: "kaggle", label: "Kaggle", handle: "udit1907", url: "https://www.kaggle.com/udit1907" },
    { id: "hackerrank", label: "HackerRank", handle: "pinkman1707", url: "https://www.hackerrank.com/pinkman1707" },
  ],
};

// The park is four lands. The ride runs through the first three; the Midway is where you get off and play.
export const lands: readonly Land[] = [
  {
    id: "campus",
    numeral: "I",
    name: "Campus Grounds",
    years: "2018 – 2023",
    tagline: "Where the building habit started: a robot that won, a hackathon that won, a patent that stuck.",
    height: "Curiosity",
    stations: ["gwalior"],
  },
  {
    id: "training",
    numeral: "II",
    name: "Training Track",
    years: "2021 – 2023 · internships",
    tagline: "Three junior coasters with real riders. Learning to ship with other people's code on the line.",
    height: "A student ID",
    stations: ["byjus", "altair", "scaler"],
  },
  {
    id: "thrill",
    numeral: "III",
    name: "Thrill Zone",
    years: "2023 – now · full-time",
    tagline: "Hypercoasters. Millions of riders. The ride gets faster from here and never trades speed for polish.",
    height: "A full-time badge",
    stations: ["cerebry", "cars24", "leena"],
  },
  {
    id: "midway",
    numeral: "IV",
    name: "The Midway",
    years: "always open",
    tagline: "Step right up: the toolkit I ride with, and the side attractions built for fun.",
    height: "None",
    stations: [],
  },
];

// Stations in ride order (oldest first). `attraction` names the lazy vignette component.
export const stations: readonly Station[] = [
  {
    id: "gwalior",
    land: "campus",
    kind: "campus",
    stop: 0,
    year: "2018",
    years: "2018 – 2023",
    label: "Origin",
    name: "IIIT Gwalior",
    title: "The lab years",
    role: "B.Tech + M.Tech, Information Technology",
    org: "ABV-IIITM Gwalior",
    place: "Gwalior",
    story:
      "Five years of building things for the fun of it: a line-follower robot that won, a hackathon that won, a global hackathon that nearly won, and a patent that grew out of an ambulance-routing idea.",
    facts: [
      { n: "2nd", t: "global, PyTorch Annual Hackathon 2021" },
      { n: "306", t: "global rank, CodeChef Long Challenge" },
      { n: "1", t: "patent: aiding during medical emergency" },
    ],
    ride: "Dark ride · five years long",
    thrill: 2,
    attraction: "TrophyShelf",
    sign: "Height requirement: curiosity.",
  },
  {
    id: "byjus",
    land: "training",
    kind: "intern",
    stop: 1,
    year: "2021",
    years: "Nov 2021 – Mar 2022",
    label: "Stop 1",
    name: "BYJU'S",
    title: "First build",
    role: "Software Engineer Intern",
    org: "BYJU'S, Bengaluru",
    place: "Bengaluru",
    story:
      "Rewrote the slide-navigation logic from scratch and removed the reveal.js dependency. The first time something I wrote replaced a library everyone depended on.",
    facts: [
      { n: "40%", t: "less overhead after dropping reveal.js" },
      { n: "30%", t: "faster development with shared components" },
    ],
    ride: "Junior coaster",
    thrill: 2,
    attraction: "SlideDeck",
    sign: "Please keep arrows inside the deck.",
  },
  {
    id: "altair",
    land: "training",
    kind: "intern",
    stop: 2,
    year: "2022",
    years: "May – Dec 2022",
    label: "Stop 2",
    name: "Altair",
    title: "Heavy machinery",
    role: "Software Development Engineer Intern",
    org: "Altair, Bengaluru",
    place: "Bengaluru",
    story:
      "Took Hypermesh, a desktop simulation giant, toward the cloud. Rebuilt state handling and caching in Altair One so the interface stopped waiting on data.",
    facts: [
      { n: "50%", t: "faster data retrieval with caching" },
      { n: "25%", t: "improvement in key performance metrics" },
    ],
    ride: "Spinning coaster",
    thrill: 3,
    attraction: "CacheSwitch",
    sign: "Flip the switch. Watch the waterfall.",
  },
  {
    id: "scaler",
    land: "training",
    kind: "intern",
    stop: 3,
    year: "2023",
    years: "Jan – Jul 2023",
    label: "Stop 3",
    name: "Scaler",
    title: "The backend detour",
    role: "Software Development Engineer Intern",
    org: "Scaler, Bengaluru",
    place: "Bengaluru",
    story:
      "Rails services for mentee events, React and SASS for the Viva experience. The stop that explains why I read a network panel like someone who has written the other side.",
    facts: [
      { n: "40%", t: "lower API response time" },
      { n: "500", t: "new viva bookings in a week" },
    ],
    ride: "Wild mouse",
    thrill: 3,
    attraction: "LatencyGauge",
    sign: "Latency drops as you approach.",
  },
  {
    id: "cerebry",
    land: "thrill",
    kind: "fulltime",
    stop: 4,
    year: "2024",
    years: "Oct 2023 – Jan 2025",
    label: "Stop 4",
    name: "Cerebry",
    title: "The overseas express",
    role: "SDE Frontend",
    org: "Cerebry, Singapore",
    place: "Singapore",
    story:
      "A reporting dashboard built from zero for two million learners, and Zoom SDK captions re-broadcast in regional languages so students could read their teacher in their own script.",
    facts: [
      { n: "2M", t: "users on the reporting dashboard" },
      { n: "+30%", t: "engagement, +18% session retention" },
    ],
    ride: "Launch coaster · 0 to 2M riders",
    thrill: 4,
    attraction: "CaptionStrip",
    sign: "Tap the captions to change language.",
  },
  {
    id: "cars24",
    land: "thrill",
    kind: "fulltime",
    stop: 5,
    year: "2025",
    years: "Jan 2025 – Mar 2026",
    label: "Stop 5",
    name: "Cars24",
    title: "The performance era",
    role: "Software Engineer",
    org: "CARS24, Gurugram",
    place: "Gurugram",
    story:
      "Twenty-plus design-system components used by every internal tool, a 2.1 MB cut from the main bundle, a Hub Appointment System for fifty thousand customers a month, and a video workflow that made inspectors 60% faster.",
    facts: [
      { n: "−2.1MB", t: "main JavaScript payload" },
      { n: "20+", t: "design-system components, 1,000+ daily users" },
      { n: "50K", t: "monthly customers on Hub Appointments" },
    ],
    ride: "Hypercoaster · the big drop",
    thrill: 5,
    attraction: "BundleScene",
    caseStudy: "cars24-design-system",
    sign: "Scroll slowly. The bundle shrinks.",
  },
  {
    id: "leena",
    land: "thrill",
    kind: "fulltime",
    stop: 6,
    year: "2026",
    years: "Mar 2026 – now",
    label: "Stop 6 · You are here",
    name: "Leena AI",
    title: "The platform era",
    role: "SDE 2",
    org: "Leena AI, Gurugram",
    place: "Gurugram",
    story:
      "Architected the Onboarding and Offboarding frontend used by every enterprise tenant, a reusable permissions layer for five hundred HR admins, security hardening across employee webviews, and a strict TypeScript baseline across four modules.",
    facts: [
      { n: "10K+", t: "employees onboarded per month" },
      { n: "95+", t: "accessibility score for 1M+ employees" },
      { n: "−80%", t: "UI defect volume" },
    ],
    ride: "Giga coaster · now boarding",
    thrill: 5,
    attraction: "PlatformPanel",
    caseStudy: "onboarding-engine",
    sign: "Terminus ahead. Mind the gap.",
  },
];

export const stationIds: readonly StationId[] = stations.map((s) => s.id);

export const kindLabel: Record<StationKind, string> = { campus: "Campus", intern: "Intern", fulltime: "Full-time" };
export const passLabel: Record<StationKind, string> = { campus: "Guest pass", intern: "Intern pass", fulltime: "All-access" };

// The Midway: what I ride with. Only tools that appear in shipped work.
export const skills: readonly Skill[] = [
  { id: "ts", name: "TypeScript", group: "Frontend", icon: "typescript" },
  { id: "js", name: "JavaScript", group: "Frontend", icon: "javascript" },
  { id: "react", name: "React", group: "Frontend", icon: "react" },
  { id: "html", name: "HTML5", group: "Frontend", icon: "html5" },
  { id: "css", name: "CSS", group: "Frontend", icon: "css" },
  { id: "sass", name: "Sass", group: "Frontend", icon: "sass" },
  { id: "aria", name: "React Aria", group: "Frontend" },
  { id: "zoom", name: "Zoom SDK", group: "Frontend", icon: "zoom" },
  { id: "node", name: "Node.js", group: "Backend", icon: "nodedotjs" },
  { id: "rails", name: "Ruby on Rails", group: "Backend", icon: "rubyonrails" },
  { id: "python", name: "Python", group: "Backend", icon: "python" },
  { id: "mongo", name: "MongoDB", group: "Data", icon: "mongodb" },
  { id: "sql", name: "PostgreSQL · SQL", group: "Data", icon: "postgresql" },
  { id: "redis", name: "Redis", group: "Data", icon: "redis" },
  { id: "aws", name: "AWS", group: "Cloud", icon: "amazonwebservices" },
  { id: "firebase", name: "Firebase", group: "Cloud", icon: "firebase" },
  { id: "azure", name: "Azure", group: "Cloud" },
  { id: "git", name: "Git", group: "Tools", icon: "git" },
  { id: "vite", name: "Vite", group: "Tools", icon: "vite" },
];

export const specialities: readonly string[] = [
  "Design systems",
  "Web performance",
  "Accessibility to AA",
  "Security hardening",
  "Reporting dashboards",
  "Virtualised UIs",
  "Live captions & i18n",
  "Scroll and motion craft",
];

// Side attractions: personal, open-source projects.
export const projects: readonly Project[] = [
  { id: "playodyssey", name: "Play Odyssey", tag: "Media", blurb: "A web playlist manager with an in-house video player.", repo: "https://github.com/udit1707/PlayOdyssey", image: playodyssey },
  { id: "wheels", name: "Wheels for Wellness", tag: "Civic tech", blurb: "Emergency ambulance allocation and health-crisis management. The idea behind the patent.", repo: "https://github.com/udit1707/wheels-for-wellnesss", image: wheels },
  { id: "tabletime", name: "Table Time", tag: "Full stack", blurb: "A comprehensive food-delivery app, end to end.", repo: "https://github.com/udit1707/TableTime", image: tabletime },
  { id: "drone", name: "Drone Simulator", tag: "Maps", blurb: "Paints drone motion on a map from user-provided flight data.", repo: "https://github.com/udit1707/drone-simulator", image: drone },
  { id: "kassandra", name: "Kassandra", tag: "Analytics", blurb: "Smart retail analytics and employee empowerment on Azure cloud services.", repo: "https://github.com/udit1707/welcomeToKassandra", image: kassandra },
  { id: "bourbaki", name: "Bourbaki", tag: "Android · ML", blurb: "Solves maths problems from handwritten and printed text images.", repo: "https://github.com/udit1707/BourBaki", image: bourbaki },
];

// Case studies: written only from the public profile, deliberately high level.
export const caseStudies: Record<CaseStudyId, CaseStudy> = {
  "onboarding-engine": {
    title: "An onboarding engine for every tenant",
    org: "Leena AI · 2026",
    challenge:
      "HR teams configure very different joining and leaving journeys, for ten thousand new employees a month, across every enterprise tenant. The old flow was rigid and defect-prone, and admins spent hours setting it up.",
    role: "Owned the frontend architecture: a modular settings engine with a checklist, a task journey, additional settings and a stop-reason builder, plus report dashboards and draft-state tracking for employee forms.",
    decisions: [
      "Model the journey as composable settings modules so tenants assemble flows instead of requesting features.",
      "Track draft state explicitly so half-finished forms never lose work and admins can see what is pending.",
      "Share one permission-guard pattern across workflows, templates, tool access and audience controls so access rules live in one place.",
    ],
    outcome: [
      "Adopted by 100% of enterprise tenants.",
      "UI defect volume down about 80%; admin setup time down 30–40%.",
      "Permission misconfiguration escalations down 25% across 500+ HR admins.",
    ],
    lesson: "Settings engines win when the data model is the product. The UI follows.",
  },
  "cars24-design-system": {
    title: "A design system and a 2.1 MB diet",
    org: "CARS24 · 2025",
    challenge:
      "Internal tools used by a thousand people a day had inconsistent UI and a main bundle that shipped finance workflow code to everyone, whether they used it or not.",
    role: "Built and scaled twenty-plus components, including a virtualised data grid, a drawer and modal system, and accessible inputs built on React Aria. Led the bundle optimisation strategy.",
    decisions: [
      "Refactor static configuration imports into lazy-loaded async modules so chunks load when a workflow is opened.",
      "Virtualise the data grid so ten thousand rows cost as much as twenty.",
      "Fix the embedded panel's boot and authentication race with a sessionStorage-based key handoff instead of retries.",
    ],
    outcome: [
      "Main JavaScript payload down 2.1 MB, about 20%; unnecessary finance chunks eliminated.",
      "Components adopted across 100% of internal tools; defect rates down 30%.",
      "Embedded panel load reliability up 40%+ for daily sales agents.",
    ],
    lesson: "Performance work is architecture work. The bytes you do not ship are the ones you never have to debug.",
  },
  "security-hardening": {
    title: "Hardening the employee webviews",
    org: "Leena AI · 2026",
    challenge:
      "Employee-facing webviews and admin surfaces carried penetration-test findings, a stored-XSS token-theft vector, and an authentication handoff that blocked downloads for every tenant.",
    role: "Remediated the findings, redesigned the JWT to S3 handoff, removed upload race conditions and blank-screen crashes, and raised the accessibility baseline.",
    decisions: [
      "Treat accessibility and security as one quality bar: both are about what the interface lets through.",
      "Halve PDF network calls by fixing the request lifecycle rather than adding caching on top.",
      "Enforce a strict TypeScript baseline across four modules so whole classes of regressions cannot compile.",
    ],
    outcome: [
      "Downloads restored for 100% of tenants; form-load reliability up 40%+.",
      "Accessibility score lifted to 95+ for more than a million employees.",
      "Type-related regressions down 65%.",
    ],
    lesson: "The most elegant fix for a race condition is a lifecycle you can draw on a whiteboard.",
  },
};

export const achievements: readonly Achievement[] = [
  { id: "boarded", title: "Boarded", desc: "Scrolled past the gate." },
  { id: "fastpass", title: "Fast pass", desc: "Cleared the height check. Full-time rides unlocked." },
  { id: "all-stops", title: "All stops", desc: "Rode the whole line. Ticket fully stamped." },
  { id: "night-rider", title: "Night rider", desc: "Switched the lights off." },
  { id: "map", title: "Cartographer", desc: "Opened the park map." },
  { id: "midway", title: "Midway regular", desc: "Spun the carousel." },
  { id: "terminal", title: "Found the terminal", desc: "Pressed the key nobody presses." },
  { id: "calm", title: "Calm rider", desc: "Turned the motion down." },
  { id: "gift-shop", title: "Gift shop", desc: "Exited through the gift shop." },
  { id: "konami", title: "Express pass", desc: "Up, up, down, down. You know the rest." },
];

export const achievementIds: readonly AchievementId[] = achievements.map((a) => a.id);

export function isStationId(v: unknown): v is StationId {
  return typeof v === "string" && (stationIds as readonly string[]).includes(v);
}
export function isAchievementId(v: unknown): v is AchievementId {
  return typeof v === "string" && (achievementIds as readonly string[]).includes(v);
}
export function isCaseStudyId(v: unknown): v is CaseStudyId {
  return typeof v === "string" && v in caseStudies;
}
export function landOf(id: LandId): Land {
  return lands.find((l) => l.id === id) ?? lands[0]!;
}
