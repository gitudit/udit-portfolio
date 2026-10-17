import React, { useContext, useEffect } from "react";
import Headroom from "react-headroom";
import "./Header.css";
// The theme toggle is not rendered (see the commented-out <li> below), but its stylesheet carries a
// global `input { transform: scale(0.5) }` rule that the live site's look depends on.
// Keep this import until the UI/UX revamp decides what to do with it.
import "../ToggleSwitch/ToggleSwitch.css";
import StyleContext from "../../contexts/StyleContext";
import {
  greeting,
  workExperiences,
  skillsSection,
  openSource,
  blogSection,
  talkSection,
  bigProjects,
  achievementSection
} from "../../portfolio";

function Header() {
  const { isDark } = useContext(StyleContext);
  const viewExperience = workExperiences.display;
  const viewProjects = bigProjects.display;
  const viewOpenSource = openSource.display;
  const viewSkills = skillsSection.display;
  const viewAchievement = achievementSection.display;
  const viewBlog = blogSection.display;
  const viewTalks = talkSection.display;

  // Headroom measures the header once on mount to size its spacer. If the logo web font arrives
  // after that, the measurement is 12px short and the header overlaps the hero (the old site did
  // this whenever JS loaded before the font). Re-measure once fonts are ready; Headroom listens to
  // resize for exactly this purpose.
  useEffect(() => {
    if (!document.fonts || !document.fonts.ready) return undefined;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) window.dispatchEvent(new Event("resize"));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Headroom>
      <header className={isDark ? "dark-menu header" : "header"}>
        <a style={{ color: "#847070" }} href={import.meta.env.BASE_URL} className="logo">
          <span className="grey-color"> &lt;</span>
          <span className="logo-name">{greeting.username}</span>
          <span className="grey-color">/&gt;</span>
        </a>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label className="menu-icon" htmlFor="menu-btn" style={{ color: "white" }}>
          <span className={isDark ? "navicon navicon-dark" : "navicon"}></span>
        </label>
        <ul className={isDark ? "dark-menu menu" : "menu"}>
          {viewSkills && (
            <li>
              <a href="#skills">Skills</a>
            </li>
          )}
          {viewExperience && (
            <li>
              <a href="#experience">Work Experiences</a>
            </li>
          )}
          {viewProjects && (
            <li>
              <a href="#projects">Big Projects</a>
            </li>
          )}
          {viewOpenSource && (
            <li>
              <a href="#opensource">Open Source</a>
            </li>
          )}
          {viewAchievement && (
            <li>
              <a href="#achievements">Achievements</a>
            </li>
          )}
          {viewBlog && (
            <li>
              <a href="#blogs">Blogs</a>
            </li>
          )}
          {viewTalks && (
            <li>
              <a href="#talks">Talks</a>
            </li>
          )}
          <li>
            <a
              href="https://drive.google.com/file/d/1kL5-REwkZzt-0l-7uUTDWoYrV7cj0_Ui/view?usp=sharing"
              target="_blank"
              rel="noreferrer noopener"
            >
              Resume
            </a>
          </li>
          <li>
            <a href="#contact">Contact Me</a>
          </li>
          {/* <li>
            <a href="#">
              <ToggleSwitch />
            </a>
          </li> */}
        </ul>
      </header>
    </Headroom>
  );
}
export default Header;
