import React, { useContext, useState } from "react";
import "./WorkExperience.css";
import ExperienceCard from "../../components/experienceCard/ExperienceCard";
import { workExperiences } from "../../portfolio";
import { Fade } from "../../components/reveal/Reveal";
import StyleContext from "../../contexts/StyleContext";
import LeftArrow from "../../assets/images/arrow-left-circle.svg";
import RightArrow from "../../assets/images/arrow-right-circle.svg";

export default function WorkExperience() {
  const [startIndex, setStartIndex] = useState(0);

  const handleClickRight = () => {
    if (startIndex < workExperiences.experience.length - 3) {
      setStartIndex(startIndex + 1);
    }
  };

  const handleClickLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const { isDark } = useContext(StyleContext);
  const visibleItems = workExperiences.experience.slice(startIndex, startIndex + 3);

  if (workExperiences.display) {
    return (
      <div id="experience">
        <Fade bottom duration={1000} distance="20px">
          <div className="experience-container" id="workExperience">
            <div>
              <div className="skills-heading-cnt">
                <h1 className="experience-heading">Experiences</h1>
                {startIndex > 0 && (
                  <img src={LeftArrow} className="nav-arrow" alt="left" onClick={handleClickLeft} />
                )}
                {startIndex < workExperiences.experience.length - 3 && (
                  <img src={RightArrow} className="nav-arrow" alt="left" onClick={handleClickRight} />
                )}
              </div>
              <div className="experience-cards-div">
                {visibleItems.map((card, i) => {
                  return (
                    <ExperienceCard
                      key={startIndex + i}
                      isDark={isDark}
                      cardInfo={{
                        company: card.company,
                        desc: card.desc,
                        date: card.date,
                        companylogo: card.companylogo,
                        bannerColor: card.bannerColor,
                        role: card.role,
                        descBullets: card.descBullets
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </Fade>
      </div>
    );
  }
  return null;
}
