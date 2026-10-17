import React, { useEffect, useRef, useState } from "react";
import "./ExperienceCard.css";

export default function ExperienceCard({ cardInfo, isDark }) {
  const imgRef = useRef(null);
  const [computedColor, setComputedColor] = useState(null);

  // The banner colour normally comes pre-computed from portfolio.js (`bannerColor`), so the card
  // renders in its final colour straight away. If it is missing we compute it in the browser with
  // ColorThief, loaded on demand, exactly as the original implementation did.
  const needsRuntimeColor = !cardInfo.bannerColor;

  async function computeColor() {
    try {
      const { default: ColorThief } = await import("colorthief");
      const img = imgRef.current;
      if (img && img.naturalWidth) setComputedColor(new ColorThief().getColor(img));
    } catch (e) {
      /* leave the CSS gradient in place */
    }
  }

  useEffect(() => {
    const img = imgRef.current;
    if (needsRuntimeColor && img && img.complete && img.naturalWidth) computeColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = cardInfo.bannerColor || computedColor;
  const background = color ? "rgb(" + color.join(", ") + ")" : null;

  const GetDescBullets = ({ descBullets, isDark }) => {
    return descBullets
      ? descBullets.map((item, i) => (
          <li key={i} className={isDark ? "subTitle dark-mode-text" : "subTitle"}>
            {item}
          </li>
        ))
      : null;
  };

  return (
    <div className={isDark ? "experience-card-dark" : "experience-card"}>
      <div style={{ background }} className="experience-banner">
        <div className="experience-blurred_div"></div>
        <div className="experience-div-company">
          <h5 className="experience-text-company">{cardInfo.company}</h5>
        </div>

        <img
          crossOrigin={"anonymous"}
          ref={imgRef}
          className="experience-roundedimg"
          src={cardInfo.companylogo}
          alt={cardInfo.company}
          onLoad={needsRuntimeColor ? computeColor : undefined}
        />
      </div>
      <div className="experience-text-details">
        <h5 className={isDark ? "experience-text-role dark-mode-text" : "experience-text-role"}>
          {cardInfo.role}
        </h5>
        <h5 className={isDark ? "experience-text-date dark-mode-text" : "experience-text-date"}>
          {cardInfo.date}
        </h5>
        <p
          className={
            isDark ? "subTitle experience-text-desc dark-mode-text" : "subTitle experience-text-desc"
          }
        >
          {cardInfo.desc}
        </p>
        <ul>
          <GetDescBullets descBullets={cardInfo.descBullets} isDark={isDark} />
        </ul>
      </div>
    </div>
  );
}
