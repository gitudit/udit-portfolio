import React, { Children, cloneElement, useEffect, useRef, useState } from "react";
import "./reveal.css";

/**
 * Drop-in replacement for the `Fade` / `Slide` components of react-reveal 1.2.2.
 *
 * It reproduces the library's observable behaviour exactly:
 *  - the child element gets the `react-reveal` class and starts at `opacity: 0`;
 *  - when ≥20% of it is in the viewport (or any part of it is already visible on mount)
 *    it animates with `animation-fill-mode: both`, the same keyframes and timing;
 *  - the final state is `opacity: 1; transform: none`.
 *
 * `appear` renders the revealed/animating state immediately. It is used for above-the-fold
 * content so the pre-rendered HTML fades in from first paint instead of waiting for JS.
 */

const DEFAULT_FRACTION = 0.2;
const DEFAULT_DURATION = 1000;

function keyframes(effect, dirs) {
  const { left, right, up, down, top, bottom, distance, big } = dirs;
  const moves = left || right || up || down || top || bottom;
  let transform = "";
  if (moves) {
    const c = distance || (big ? "2000px" : "100%");
    const x = left ? "-" + c : right ? c : "0";
    const y = down || top ? "-" + c : up || bottom ? c : "0";
    transform = ` transform: translate3d(${x}, ${y}, 0);`;
  }
  const dir = left ? "left" : right ? "right" : up ? "up" : down ? "down" : top ? "top" : bottom ? "bottom" : "none";
  const name = `reveal-${effect}-${dir}-${(distance || (big ? "2000px" : "100pct")).replace("%", "pct")}`;
  const body =
    effect === "fade"
      ? `from {opacity: 0;${transform}}\n     to {opacity: 1;transform: none;} `
      : `from {${transform}}\n     to {transform: none;} `;
  return { name, body };
}

let sheet = null;
const inserted = new Set();
function ensureKeyframes({ name, body }) {
  if (typeof document === "undefined" || inserted.has(name)) return;
  inserted.add(name);
  // Keyframes for the combinations used on the site are also defined statically in reveal.css,
  // so pre-rendered HTML can animate before JS runs. This covers any other combination.
  if (document.querySelector(`style[data-reveal-static]`)) return;
  if (!sheet) {
    const el = document.createElement("style");
    el.setAttribute("data-reveal", "");
    document.head.appendChild(el);
    sheet = el.sheet;
  }
  try {
    sheet.insertRule(`@keyframes ${name}{${body}}`, sheet.cssRules.length);
  } catch (e) {
    /* ignore */
  }
}

// Same geometry test react-reveal's RevealBase.inViewport uses once its global hide is active.
function offsetTopOf(el) {
  while (el.offsetTop === undefined) el = el.parentNode;
  let t = el.offsetTop;
  while (el.offsetParent) {
    el = el.offsetParent;
    t += el.offsetTop;
  }
  return t;
}
function inViewport(el, fraction) {
  if (!el || document.hidden) return false;
  const h = el.offsetHeight;
  const s = window.pageYOffset - offsetTopOf(el);
  const o = Math.min(h, window.innerHeight) * fraction;
  return s > o - window.innerHeight && s < h - o;
}

function setRef(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref && typeof ref === "object") ref.current = value;
}

function Reveal({
  effect,
  children,
  duration = DEFAULT_DURATION,
  delay = 0,
  count = 1,
  fraction = DEFAULT_FRACTION,
  appear = false,
  left,
  right,
  up,
  down,
  top,
  bottom,
  distance,
  big,
}) {
  const child = Children.only(children);
  const ref = useRef(null);
  const [shown, setShown] = useState(appear);
  const frames = keyframes(effect, { left, right, up, down, top, bottom, distance, big });

  useEffect(() => {
    ensureKeyframes(frames);
    if (shown) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    if (inViewport(el, fraction) || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].intersectionRatio > 0) {
          io.disconnect();
          setShown(true);
        }
      },
      { threshold: fraction }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = shown
    ? {
        ...child.props.style,
        animationFillMode: "both",
        animationDuration: duration + "ms",
        animationDelay: delay + "ms",
        animationIterationCount: count,
        opacity: 1,
        animationName: frames.name,
      }
    : { ...child.props.style, opacity: 0 };

  const className = child.props.className ? `react-reveal ${child.props.className}` : "react-reveal";
  const childRef = child.ref;

  return cloneElement(child, {
    className,
    style,
    ref: (node) => {
      ref.current = node;
      setRef(childRef, node);
    },
  });
}

export function Fade(props) {
  return <Reveal {...props} effect="fade" />;
}

export function Slide(props) {
  return <Reveal {...props} effect="slide" />;
}

export default Reveal;
