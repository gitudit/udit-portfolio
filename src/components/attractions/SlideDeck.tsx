import { addTransitionType, startTransition, useRef, useState, ViewTransition, type KeyboardEvent, type PointerEvent } from "react";
import { play } from "../../lib/sound";
import type { AttractionProps } from "./types";

const slides = [
  { k: "01", h: "Slides, from scratch", p: "The navigation engine was rewritten in-house, element by element." },
  { k: "02", h: "No reveal.js", p: "One dependency fewer. Forty percent less overhead on every deck." },
  { k: "03", h: "Reusable by default", p: "Components the whole Arts tech team dropped into their projects." },
];

// Slide changes are React Transitions tagged with a direction, so <ViewTransition> picks the
// matching enter/exit animation from the View Transitions API. No animation library involved.
export default function SlideDeck(_props: AttractionProps) {
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);

  const go = (dir: 1 | -1) => {
    const next = (i + dir + slides.length) % slides.length;
    play("tick");
    startTransition(() => {
      addTransitionType(dir === 1 ? "deck-next" : "deck-prev");
      setI(next);
    });
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const d = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(d) > 40) go(d < 0 ? 1 : -1);
  };
  const slide = slides[i] ?? slides[0]!;

  return (
    <div className="att-deck" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="A three-slide deck" onKeyDown={onKey} onPointerDown={(e) => (startX.current = e.clientX)} onPointerUp={onPointerUp}>
      <div className="att-deck__viewport att-deck__stage">
        <ViewTransition
          key={slide.k}
          enter={{ "deck-next": "deck-from-right", "deck-prev": "deck-from-left", default: "none" }}
          exit={{ "deck-next": "deck-to-left", "deck-prev": "deck-to-right", default: "none" }}
        >
          <div className="att-deck__slide" aria-live="polite">
            <span className="mono">
              {slide.k} / 0{slides.length}
            </span>
            <b className="display">{slide.h}</b>
            <p>{slide.p}</p>
          </div>
        </ViewTransition>
      </div>
      <div className="att-deck__ctl">
        <button type="button" className="iconbtn" onClick={() => go(-1)} aria-label="Previous slide">
          ‹
        </button>
        <ol className="att-deck__dots" aria-hidden="true">
          {slides.map((s, n) => (
            <li key={s.k} className={n === i ? "is-on" : ""} />
          ))}
        </ol>
        <button type="button" className="iconbtn" onClick={() => go(1)} aria-label="Next slide">
          ›
        </button>
      </div>
    </div>
  );
}
