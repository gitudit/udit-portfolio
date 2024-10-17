import React, {useContext} from "react";
import "./Footer.css";
import {Fade} from "react-reveal";
import emoji from "react-easy-emoji";
import StyleContext from "../../contexts/StyleContext";

export default function Footer() {
  const {isDark} = useContext(StyleContext);
  return (
    <Fade bottom duration={1000} distance="5px">
      <div className="footer-div">
        <p className={isDark ? "dark-mode footer-text" : "footer-text"}>
          {emoji("Udit Singh © 2024")}
        </p>
        <p className={isDark ? "dark-mode footer-text" : "footer-text"}>
         <a style={{color:"#847070"}} href="#">
          <i class="fa fa-map-marker" aria-hidden="true"></i> Noida, India.
          </a>
        </p>
      </div>
    </Fade>
  );
}
