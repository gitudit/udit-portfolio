import React, {useState, useContext} from "react";
import StyleContext from "../../contexts/StyleContext";
import './Tooltip.css';

const Tooltip=(props)=>{
    let timeout;
    const [active,setActive]=useState(false);
    const showTip = () => {
        timeout = setTimeout(() => {
          setActive(true);
        }, 400);
      };
    
      const hideTip = () => {
        clearInterval(timeout);
        setActive(false);
      };
    return(
        <div className="Tooltip-Wrapper"
        // When to show the tooltip
        onMouseEnter={showTip}
        onMouseLeave={hideTip}>
             {props.children}
      {active && (
        <div className={`Tooltip-Tip bottom`}>
          {props.content}
        </div>
      )}
    </div>
    )};

export default Tooltip;