import React from "react";
import "./Progress.css";
import { illustration, techStack } from "../../portfolio";
import { Fade } from "../../components/reveal/Reveal";
import engineAnimation from "../../assets/lottie/engine.json?url";
import skillIllustration from "../../assets/images/skill.svg";
import DisplayLottie from "../../components/displayLottie/DisplayLottie";

export default function StackProgress() {
  if (techStack.viewSkillBars) {
    return (
      <Fade bottom duration={1000} distance="20px">
        <div className="skills-container">
          <div className="skills-bar">
            <h1 className="skills-heading">Proficiency</h1>
            {techStack.experience.map((exp, i) => {
              const progressStyle = {
                width: exp.progressPercentage
              };
              return (
                <div key={i} className="skill">
                  <p>{exp.Stack}</p>
                  <div className="meter">
                    <span style={progressStyle}></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="skills-image">
            {illustration.animated ? (
              <DisplayLottie animationPath={engineAnimation} />
            ) : (
              <img alt="Skills" src={skillIllustration} />
            )}
          </div>
        </div>
      </Fade>
    );
  }
  return null;
}
