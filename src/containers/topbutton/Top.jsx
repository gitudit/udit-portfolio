import React, { useEffect, useRef } from "react";
import "./Top.css";

export default function Top() {
  const buttonRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    // Show the button once the page is scrolled more than 20px (same rule as before), but read and
    // write the DOM at most once per frame instead of on every scroll event.
    const update = () => {
      ticking = false;
      const button = buttonRef.current;
      if (!button) return;
      const scrolled = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
      button.style.visibility = scrolled ? "visible" : "hidden";
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  return (
    <button ref={buttonRef} onClick={scrollToTop} id="topButton" title="Go to top">
      <i className="fas fa-hand-point-up" aria-hidden="true"></i>
    </button>
  );
}
