// Day / Night theme. The attribute is set before paint by the inline script in index.html;
// here we only switch it, with a circular wipe via the View Transitions API when available.
import { unlock } from "./store";
import { play } from "./sound";

export type Theme = "day" | "night";

export function getTheme(): Theme {
  if (typeof document === "undefined") return "day";
  return document.documentElement.dataset.theme === "night" ? "night" : "day";
}

export function setTheme(next: Theme, originEl?: Element | null): Theme {
  const root = document.documentElement;
  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem("ride:theme", next);
    } catch {
      /* ignore */
    }
  };
  if (originEl) {
    const r = originEl.getBoundingClientRect();
    root.style.setProperty("--wipe-x", r.left + r.width / 2 + "px");
    root.style.setProperty("--wipe-y", r.top + r.height / 2 + "px");
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches || root.dataset.calm === "1";
  if (typeof document.startViewTransition === "function" && !reduce) {
    // The `theme-wipe` class scopes the root wipe animation to this transition only, so React's own
    // <ViewTransition> updates elsewhere on the page never trigger it.
    root.classList.add("theme-wipe");
    const vt = document.startViewTransition(apply);
    vt.finished.finally(() => root.classList.remove("theme-wipe"));
  } else {
    apply();
  }
  play(next === "night" ? "whoosh-down" : "whoosh-up");
  if (next === "night") unlock("night-rider");
  window.dispatchEvent(new CustomEvent<Theme>("ride:theme", { detail: next }));
  return next;
}

export function toggleTheme(originEl?: Element | null): Theme {
  return setTheme(getTheme() === "night" ? "day" : "night", originEl);
}
