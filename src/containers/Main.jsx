import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import Skills from "./skills/Skills";
import StackProgress from "./skillProgress/skillProgress";
import WorkExperience from "./workExperience/WorkExperience";
import Projects from "./projects/Projects";
import StartupProject from "./StartupProjects/StartupProject";
import Achievement from "./achievement/Achievement";
import Blogs from "./blogs/Blogs";
import Footer from "../components/footer/Footer";
import Talks from "./talks/Talks";
import Podcast from "./podcast/Podcast";
import Education from "./education/Education";
import Top from "./topbutton/Top";
import Profile from "./profile/Profile";
import { StyleProvider } from "../contexts/StyleContext";
import "./Main.css";

export default function Main() {
  // The theme is resolved after mount (exactly as before) so the pre-rendered HTML and the
  // first client render always match; the stored preference then applies.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let stored = localStorage.getItem("isDark");
    if (stored === null) {
      stored = String(window.matchMedia("(prefers-color-scheme: dark)").matches);
      localStorage.setItem("isDark", stored);
    }
    setIsDark(JSON.parse(stored));
  }, []);

  const changeTheme = () => {
    const next = !isDark;
    localStorage.setItem("isDark", String(next));
    setIsDark(next);
  };

  return (
    <div className={isDark ? "dark-mode" : null}>
      <StyleProvider value={{ isDark, changeTheme }}>
        <Header />
        <Greeting />
        <Skills />
        <StackProgress />
        <Education />
        <WorkExperience />
        <Projects />
        <StartupProject />
        <Achievement />
        <Blogs />
        <Talks />
        {/* The original source had a stray `//<Twitter />` here, which React rendered as a literal
            "//" text node just above the Contact section. It is kept on purpose for pixel parity.
            Delete the next line during the UI/UX revamp. */}
        {"//"}
        <Podcast />
        <Profile />
        <Footer />
        <Top />
      </StyleProvider>
    </div>
  );
}
