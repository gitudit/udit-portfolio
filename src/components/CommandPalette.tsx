import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { lands, person, stations } from "../content/ride";
import { getState, openPalette, openMap, openTerminal, toggleSound, toggleCalm, setExpress, unlock } from "../lib/store";
import { toggleTheme } from "../lib/theme";
import { useDialogFocus } from "../lib/hooks";
import { play, primeAudio } from "../lib/sound";
import { burst } from "../lib/confetti";

interface Action {
  id: string;
  group: string;
  label: string;
  hint: string;
  keys: string;
  run: () => void;
}

function scrollToId(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildActions(): Action[] {
  return [
    ...stations.map<Action>((s) => ({
      id: "go-" + s.id,
      group: "Board",
      label: `Board at ${s.name}`,
      hint: `${s.years} · ${lands.find((l) => l.id === s.land)?.name ?? ""}`,
      keys: `${s.name} ${s.title} ${s.place} ${s.year} ${s.land} ${s.kind}`,
      run: () => scrollToId("stop-" + s.id),
    })),
    { id: "midway", group: "Midway", label: "The Carousel: skills", hint: "what I ride with", keys: "skills stack tools technologies", run: () => scrollToId("midway") },
    { id: "projects", group: "Midway", label: "Side attractions: projects", hint: "open source", keys: "projects github code work", run: () => scrollToId("projects") },
    { id: "map", group: "Park", label: "Open the park map", hint: "M", keys: "map lands where am i navigate", run: () => openMap(true) },
    { id: "resume", group: "Gift shop", label: "Boarding pass (résumé)", hint: "opens Drive", keys: "resume cv pdf", run: () => void window.open(person.resume, "_blank", "noopener") },
    { id: "email", group: "Gift shop", label: "Copy email", hint: person.email, keys: "mail contact", run: () => void navigator.clipboard?.writeText(person.email) },
    { id: "exit", group: "Gift shop", label: "Exit through the gift shop", hint: "contact", keys: "contact footer end", run: () => scrollToId("exit") },
    { id: "theme", group: "Park", label: "Switch day / night", hint: "wipe", keys: "theme dark light", run: () => void toggleTheme(document.querySelector(".topbar .iconbtn")) },
    {
      id: "sound",
      group: "Park",
      label: getState().sound ? "Sound off" : "Sound on",
      hint: "interface sounds",
      keys: "audio mute",
      run: () => {
        primeAudio();
        toggleSound();
      },
    },
    { id: "calm", group: "Park", label: getState().calm ? "Calm ride off" : "Calm ride on", hint: "reduce motion", keys: "motion reduce accessibility", run: () => void toggleCalm() },
    {
      id: "express",
      group: "Park",
      label: "Express pass",
      hint: "the ride drives itself",
      keys: "auto scroll konami",
      run: () => {
        if (unlock("konami")) play("unlock");
        burst();
        setExpress(true);
      },
    },
    { id: "terminal", group: "Park", label: "Open terminal", hint: "~", keys: "cli shell", run: () => openTerminal(true) },
    { id: "top", group: "Park", label: "Back to the gate", hint: "top", keys: "home start", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  ];
}

export default function CommandPalette() {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  useDialogFocus(inputRef);

  const needle = q.trim().toLowerCase();
  const all = buildActions();
  const actions = needle ? all.filter((x) => (x.label + " " + x.keys + " " + x.group).toLowerCase().includes(needle)) : all;
  const active = Math.min(idx, Math.max(0, actions.length - 1));

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (a: Action) => {
    openPalette(false);
    play("tick");
    setTimeout(() => a.run(), 10);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx(Math.min(actions.length - 1, active + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx(Math.max(0, active - 1));
    } else if (e.key === "Enter") {
      const a = actions[active];
      if (a) {
        e.preventDefault();
        run(a);
      }
    }
  };

  return (
    <div className="overlay overlay--top" onClick={() => openPalette(false)}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette__input">
          <span className="mono muted" aria-hidden="true">
            ›
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            onKeyDown={onKey}
            placeholder="Board a station, open the map, switch theme…"
            aria-label="Search actions"
            aria-controls="palette-list"
            aria-activedescendant={actions[active] ? "palette-" + actions[active].id : undefined}
            role="combobox"
            aria-expanded="true"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="kbd">esc</span>
        </div>
        <ul className="palette__list" id="palette-list" ref={listRef} role="listbox">
          {actions.map((a, i) => (
            <li key={a.id} id={"palette-" + a.id} role="option" aria-selected={i === active} className={i === active ? "is-active" : ""} onMouseEnter={() => setIdx(i)} onClick={() => run(a)}>
              <span className="palette__group mono">{a.group}</span>
              <span className="palette__label">{a.label}</span>
              <span className="palette__hint mono muted">{a.hint}</span>
            </li>
          ))}
          {!actions.length && <li className="palette__empty muted">Nothing on this line. Try “board”, “map” or “night”.</li>}
        </ul>
        <div className="palette__foot mono muted">
          <span>↑↓ move</span>
          <span>↵ run</span>
          <span>M map</span>
          <span>~ terminal</span>
        </div>
      </div>
    </div>
  );
}
