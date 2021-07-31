import React, {useContext} from "react";
import {Fade} from "react-reveal";
import emoji from "react-easy-emoji";
import "./Greeting.css";
import landingPerson from "../../assets/lottie/landingPerson";
import DisplayLottie from "../../components/displayLottie/DisplayLottie";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import Button from "../../components/button/Button";

import {illustration, greeting} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";

export default function Greeting() {
  const {isDark} = useContext(StyleContext);
  if (!greeting.displayGreeting) {
    return null;
  }
  return (
    <Fade bottom duration={1000} distance="40px">
      <div className="greet-main" id="greeting">
        <div className="greeting-main">
          <div className="greeting-text-div">
            <div>
              <h1
                className={isDark ? "dark-mode greeting-text" : "greeting-text"}
              >
                {" "}
                {greeting.title}{" "}
               </h1>
              <p
                className={
                  isDark
                    ? "dark-mode greeting-text-p"
                    : "greeting-text-p subTitle"
                }
              >
                <i class="fa fa-quote-left" aria-hidden="true"></i>A prefinal year IT undergrad from IIIT Gwalior who is passionate about Full-Stack software development and Data science.</p>
              <hr></hr>
              <p className={"greeting-text-p subTitle"}>My knack for writing robust and object-oriented code helps me to challenge and stretch my DSA skills to the maximum!<br></br>I am ever motivated to collaborate with teammates and developers to shape most novel of the ideas and make them products shippable.</p>
              <p>Oh, did I tell?<br></br> I am forever addicted to Hackathons too!</p>
              <hr></hr>
              <p className={"greeting-text-p subTitle"}>FOLLOW ME AROUND THE WEB--</p>
              <SocialMedia />
              <div className="button-greeting-div">
                {/* <Button text="Contact me" href="#contact" /> */}
                {/* <Button
                  text="Resume"
                  newTab={true}
                  href={greeting.resumeLink}
                /> */}
              </div>
            </div>
          </div>
          <div className="greeting-image-div">
            {illustration.animated ? (
              <DisplayLottie animationData={landingPerson} />
            ) : (
              <img
                alt="man sitting on table"
                src={require("../../assets/images/manOnTable.svg")}
              ></img>
            )}
          </div>
        </div>
      </div>
    </Fade>
  );
}
