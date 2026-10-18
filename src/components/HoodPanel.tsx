import { Suspense, use, useEffect, useRef, useState } from "react";
import type { Metric } from "web-vitals";
import { hoodStory } from "../content/ride";
import { openHood } from "../lib/store";
import { useDialogFocus } from "../lib/hooks";
import { play } from "../lib/sound";
import { Close } from "./Icons";

const BASE = import.meta.env.BASE_URL;

type VitalName = "LCP" | "INP" | "CLS" | "FCP" | "TTFB";
const VITALS: readonly VitalName[] = ["LCP", "INP", "CLS", "FCP", "TTFB"];
const thresholds: Record<VitalName, [good: number, poor: number]> = { LCP: [2500, 4000], INP: [200, 500], CLS: [0.1, 0.25], FCP: [1800, 3000], TTFB: [800, 1800] };

function rate(name: VitalName, v: number): "ok" | "warn" | "bad" {
  const [good, poor] = thresholds[name];
  return v <= good ? "ok" : v <= poor ? "warn" : "bad";
}
function fmt(name: VitalName, v: number): string {
  return name === "CLS" ? v.toFixed(3) : Math.round(v) + " ms";
}

interface HoodJson {
  totals: {
    js: { gz: number; files: number };
    css: { gz: number };
    fonts: { raw: number };
    html: { gz: number };
  };
}

// Fetched once per page load and shared by every opening of the panel; `use()` suspends on it.
let hoodPromise: Promise<HoodJson | null> | undefined;
function loadHood(): Promise<HoodJson | null> {
  hoodPromise ??= fetch(BASE + "hood.json")
    .then((r) => (r.ok ? (r.json() as Promise<HoodJson>) : null))
    .catch(() => null);
  return hoodPromise;
}

function Shipped() {
  const stats = use(loadHood());
  if (!stats) return null;
  return (
    <div className="hood__stats">
      <div className="hood__stat">
        <b className="display">{stats.totals.js.gz}</b>
        <span>KB JavaScript, gzipped, all chunks ({stats.totals.js.files} files)</span>
      </div>
      <div className="hood__stat">
        <b className="display">{stats.totals.css.gz}</b>
        <span>KB CSS, gzipped</span>
      </div>
      <div className="hood__stat">
        <b className="display">{stats.totals.fonts.raw}</b>
        <span>KB fonts, three subset variable files</span>
      </div>
      <div className="hood__stat">
        <b className="display">{stats.totals.html.gz}</b>
        <span>KB pre-rendered HTML, gzipped</span>
      </div>
    </div>
  );
}

export default function HoodPanel() {
  const [vitals, setVitals] = useState<Partial<Record<VitalName, number>>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialogFocus(closeRef);

  useEffect(() => {
    let alive = true;
    void import("web-vitals").then((wv) => {
      if (!alive) return;
      const show = (m: Metric) => setVitals((v) => ({ ...v, [m.name]: m.value }));
      wv.onLCP(show, { reportAllChanges: true });
      wv.onINP(show, { reportAllChanges: true });
      wv.onCLS(show, { reportAllChanges: true });
      wv.onFCP(show);
      wv.onTTFB(show);
    });
    return () => {
      alive = false;
    };
  }, []);

  const close = () => {
    openHood(false);
    play("close");
  };

  return (
    <div className="overlay" onClick={close}>
      <aside className="hood" role="dialog" aria-modal="true" aria-labelledby="hood-title" onClick={(e) => e.stopPropagation()}>
        <div className="hood__head">
          <div>
            <p className="eyebrow">Open the hood</p>
            <h2 id="hood-title" className="display hood__title">
              This page, on your device.
            </h2>
          </div>
          <button ref={closeRef} type="button" className="iconbtn" onClick={close} aria-label="Close">
            <Close />
          </button>
        </div>

        <dl className="vitals">
          {VITALS.map((k) => {
            const v = vitals[k];
            return (
              <div key={k} className={"vital " + (v !== undefined ? rate(k, v) : "")}>
                <dt>{k}</dt>
                <dd>{v !== undefined ? fmt(k, v) : k === "INP" ? "tap something" : "…"}</dd>
              </div>
            );
          })}
        </dl>
        <p className="muted hood__note">Live Core Web Vitals measured by the web-vitals library in your browser right now. Not a lab score, not a claim.</p>

        <Suspense fallback={<div className="hood__stats hood__stats--loading" aria-busy="true" />}>
          <Shipped />
        </Suspense>

        <h3 className="hood__h3">The story behind the numbers</h3>
        <table className="hood__table">
          <thead>
            <tr>
              <th>Lighthouse, mobile</th>
              <th>Before</th>
              <th>After</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Score</td>
              <td>{hoodStory.before.score}</td>
              <td>{hoodStory.after.score}</td>
            </tr>
            <tr>
              <td>Largest Contentful Paint</td>
              <td>{hoodStory.before.lcp}</td>
              <td>{hoodStory.after.lcp}</td>
            </tr>
            <tr>
              <td>First Contentful Paint</td>
              <td>{hoodStory.before.fcp}</td>
              <td>{hoodStory.after.fcp}</td>
            </tr>
            <tr>
              <td>Total Blocking Time</td>
              <td>{hoodStory.before.tbt}</td>
              <td>{hoodStory.after.tbt}</td>
            </tr>
            <tr>
              <td>Transfer · requests · origins</td>
              <td>
                {hoodStory.before.bytes} · {hoodStory.before.requests} · {hoodStory.before.origins}
              </td>
              <td>
                {hoodStory.after.bytes} · {hoodStory.after.requests} · {hoodStory.after.origins}
              </td>
            </tr>
          </tbody>
        </table>
        <ul className="hood__claims">
          {hoodStory.claims.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <a className="btn btn--ghost" href={BASE + hoodStory.report} target="_blank" rel="noreferrer noopener">
          Read the 108-page rebuild report
        </a>
      </aside>
    </div>
  );
}
