import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { skills } from "../content/ride";
import { unlock } from "../lib/store";
import { play } from "../lib/sound";
import { RawIcon } from "./Icons";
import { skillIcons } from "./skillIcons";

// A 3D ring of skill cards. Spins on its own, drags with the pointer, steps with arrow keys, and
// falls back to a flat grid under reduced motion or the calm ride (CSS). Loaded lazily near the Midway;
// the pre-rendered HTML carries a plain list of the same skills instead.
export default function SkillCarousel() {
  const n = skills.length;
  const step = 360 / n;
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; base: number } | null>(null);

  const engage = () => {
    if (unlock("midway")) play("unlock");
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    start.current = { x: e.clientX, base: drag };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    engage();
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    setDrag(start.current.base + (e.clientX - start.current.x) * 0.45);
  };
  const onUp = () => {
    start.current = null;
    setDragging(false);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setDrag((d) => d + (e.key === "ArrowRight" ? -step : step));
      play("tick");
      engage();
    }
  };

  return (
    <div
      className={"carousel" + (dragging ? " is-dragging" : "")}
      role="group"
      aria-label="Skills carousel. Use the left and right arrow keys to spin."
      tabIndex={0}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onKeyDown={onKey}
      style={{ "--n": n, "--drag": `${drag}deg` } as CSSProperties}
    >
      <div className="carousel__stage">
        <ul className="carousel__ring">
          {skills.map((s, i) => (
            <li key={s.id} className="carousel__card" style={{ "--i": i } as CSSProperties}>
              <span className="carousel__icon" aria-hidden="true">
                {s.icon ? <RawIcon svg={skillIcons[s.icon]} size={30} /> : <span className="carousel__mono mono">{s.name.slice(0, 2)}</span>}
              </span>
              <b>{s.name}</b>
              <span className="mono carousel__group">{s.group}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="carousel__hint mono muted" aria-hidden="true">
        ‹ drag or use arrow keys to spin ›
      </p>
    </div>
  );
}
