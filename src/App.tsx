import { Activity, lazy, Suspense, useEffect, useEffectEvent, useRef } from "react";
import "./styles/tokens.css";
import "./styles/app.css";
import "./styles/details.css";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import Hud from "./components/Hud";
import Line from "./components/Line";
import Terminus from "./components/Terminus";
import Toasts from "./components/Toasts";
import ErrorBoundary from "./components/ErrorBoundary";
import { hydrateStore, useStore, openPalette, openTerminal, closeOverlays, unlock, setExpress } from "./lib/store";
import { isTypingTarget } from "./lib/hooks";
import { play } from "./lib/sound";
import { burst } from "./lib/confetti";

const HoodPanel = lazy(() => import("./components/HoodPanel"));
const CommandPalette = lazy(() => import("./components/CommandPalette"));
const Terminal = lazy(() => import("./components/Terminal"));
const CaseStudyDrawer = lazy(() => import("./components/CaseStudyDrawer"));

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"] as const;

export default function App() {
  const { hoodOpen, paletteOpen, terminalOpen, drawer, express } = useStore((s) => ({
    hoodOpen: s.hoodOpen,
    paletteOpen: s.paletteOpen,
    terminalOpen: s.terminalOpen,
    drawer: s.drawer,
    express: s.express,
  }));
  const konami = useRef<string[]>([]);

  useEffect(() => {
    hydrateStore();
  }, []);

  // Warm the overlay chunks (about 7 KB gzipped) once the browser is idle, so the first ⌘K is instant.
  useEffect(() => {
    const prefetch = () => {
      void import("./components/CommandPalette");
      void import("./components/HoodPanel");
      void import("./components/CaseStudyDrawer");
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(prefetch, 2500);
    return () => clearTimeout(t);
  }, []);

  // Global keys. An Effect Event always sees the latest open/closed state without re-subscribing.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openPalette(!paletteOpen);
      play("pop");
      return;
    }
    if (e.key === "Escape") {
      closeOverlays();
      setExpress(false);
      return;
    }
    if (isTypingTarget(e)) return;
    if (e.key === "`" || e.key === "~") {
      e.preventDefault();
      openTerminal(!terminalOpen);
      play("pop");
      return;
    }
    const k = konami.current;
    k.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    if (k.length > KONAMI.length) k.shift();
    if (k.join(",") === KONAMI.join(",")) {
      k.length = 0;
      if (unlock("konami")) play("unlock");
      burst();
      setExpress(true);
    }
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // While a modal overlay is open the page behind it is inert: no focus, no clicks, no screen-reader
  // reach. The element that opened it gets focus back when the last modal closes.
  const modal = hoodOpen || paletteOpen || drawer !== null;
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!modal) return undefined;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const els = Array.from(document.querySelectorAll<HTMLElement>("#main, .topbar"));
    for (const el of els) el.inert = true;
    return () => {
      for (const el of els) el.inert = false;
      const back = opener.current;
      opener.current = null;
      if (back?.isConnected) back.focus({ preventScroll: true });
    };
  }, [modal]);

  // Express pass: the ride drives itself until the visitor touches anything.
  useEffect(() => {
    if (!express) return undefined;
    let raf = 0;
    let last = performance.now();
    const stop = () => setExpress(false);
    const step = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      window.scrollBy(0, dt * 0.12);
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) return stop();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("wheel", stop, opts);
    window.addEventListener("touchstart", stop, opts);
    window.addEventListener("pointerdown", stop, opts);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("pointerdown", stop);
    };
  }, [express]);

  return (
    <>
      <a className="skip" href="#line">
        Skip to the ride
      </a>
      <TopBar />
      <main id="main">
        <Hero />
        <Hud />
        {/* Suspense boundaries let React hydrate the long sections in separate, interruptible tasks. */}
        <Suspense fallback={null}>
          <Line />
        </Suspense>
        <Suspense fallback={null}>
          <Terminus />
        </Suspense>
      </main>
      <ErrorBoundary label="overlays">
        <Suspense fallback={null}>
          {hoodOpen && <HoodPanel />}
          {paletteOpen && <CommandPalette />}
          {drawer && <CaseStudyDrawer id={drawer} />}
          {/* The terminal keeps its history between openings: hidden, not unmounted. */}
          <Activity mode={terminalOpen ? "visible" : "hidden"}>
            <Terminal />
          </Activity>
        </Suspense>
      </ErrorBoundary>
      <Toasts />
    </>
  );
}
