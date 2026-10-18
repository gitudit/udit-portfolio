import { useEffect, useRef, useState } from "react";
import { unlock } from "../lib/store";
import { play } from "../lib/sound";
import { burst } from "../lib/confetti";

// The height check between the internships and the full-time rides. The stamp slams on when it
// reaches the middle of the screen; the first time, it unlocks the Fast pass achievement with confetti.
export default function FastPass() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        setOn(true);
        if (unlock("fastpass")) {
          play("unlock");
          const r = el.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 2);
        }
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={"fastpass" + (on ? " is-on" : "")} role="note" aria-label="Height check passed. Full-time access granted.">
      <div className="fastpass__lines" aria-hidden="true" />
      <div className="fastpass__board">
        <p className="fastpass__eyebrow mono">Height check · end of the Training Track</p>
        <p className="display fastpass__title">You’re tall enough now.</p>
        <p className="fastpass__sub">Full-time access granted. From here the coasters get bigger, the riders number in millions, and the brakes stay off quality.</p>
      </div>
      <div className="fastpass__stamp display" aria-hidden="true">
        <span>All</span>
        <span>access</span>
      </div>
    </div>
  );
}
