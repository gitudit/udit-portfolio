import React from "react";
import "./SocialMedia.css";
import {socialMediaLinks} from "../../portfolio";
import Tooltip from "../Tooltip/Tooltip.js";

export default function socialMedia() {
  if (!socialMediaLinks.display) {
    return null;
  }
  return (
    <div className="social-media-div">
      {socialMediaLinks.gmail ? (
       <Tooltip content="uditsingh@gmail.com"><a
          href={`mailto:${socialMediaLinks.gmail}`}
          className="icon-button google"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-google"></i>
          <span></span>
        </a></Tooltip> 
      ) : null}

      {socialMediaLinks.linkedin ? (
        <Tooltip content="linkedin | udit-singh">
        <a
          href={socialMediaLinks.linkedin}
          className="icon-button linkedin"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-linkedin-in"></i>
          <span></span>
        </a></Tooltip>
      ) : null}

      {socialMediaLinks.github ? (
        <Tooltip content="github | udit1707">
        <a
          href={socialMediaLinks.github}
          className="icon-button github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github"></i>
          <span></span>
        </a></Tooltip>
      ) : null}

     {socialMediaLinks.kaggle ? (
        <Tooltip content="kaggle | udit1907"><a
          href={socialMediaLinks.kaggle}
          className="icon-button kaggle"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-kaggle"></i>
          <span></span>
        </a></Tooltip>
      ) : null}
      {socialMediaLinks.hackerrank ? (
        <Tooltip content="hackerrank | udit-singh"><a
          href={socialMediaLinks.hackerrank}
          className="icon-button hackerrank"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-hackerrank"></i>
          <span></span>
        </a></Tooltip>
      ) : null}


      

      
    </div>
  );
}
