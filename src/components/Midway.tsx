import { lazy, Suspense, useRef, type CSSProperties } from "react";
import { landOf, projects, skills, specialities } from "../content/ride";
import { useNear } from "../lib/hooks";
import { ArrowRight, BrandIcon } from "./Icons";
import LandGate from "./LandGate";
import Skyline from "./Skyline";

const SkillCarousel = lazy(() => import("./SkillCarousel"));

// Land IV. The ride is over; this is where you get off and play: a carousel of skills and a row of
// side attractions (open-source projects).
export default function Midway() {
  const land = landOf("midway");
  const boothRef = useRef<HTMLDivElement>(null);
  const near = useNear(boothRef, "600px 0px");

  // The plain list is what the pre-rendered HTML carries; the 3D carousel replaces it near the viewport.
  const list = (
    <ul className="skills" aria-label="Skills">
      {skills.map((s) => (
        <li key={s.id} className="skills__item">
          <b>{s.name}</b>
          <span className="mono">{s.group}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="midway section" id="midway" aria-labelledby="midway-title">
      <Skyline variant="midway" />
      <div className="wrap">
        <LandGate land={land} />
        <h2 id="midway-title" className="sr-only">
          The Midway: skills and side attractions
        </h2>

        <div className="booth booth--carousel" ref={boothRef}>
          <div className="booth__head">
            <div>
              <p className="eyebrow">Attraction 01 · The Carousel</p>
              <h3 className="display booth__title">Everything I ride with.</h3>
            </div>
            <p className="muted booth__sub">Only tools that appear in shipped work. Drag to spin.</p>
          </div>
          {near ? <Suspense fallback={list}>{<SkillCarousel />}</Suspense> : list}
          <ul className="chips" aria-label="Specialities">
            {specialities.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="booth booth--arcade" id="projects">
          <div className="booth__head">
            <div>
              <p className="eyebrow">Attraction 02 · Side attractions</p>
              <h3 className="display booth__title">Built for fun. Open source.</h3>
            </div>
            <p className="muted booth__sub">Six rides from the campus years, still running on GitHub.</p>
          </div>
          <ul className="posters">
            {projects.map((p, i) => (
              <li key={p.id} className="poster" style={{ "--i": i } as CSSProperties}>
                <img className="poster__thumb" src={p.image} alt="" width={72} height={72} loading="lazy" decoding="async" />
                <div className="poster__body">
                  <span className="poster__tag mono">{p.tag}</span>
                  <b className="display poster__name">{p.name}</b>
                  <p className="poster__blurb">{p.blurb}</p>
                  <a className="poster__link mono" href={p.repo} target="_blank" rel="noreferrer noopener">
                    <BrandIcon id="github" size={14} /> Ride the code <ArrowRight />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
