 import React, {useContext} from "react";
// import React, { Component } from "react";
import { TweenLite } from "gsap";
import {Fade} from "react-reveal";
import emoji from "react-easy-emoji";
import "./Greeting.css";
import "./StarWars.css";
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
                <i class="fa fa-quote-left" aria-hidden="true"></i>A prefinal year IT undergraduate from IIIT Gwalior, passionate about full-stack software engineering and data science.</p>
              <hr></hr>
              <p className={"greeting-text-p subTitle"}>Software development motivates me to collaborate with developers on shaping most novel of those ideas and making them products shippable.<br></br>My knack for writing robust and object-oriented code drives me to challenge and stretch my DSA skills to the maximum!</p>
              <p>Oh, did I tell?<br></br> I am forever addicted to Hackathons too!</p>
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


// import { TimelineLite } from "gsap"; // import TimelineLite instead



// class Greeting extends Component {
//   constructor(props) {
//     super(props);
//     this.content = React.createRef();
//  // shiny new React 16.3 ref API!
//   }
// componentDidMount() {
//     const tl = new TimelineLite();
    
//     tl
//     .to(this.content.current, 200, { top: "-170%" });
//   }
//   render() {
//     return (
//       <Fade bottom duration={1000} distance="40px">
//                <div className="greet-main" id="greeting">
//           <div className="greeting-main">
//           <div className="greeting-text-div">
//             {/* <div> */}
//       <div className="container">
//       <section className="crawl">
//   <div className="content" ref={this.content}>
//     <h1 className="title">Episode 7</h1>
//     <h2 className="subtitle">THE APP AWAKENS</h2>
//     <p>The Development Team Lead has vanished. In her absence, the sinister FUNCTIONAL BUG has risen from the ashes of the CI Tool and will not rest until the last developer has been destroyed.
//     </p>
//     <p>With the support of the QA TEAM, the Software Developer leads a brave RESISTANCE. He is desperate to find his Lead and gain her help in restoring peace and justice to the repository.
//     </p>
//     <p>The Developer has sent his most daring editor theme on a secret mission to the production branch, where an old ally has discovered a clue to the Lead’s whereabouts....</p>
//   </div>
// </section>

//       {/* </div> */}
//       </div>
//       </div>
//       <div className="greeting-image-div">
//              {illustration.animated ? (
//               <DisplayLottie animationData={landingPerson} />
//          ) : (
//                <img
//                  alt="man sitting on table"
//                  src={require("../../assets/images/manOnTable.svg")}
//                ></img>
//              )}
//            </div>
//       </div>
//       </div>
//     </Fade>
//     );
//   }
// }

// export default Greeting;
