import { useEffect, useRef, useState, type CSSProperties, type UIEvent } from "react";
import { useInView } from "../../lib/hooks";
import type { AttractionProps } from "./types";

// `span` is the width on a 12-column treemap grid; rows add up to 12.
const blocks = [
  { n: "app", span: 5, keep: true },
  { n: "vendor", span: 4, keep: true },
  { n: "charts", span: 3, keep: true },
  { n: "finance workflows", span: 3, keep: false },
  { n: "finance config", span: 3, keep: false },
  { n: "icons", span: 3, keep: true },
  { n: "legacy config", span: 3, keep: false },
];
const ROWS = 10000;
const ROW_H = 28;
const VIEW_H = 196;
const KINDS = ["Yard visit", "Test drive", "Refinance", "Inspection", "Hub appointment"];
const STATES = ["MH", "KA", "DL", "HR", "TN"];

// Pinned scene: as the visitor scrolls through, the finance chunks fall out of the bundle.
export default function BundleScene(_props: AttractionProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sceneRef, { rootMargin: "20% 0px" });
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = sceneRef.current;
    if (!inView || !el) return undefined;
    let raf = 0;
    const calc = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - innerHeight * 0.55;
      setP(Math.min(1, Math.max(0, (-r.top + innerHeight * 0.25) / Math.max(1, total))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [inView]);

  const mb = (10.5 - 2.1 * p).toFixed(1);
  return (
    <div className="att-bundle" ref={sceneRef} style={{ "--p": p } as CSSProperties}>
      <div className="att-bundle__pin">
        <div className="att-bundle__head">
          <span className="mono">main bundle</span>
          <b className="display">{mb} MB</b>
          <span className={"mono att-bundle__delta" + (p > 0.95 ? " is-done" : "")}>{p > 0.95 ? "−2.1 MB · ~20%" : "scroll to lazy-load the finance chunks"}</span>
        </div>
        <div className="treemap" aria-hidden="true">
          {blocks.map((b) => (
            <div key={b.n} className={"treemap__block" + (b.keep ? "" : " is-drop")} style={{ "--span": b.span } as CSSProperties}>
              <span>{b.n}</span>
            </div>
          ))}
        </div>
        <VirtualGrid />
      </div>
    </div>
  );
}

function VirtualGrid() {
  const [start, setStart] = useState(0);
  const visible = Math.ceil(VIEW_H / ROW_H) + 2;
  const onScroll = (e: UIEvent<HTMLDivElement>) => setStart(Math.max(0, Math.floor(e.currentTarget.scrollTop / ROW_H) - 1));
  const rows: number[] = [];
  for (let i = start; i < Math.min(ROWS, start + visible); i++) rows.push(i);
  return (
    <div className="vgrid">
      <div className="vgrid__head mono">
        <span>virtualised grid</span>
        <span>
          rendering {rows.length} of {ROWS.toLocaleString()} rows
        </span>
      </div>
      <div className="vgrid__scroll" style={{ height: VIEW_H }} onScroll={onScroll} tabIndex={0} aria-label="Virtualised list of ten thousand rows">
        <div style={{ height: ROWS * ROW_H, position: "relative" }}>
          {rows.map((i) => (
            <div key={i} className="vgrid__row" style={{ top: i * ROW_H, height: ROW_H }}>
              <span className="mono">#{String(i + 1).padStart(5, "0")}</span>
              <span>{KINDS[i % KINDS.length]}</span>
              <span className="mono">{STATES[i % STATES.length]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
