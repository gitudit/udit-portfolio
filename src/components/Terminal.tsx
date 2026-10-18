import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { person, stations, achievements } from "../content/ride";
import { getState, openTerminal, openHood, toggleSound, toggleCalm, setExpress, unlock } from "../lib/store";
import { setTheme } from "../lib/theme";
import { useDialogFocus } from "../lib/hooks";
import { play, primeAudio } from "../lib/sound";
import { burst } from "../lib/confetti";

const COMMANDS = ["help", "whoami", "ls", "cat", "stamps", "achievements", "vitals", "theme", "sound", "calm", "express", "ride", "boarding", "clear", "exit"];

interface Line {
  t: "in" | "out";
  s: string;
}

function scrollToId(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([{ t: "out", s: 'ride-os 2.0 · type "help" · press ~ to close' }]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  useDialogFocus(inputRef);

  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [lines]);

  const print = (...xs: string[]) => setLines((l) => [...l, ...xs.map<Line>((s) => ({ t: "out", s }))]);

  const exec = (raw: string) => {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    setLines((l) => [...l, { t: "in", s: raw }]);
    if (!cmd) return;
    switch (cmd.toLowerCase()) {
      case "help":
        print("commands: " + COMMANDS.join("  "));
        break;
      case "whoami":
        print(`${person.name} — ${person.tagline}`, `${person.location} · ${person.email}`);
        break;
      case "ls":
        print(...stations.map((s, i) => `${String(i).padStart(2, "0")}  ${s.id.padEnd(9)} ${s.years.padEnd(22)} ${s.name}`));
        break;
      case "cat": {
        const target = (args[0] ?? "").toLowerCase();
        const s = stations.find((x) => x.id === target);
        if (!s) print(`cat: ${target}: no such station. try "ls".`);
        else {
          print(`# ${s.title} — ${s.org} (${s.years})`, s.story, ...s.facts.map((f) => `• ${f.n} ${f.t}`));
          scrollToId("stop-" + s.id);
        }
        break;
      }
      case "stamps": {
        const st = getState().stamps;
        print(`${st.length}/${stations.length} stamped: ${st.join(", ") || "none yet"}`);
        break;
      }
      case "achievements": {
        const got = getState().achievements;
        print(...achievements.map((a) => `${got.includes(a.id) ? "[x]" : "[ ]"} ${a.title.padEnd(16)} ${got.includes(a.id) ? a.desc : ""}`));
        break;
      }
      case "vitals":
        openHood(true);
        break;
      case "theme": {
        const t = (args[0] ?? "").toLowerCase();
        if (t === "day" || t === "night") {
          setTheme(t, null);
          print(`theme → ${t}`);
        } else print("usage: theme day|night");
        break;
      }
      case "sound": {
        primeAudio();
        const want = (args[0] ?? "").toLowerCase();
        const on = getState().sound;
        if ((want === "on" && !on) || (want === "off" && on) || !want) toggleSound();
        print(`sound → ${getState().sound ? "on" : "off"}`);
        break;
      }
      case "calm":
        print(`calm ride → ${toggleCalm() ? "on" : "off"}`);
        break;
      case "express":
        if (unlock("konami")) play("unlock");
        burst();
        setExpress(true);
        openTerminal(false);
        break;
      case "ride":
        openTerminal(false);
        scrollToId("line");
        break;
      case "boarding":
        window.open(person.resume, "_blank", "noopener");
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        openTerminal(false);
        break;
      case "sudo":
        print("nice try. this ride runs as guest.");
        break;
      default:
        print(`${cmd}: command not found. try "help".`);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const v = input;
      setHist((h) => [v, ...h].slice(0, 50));
      setHi(-1);
      setInput("");
      exec(v);
      play("tick");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const m = COMMANDS.filter((c) => c.startsWith(input.toLowerCase()));
      if (m.length === 1) setInput(m[0] + " ");
      else if (m.length > 1) print(m.join("  "));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.min(hist.length - 1, hi + 1);
      setHi(n);
      const h = hist[n];
      if (h !== undefined) setInput(h);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = Math.max(-1, hi - 1);
      setHi(n);
      setInput(n === -1 ? "" : (hist[n] ?? ""));
    } else if (e.key.length === 1) {
      play("type");
    }
  };

  return (
    <div className="terminal" role="dialog" aria-label="Terminal" onClick={() => inputRef.current?.focus()}>
      <div className="terminal__bar mono">
        <span>guest@ride:~</span>
        <button type="button" className="terminal__close" onClick={() => openTerminal(false)} aria-label="Close terminal">
          ✕
        </button>
      </div>
      <div className="terminal__body" ref={bodyRef}>
        {lines.map((l, i) => (
          <div key={i} className={"terminal__line is-" + l.t}>
            {l.t === "in" ? "› " : ""}
            {l.s}
          </div>
        ))}
        <div className="terminal__prompt">
          <span aria-hidden="true">› </span>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} aria-label="Terminal input" autoComplete="off" spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
