import { useEffect, useRef, useState, type FormEvent } from "react";
import { prefersCalm } from "../../lib/hooks";
import { play } from "../../lib/sound";
import type { AttractionProps } from "./types";

export default function PlatformPanel({ active }: AttractionProps) {
  return (
    <div className="att-platform">
      <Checklist />
      <A11yDial active={active} />
      <Guard />
    </div>
  );
}

interface Item {
  t: string;
  done: boolean;
}

function Checklist() {
  const [items, setItems] = useState<Item[]>([
    { t: "Collect documents", done: true },
    { t: "Assign a buddy", done: true },
    { t: "Laptop ready on day one", done: false },
  ]);
  const [draft, setDraft] = useState("");
  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    setItems((x) => [...x, { t, done: false }]);
    setDraft("");
    play("pop");
  };
  const done = items.filter((i) => i.done).length;
  return (
    <div className="mini">
      <div className="mini__head mono">
        <span>checklist builder</span>
        <span>
          {done}/{items.length}
        </span>
      </div>
      <ul className="checklist">
        {items.map((it, i) => (
          <li key={it.t + i}>
            <label>
              <input
                type="checkbox"
                checked={it.done}
                onChange={() => {
                  setItems((x) => x.map((y, n) => (n === i ? { ...y, done: !y.done } : y)));
                  play("tick");
                }}
              />
              <span>{it.t}</span>
            </label>
          </li>
        ))}
      </ul>
      <form className="checklist__add" onSubmit={add}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a task" aria-label="New task" />
        <button type="submit" className="btn">
          Add
        </button>
      </form>
    </div>
  );
}

function A11yDial({ active }: AttractionProps) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!active || done.current) return undefined;
    done.current = true;
    const dur = prefersCalm() ? 0 : 1600; // calm ride: jump to the final value on the first frame
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
      setV(Math.round(95 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  const C = 2 * Math.PI * 44;
  return (
    <div className="mini mini--dial">
      <div className="mini__head mono">
        <span>accessibility score</span>
        <span>1M+ employees</span>
      </div>
      <svg viewBox="0 0 100 100" className="dial" role="img" aria-label={`Accessibility score ${v}`}>
        <circle cx="50" cy="50" r="44" fill="none" stroke="var(--rail)" strokeWidth="8" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="var(--ok)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(C * v) / 100} ${C}`} transform="rotate(-90 50 50)" />
        <text x="50" y="56" textAnchor="middle" className="dial__num">
          {v}
        </text>
      </svg>
    </div>
  );
}

type Role = "admin" | "viewer";

function Guard() {
  const [role, setRole] = useState<Role>("admin");
  const admin = role === "admin";
  const actions = ["Edit workflow", "Publish template", "Grant tool access"];
  return (
    <div className="mini">
      <div className="mini__head mono">
        <span>permission guard</span>
        <span>one rule, every surface</span>
      </div>
      <div className="guard__roles" role="radiogroup" aria-label="Role">
        {(["admin", "viewer"] as const).map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={role === r}
            className={role === r ? "is-on" : ""}
            onClick={() => {
              setRole(r);
              play("tick");
            }}
          >
            {r}
          </button>
        ))}
      </div>
      <ul className="guard__actions">
        {actions.map((a) => (
          <li key={a}>
            <button type="button" className="btn" disabled={!admin}>
              {admin ? "" : "🔒 "}
              {a}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
