import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { person, stations } from "../content/ride";
import { useStore } from "../lib/store";
import { reducedMotion, useBrowserValue } from "../lib/hooks";
import { ArrowDown, Ticket } from "./Icons";
import Skyline from "./Skyline";

const Shader = lazy(() => import("./Shader"));

function shaderWorthIt(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const lowMem = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
  const saveData = nav.connection?.saveData === true;
  return !reducedMotion() && !lowMem && !saveData;
}

const marquee = ["Now boarding", "The Ride", `${stations.length} stops`, "Gwalior → Bengaluru → Singapore → Gurugram", "Keep hands inside the viewport", "No height requirement"];

export default function Hero() {
  const calm = useStore((s) => s.calm);
  // Server and first client render agree on "no shader"; the device decides right after hydration.
  const shaderOk = useBrowserValue(shaderWorthIt, false);
  // The shader is a backdrop, not content: it starts on the first sign of a visitor (pointer, touch,
  // scroll, key) or once the page has loaded and gone idle, never during first paint and hydration.
  const [engaged, setEngaged] = useState(false);
  useEffect(() => {
    const events = ["pointermove", "pointerdown", "touchstart", "scroll", "keydown"] as const;
    const on = () => {
      setEngaged(true);
      cleanup();
    };
    let timer = 0;
    let idle = 0;
    const afterLoad = () => {
      timer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(on, { timeout: 3000 });
        else on();
      }, 1500);
    };
    const cleanup = () => {
      for (const e of events) window.removeEventListener(e, on);
      window.removeEventListener("load", afterLoad);
      clearTimeout(timer);
      if (idle && "cancelIdleCallback" in window) window.cancelIdleCallback(idle);
    };
    for (const e of events) window.addEventListener(e, on, { passive: true, once: true });
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return cleanup;
  }, []);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const passRef = useRef<HTMLElement>(null);

  // Kinetic type and the floating boarding pass follow the pointer: one style write per frame.
  useEffect(() => {
    const title = titleRef.current;
    if (!title || !matchMedia("(pointer: fine)").matches) return undefined;
    let raf = 0;
    let px = 0.5;
    let py = 0.5;
    const apply = () => {
      raf = 0;
      title.style.setProperty("--soft", (px * 100).toFixed(1));
      title.style.setProperty("--wght", String(Math.round(450 + py * 250)));
      const pass = passRef.current;
      if (pass) {
        pass.style.setProperty("--ry", ((px - 0.5) * 16).toFixed(2) + "deg");
        pass.style.setProperty("--rx", ((0.5 - py) * 12).toFixed(2) + "deg");
      }
    };
    const onMove = (e: PointerEvent) => {
      px = Math.min(1, Math.max(0, e.clientX / innerWidth));
      py = Math.min(1, Math.max(0, e.clientY / innerHeight));
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      {shaderOk && engaged && !calm && (
        <Suspense fallback={null}>
          <Shader />
        </Suspense>
      )}
      <div className="hero__grain" aria-hidden="true" />
      <Skyline variant="hero" />
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}>
              {m}
              <i>◆</i>
            </span>
          ))}
        </div>
      </div>
      <div className="wrap hero__inner">
        <div className="hero__copy">
          <p className="eyebrow hero__gate">
            Main gate · four lands · <span className="hero__pass">Admit one</span>
          </p>
          <h1 id="hero-title" ref={titleRef} className="display hero__title">
            <span className="hero__line">Udit</span>
            <span className="hero__line">
              Singh<span className="hero__dot">.</span>
            </span>
          </h1>
          <p className="hero__tagline">{person.tagline}</p>
          <p className="hero__boarding muted">{person.boarding}</p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#line">
              <ArrowDown /> Board the ride
            </a>
            <a className="btn" href={person.resume} target="_blank" rel="noreferrer noopener">
              <Ticket /> Boarding pass
            </a>
            <span className="hero__hint muted">
              or press <span className="kbd">⌘</span>
              <span className="kbd">K</span>
            </span>
          </div>
        </div>

        {/* Decorative boarding pass; the same facts are in the copy, so it is hidden from assistive tech. */}
        <aside className="pass" ref={passRef} aria-hidden="true">
          <div className="pass__main">
            <div className="pass__top mono">
              <span className="pass__brand">The Ride</span>
              <span>Frontend · Class A</span>
            </div>
            <div className="pass__name display">Udit Singh</div>
            <dl className="pass__grid mono">
              <div>
                <dt>Gate</dt>
                <dd>01</dd>
              </div>
              <div>
                <dt>Seat</dt>
                <dd>FE</dd>
              </div>
              <div>
                <dt>Stops</dt>
                <dd>0{stations.length}</dd>
              </div>
              <div>
                <dt>Departs</dt>
                <dd>On scroll</dd>
              </div>
            </dl>
            <div className="pass__route mono">
              <span>GWL</span>
              <i />
              <span>BLR</span>
              <i />
              <span>SIN</span>
              <i />
              <span>GGN</span>
            </div>
            <div className="pass__barcode" />
          </div>
          <div className="pass__stub mono">
            <span>Admit one</span>
            <b className="display">01</b>
            <span>2018 → 2026</span>
          </div>
        </aside>
      </div>
      <div className="hero__cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
