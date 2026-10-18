import { useState, type CSSProperties } from "react";
import { play } from "../../lib/sound";
import type { AttractionProps } from "./types";

const reqs = [
  { n: "GET /models", w: 92 },
  { n: "GET /mesh", w: 70 },
  { n: "GET /materials", w: 84 },
  { n: "GET /results", w: 60 },
  { n: "GET /assets", w: 76 },
];

export default function CacheSwitch(_props: AttractionProps) {
  const [cached, setCached] = useState(false);
  return (
    <div className="att-cache">
      <div className="att-cache__head">
        <button
          type="button"
          role="switch"
          aria-checked={cached}
          className={"switch" + (cached ? " is-on" : "")}
          onClick={() => {
            setCached((c) => !c);
            play(cached ? "close" : "pop");
          }}
        >
          <span className="switch__knob" />
          <span className="switch__label">Cache {cached ? "on" : "off"}</span>
        </button>
        <span className="att-cache__total display" aria-live="polite">
          {cached ? "0.6 s" : "1.2 s"}
        </span>
      </div>
      <ul className="waterfall">
        {reqs.map((r, i) => (
          <li key={r.n} style={{ "--w": (cached ? r.w * 0.5 : r.w) + "%", "--d": i * 60 + "ms" } as CSSProperties}>
            <span className="waterfall__name mono">{r.n}</span>
            <span className="waterfall__bar">
              <i />
            </span>
            <span className="waterfall__tag mono">{cached ? "hit" : "miss"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
