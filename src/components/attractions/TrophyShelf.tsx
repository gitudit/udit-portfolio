import type { PointerEvent } from "react";
import type { AttractionProps } from "./types";

const trophies = [
  { k: "II", t: "PyTorch Annual Hackathon", s: "2nd place, global · 2021" },
  { k: "I", t: "Hack-ED v1.0", s: "Winner" },
  { k: "I", t: "Line-follower robotics", s: "Winner" },
];

function tilt(e: PointerEvent<HTMLLIElement>): void {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--ry", (x * 16).toFixed(2) + "deg");
  el.style.setProperty("--rx", (-y * 16).toFixed(2) + "deg");
}
function reset(e: PointerEvent<HTMLLIElement>): void {
  e.currentTarget.style.setProperty("--ry", "0deg");
  e.currentTarget.style.setProperty("--rx", "0deg");
}

export default function TrophyShelf(_props: AttractionProps) {
  return (
    <div className="att-shelf">
      <ul className="att-shelf__row">
        {trophies.map((t) => (
          <li key={t.t} className="trophy" onPointerMove={tilt} onPointerLeave={reset}>
            <span className="trophy__k display">{t.k}</span>
            <b>{t.t}</b>
            <span className="trophy__s">{t.s}</span>
          </li>
        ))}
      </ul>
      <div className="stampmark" role="img" aria-label="Patent: system and method for aiding during medical emergency">
        <span className="stampmark__ring">
          <span>Patent</span>
          <small>System and method for aiding during medical emergency</small>
        </span>
      </div>
    </div>
  );
}
