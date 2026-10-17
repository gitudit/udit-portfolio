import React, { useContext } from "react";
import { Fade } from "../../components/reveal/Reveal";
import "./Greeting.css";
// StarWars.css duplicates several Greeting.css rules *after* Greeting.css's media queries, which is
// what keeps the hero text and illustration side by side on small screens. Keep the import order.
import "./StarWars.css";
import landingAnimation from "../../assets/lottie/landing2.json?url";
import manOnTable from "../../assets/images/manOnTable.svg";
import DisplayLottie from "../../components/displayLottie/DisplayLottie";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import { illustration, greeting } from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";

export default function Greeting() {
  const { isDark } = useContext(StyleContext);
  if (!greeting.displayGreeting) {
    return null;
  }
  return (
    // `appear`: the hero is above the fold, so the pre-rendered HTML starts the fade immediately.
    <Fade bottom duration={1000} distance="40px" appear>
      <div className="greet-main" id="greeting">
        <div className="greeting-main">
          <div className="greeting-text-div">
            <div>
              <h1 className={isDark ? "dark-mode greeting-text" : "greeting-text"}>
                {" "}
                {greeting.title}{" "}
              </h1>
              <p
                className={isDark ? "dark-mode greeting-text-p" : "greeting-text-p subTitle"}
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                <i className="fa fa-quote-left" aria-hidden="true"></i> Full-time Software Engineer with a
                commitment to excellence
              </p>
              <hr></hr>
              <p className={"greeting-text-p subTitle"} style={{ fontSize: "15px" }}>
                <i className="fa fa-quote-left" aria-hidden="true"></i> Proven track record in solving
                real-time problems using dynamic frameworks.
              </p>
              <p className={"greeting-text-p subTitle"} style={{ fontSize: "15px" }}>
                <i className="fa fa-quote-left" aria-hidden="true"></i> My knack for writing robust and
                object-oriented code drives me to challenge and stretch my DSA skills to the maximum!
              </p>
              <p className={"greeting-text-p subTitle"} style={{ fontSize: "15px" }}>
                <i className="fa fa-quote-left" aria-hidden="true"></i> Oh, did I tell? I am forever
                addicted to Hackathons too!
              </p>
              <hr></hr>
              <p className={"greeting-text-p subTitle"}>FOLLOW ME AROUND THE WEB:</p>
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
              <DisplayLottie animationPath={landingAnimation} />
            ) : (
              <img alt="man sitting on table" src={manOnTable}></img>
            )}
          </div>
        </div>
      </div>
    </Fade>
  );
}
