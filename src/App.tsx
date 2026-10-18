import { Activity, lazy, Suspense, useEffect, useEffectEvent, useRef } from "react";
import "./styles/tokens.css";
import "./styles/app.css";
import "./styles/details.css";
import "./styles/park.css";
import TopBar from "./components/TopBar";
import Sky from "./components/Sky";
import Hero from "./components/Hero";
import Hud from "./components/Hud";
import Line from "./components/Line";
import Midway from "./components/Midway";
import Terminus from "./components/Terminus";
import Toasts from "./components/Toasts";
import ErrorBoundary from "./components/ErrorBoundary";
import { MiniMap } from "./components/MapGraphic";
import { stations } from "./content/ride";
import { hydrateStore, useStore, openPalette, openTerminal, openMap, closeOverlays, unlock, setExpress, setZone, type Zone } from "./lib/store";
import { isTypingTarget } from "./lib/hooks";
import { play } from "./lib/sound";
import { burst } from "./lib/confetti";

const ParkMap = lazy(() => import("./components/ParkMap"));
const CommandPalette = lazy(() => import("./components/CommandPalette"));
const Terminal = lazy(() => import("./components/Terminal"));
const CaseStudyDrawer = lazy(() => import("./components/CaseStudyDrawer"));

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"] as const;

export default function App() {
  const { mapOpen, paletteOpen, terminalOpen, drawer, express, current, zone } = useStore((s) => ({
    mapOpen: s.mapOpen,
    paletteOpen: s.paletteOpen,
    terminalOpen: s.terminalOpen,
    drawer: s.drawer,
    express: s.express,
    current: s.current,
    zone: s.zone,
  }));
  const konami = useRef<string[]>([]);

  useEffect(() => {
    hydrateStore();
  }, []);

  // Warm the overlay chunks (a few KB gzipped) once the browser is idle, so the first ⌘K is instant.
  useEffect(() => {
    const prefetch = () => {
      void import("./components/CommandPalette");
      void import("./components/ParkMap");
      void import("./components/CaseStudyDrawer");
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(prefetch, 2500);
    return () => clearTimeout(t);
  }, []);

  // Which zone of the park is at the centre of the viewport: drives the mini-map and the sky fallback.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const targets: [string, Zone][] = [
      ["line", "ride"],
      ["midway", "midway"],
      ["exit", "exit"],
    ];
    const els = targets.map(([id, z]) => [document.getElementById(id), z] as const).filter((x): x is readonly [HTMLElement, Zone] => x[0] !== null);
    const active = new Set<Zone>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const z = els.find(([el]) => el === e.target)?.[1];
          if (!z) continue;
          if (e.isIntersecting) active.add(z);
          else active.delete(z);
        }
        setZone(active.has("exit") ? "exit" : active.has("midway") ? "midway" : active.has("ride") ? "ride" : "gate");
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach(([el]) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // The land under the car, as a root attribute: CSS hooks and the no-scroll-timeline sky fallback.
  useEffect(() => {
    document.documentElement.dataset.land = zone === "ride" ? (stations[current]?.land ?? "campus") : zone;
  }, [zone, current]);

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
    if (e.key.toLowerCase() === "m" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      openMap(!mapOpen);
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
  const modal = mapOpen || paletteOpen || drawer !== null;
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!modal) return undefined;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const els = Array.from(document.querySelectorAll<HTMLElement>("#main, .topbar, .minimap"));
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
      <Sky />
      <TopBar />
      <main id="main">
        <Hero />
        <Hud />
        {/* Suspense boundaries let React hydrate the long sections in separate, interruptible tasks. */}
        <Suspense fallback={null}>
          <Line />
        </Suspense>
        <Suspense fallback={null}>
          <Midway />
        </Suspense>
        <Suspense fallback={null}>
          <Terminus />
        </Suspense>
      </main>
      <MiniMap />
      <ErrorBoundary label="overlays">
        <Suspense fallback={null}>
          {mapOpen && <ParkMap />}
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
