import { useEffect, useState } from "react";
import { stations } from "../content/ride";
import { useStore } from "../lib/store";

// The ticket: sticky under the top bar while the ride is on screen. Progress is driven by CSS
// (named scroll timeline from the Line) with a JS fallback variable set by the Line.
// It slides away at the terminus, where the ticket is "collected".
export default function Hud() {
  const { current, stamps } = useStore((s) => ({ current: s.current, stamps: s.stamps }));
  const [away, setAway] = useState(false);
  const st = stations[current] ?? stations[0];

  useEffect(() => {
    const exit = document.getElementById("exit");
    if (!exit || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(([e]) => setAway(!!e && e.isIntersecting), { rootMargin: "-25% 0px 0px 0px", threshold: 0 });
    io.observe(exit);
    return () => io.disconnect();
  }, []);

  if (!st) return null;
  return (
    <div className={"hud" + (away ? " hud--away" : "")} role="status" aria-live="polite" aria-atomic="true">
      <div className="wrap hud__ticket">
        <div className="hud__stub">
          <span className="hud__admit">Admit one</span>
          <span className="hud__ride">The Ride</span>
        </div>
        <div className="hud__year display">{st.year}</div>
        <div className="hud__where">
          <span className="hud__station">{st.name}</span>
          <span className="hud__place">{st.place}</span>
        </div>
        <ol className="hud__stamps" aria-label={`${stamps.length} of ${stations.length} stations stamped`}>
          {stations.map((s) => (
            <li key={s.id} className={stamps.includes(s.id) ? "is-stamped" : ""} title={s.name}>
              <span className="sr-only">{s.name}</span>
            </li>
          ))}
        </ol>
        <div className="hud__progress" aria-hidden="true">
          <i />
        </div>
      </div>
    </div>
  );
}
