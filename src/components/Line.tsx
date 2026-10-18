import { useEffect, useRef } from "react";
import { stations } from "../content/ride";
import Station from "./Station";
import { getState, setCurrent, stamp, unlock } from "../lib/store";
import { play } from "../lib/sound";
import { burst } from "../lib/confetti";

// The Line: a vertical rail with a car pinned near the eye line. The rail lights up to the car
// with a CSS scroll-driven animation; JS only tracks which station is at the car.
export default function Line() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === "undefined") return undefined;
    const els = Array.from(track.querySelectorAll<HTMLElement>("[data-station]"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const idx = els.indexOf(en.target as HTMLElement);
          const station = stations[idx];
          if (idx < 0 || !station) continue;
          const wasCurrent = getState().current;
          setCurrent(idx);
          const fresh = stamp(station.id, stations.length);
          if (fresh) {
            play("stamp");
            if (getState().stamps.length === stations.length) {
              play("unlock");
              const r = en.target.getBoundingClientRect();
              burst(r.left + Math.min(r.width, innerWidth) / 2, Math.max(80, r.top));
            }
          } else if (wasCurrent !== idx) {
            play("tick");
          }
          if (idx > 0) unlock("boarded");
        }
      },
      { rootMargin: "-42% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));

    // Progress fallback for browsers without scroll-driven animations: write --ride-p on scroll.
    const supportsSDA = typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = track.getBoundingClientRect();
        const carY = innerHeight * 0.42;
        const p = Math.min(1, Math.max(0, (carY - r.top) / r.height));
        document.documentElement.style.setProperty("--ride-p", p.toFixed(4));
      });
    };
    if (!supportsSDA) {
      track.classList.add("no-sda");
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="line" id="line" aria-labelledby="line-title">
      <div className="wrap line__intro">
        <p className="eyebrow">The line · {stations.length} stops · one direction</p>
        <h2 id="line-title" className="display line__title">
          Seven stops. <span className="line__soft">Every one of them shipped.</span>
        </h2>
        <p className="muted line__sub">Scroll to ride. Stations stamp your ticket as the car passes. Tap the attraction at each stop.</p>
      </div>
      <div className="wrap track" ref={trackRef}>
        <div className="track__rail" aria-hidden="true" />
        <div className="track__lit" aria-hidden="true" />
        <div className="track__carwrap" aria-hidden="true">
          <div className="track__car">
            <span>US</span>
          </div>
        </div>
        <ol className="stations">
          {stations.map((s, i) => (
            <Station key={s.id} station={s} index={i} total={stations.length} />
          ))}
        </ol>
      </div>
    </section>
  );
}
