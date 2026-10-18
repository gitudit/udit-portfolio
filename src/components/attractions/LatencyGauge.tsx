import { useEffect, useRef, useState } from "react";
import { prefersCalm } from "../../lib/hooks";
import type { AttractionProps } from "./types";

// Semicircular gauge that eases from 100 to 60 the first time the station is at the car.
export default function LatencyGauge({ active }: AttractionProps) {
  const [v, setV] = useState(100);
  const done = useRef(false);
  useEffect(() => {
    if (!active || done.current) return undefined;
    done.current = true;
    const dur = prefersCalm() ? 0 : 1400; // calm ride: jump to the final value on the first frame
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(100 - 40 * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const R = 80;
  const C = Math.PI * R; // half circumference
  const frac = v / 100;
  return (
    <div className="att-gauge">
      <svg viewBox="0 0 200 120" className="att-gauge__svg" role="img" aria-label={`API response time index ${v}`}>
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--rail)" strokeWidth="12" strokeLinecap="round" />
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--accent)" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${C * frac} ${C}`} />
        <g transform={`rotate(${-180 + 180 * frac} 100 100)`}>
          <line x1="100" y1="100" x2="30" y2="100" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="5" fill="var(--ink)" />
        </g>
      </svg>
      <div className="att-gauge__read">
        <b className="display">{v}</b>
        <span className="mono">response time index</span>
        <span className={"att-gauge__delta" + (v <= 60 ? " is-done" : "")}>{v <= 60 ? "−40% · backend services rewritten" : "measuring…"}</span>
      </div>
    </div>
  );
}
