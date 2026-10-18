import { useEffect, useState } from "react";
import { landOf, passLabel, stations } from "../content/ride";
import { useStore } from "../lib/store";

// The ticket: sticky under the top bar while the ride is on screen. The pass upgrades from guest to
// intern to all-access as the car moves through the lands, and the ticket is collected at the terminus.
export default function Hud() {
  const { current, stamps } = useStore((s) => ({ current: s.current, stamps: s.stamps }));
  const [away, setAway] = useState(false);
  const st = stations[current] ?? stations[0];

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const targets = ["midway", "exit"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target);
          else seen.delete(e.target);
        }
        setAway(seen.size > 0);
      },
      { rootMargin: "-25% 0px 0px 0px", threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (!st) return null;
  const land = landOf(st.land);
  return (
    <div className={`hud hud--${st.kind}` + (away ? " hud--away" : "")} role="status" aria-live="polite" aria-atomic="true">
      <div className="wrap hud__ticket">
        <div className="hud__stub">
          <span className="hud__admit">{passLabel[st.kind]}</span>
          <span className="hud__ride">{land.name}</span>
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
