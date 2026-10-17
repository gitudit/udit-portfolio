import React, { useEffect, useRef, useState } from "react";
import "./Tooltip.css";

const Tooltip = (props) => {
  const timeout = useRef(null);
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout.current = setTimeout(() => {
      setActive(true);
    }, 400);
  };

  const hideTip = () => {
    clearTimeout(timeout.current);
    setActive(false);
  };

  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <div
      className="Tooltip-Wrapper"
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {props.children}
      {active && <div className={`Tooltip-Tip bottom`}>{props.content}</div>}
    </div>
  );
};

export default Tooltip;
