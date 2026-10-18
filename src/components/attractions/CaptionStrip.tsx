import { useEffect, useRef, useState } from "react";
import { reducedMotion, useBrowserValue, useInView } from "../../lib/hooks";
import { useStore } from "../../lib/store";
import { play } from "../../lib/sound";
import type { AttractionProps } from "./types";

const langs = [
  { id: "en", label: "English", text: "Welcome back, class. Today we solve quadratic equations together." },
  { id: "hi", label: "हिन्दी", text: "कक्षा में आपका स्वागत है। आज हम मिलकर द्विघात समीकरण हल करेंगे।" },
  { id: "es", label: "Español", text: "Bienvenidos de nuevo, clase. Hoy resolveremos ecuaciones cuadráticas juntos." },
] as const;

export default function CaptionStrip(_props: AttractionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.4 });
  const calmRide = useStore((s) => s.calm);
  const reduce = useBrowserValue(reducedMotion, false);
  const calm = calmRide || reduce;
  const [li, setLi] = useState(0);
  const lang = langs[li] ?? langs[0];

  // Auto-cycle while visible.
  useEffect(() => {
    if (!inView) return undefined;
    const t = setInterval(() => setLi((n) => (n + 1) % langs.length), 5200);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div className="att-captions" ref={ref}>
      <div className="att-captions__video" aria-hidden="true">
        <span className="att-captions__live mono">● Live · Zoom</span>
        <span className="att-captions__teacher" />
      </div>
      <button
        type="button"
        className="att-captions__caption"
        onClick={() => {
          setLi((n) => (n + 1) % langs.length);
          play("tick");
        }}
        aria-label="Change caption language"
        lang={lang.id}
      >
        {/* Keyed by language so each caption starts typing from its first character. */}
        <Typewriter key={lang.id} text={lang.text} run={inView && !calm} />
        <i className="att-captions__cursor" aria-hidden="true" />
      </button>
      <ul className="att-captions__langs" role="tablist" aria-label="Caption language">
        {langs.map((l, n) => (
          <li key={l.id} role="presentation">
            <button type="button" role="tab" aria-selected={n === li} className={n === li ? "is-on" : ""} onClick={() => setLi(n)} lang={l.id}>
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Reveals `text` one character per ~28 ms while `run` is true; shows it whole otherwise.
function Typewriter({ text, run }: { text: string; run: boolean }) {
  const [typed, setTyped] = useState(0);
  const count = useRef(0);
  useEffect(() => {
    if (!run) return undefined;
    let raf = 0;
    let last = 0;
    const step = (now: number) => {
      if (now - last > 28) {
        last = now;
        count.current = Math.min(text.length, count.current + 1);
        setTyped(count.current);
      }
      if (count.current < text.length) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, text]);
  return <>{run ? text.slice(0, typed) : text}</>;
}
