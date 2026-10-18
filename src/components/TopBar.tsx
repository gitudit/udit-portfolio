import { useRef } from "react";
import { person } from "../content/ride";
import { useStore, toggleSound, toggleCalm, openPalette } from "../lib/store";
import { toggleTheme } from "../lib/theme";
import { play, primeAudio } from "../lib/sound";
import { Sun, Moon, SoundOn, SoundOff, Calm, Command, Ticket } from "./Icons";

export default function TopBar() {
  const { sound, calm } = useStore((s) => ({ sound: s.sound, calm: s.calm }));
  const themeBtn = useRef<HTMLButtonElement>(null);

  return (
    <header className="topbar">
      <div className="wrap topbar__row">
        <a className="topbar__brand" href="#top" title="Back to the gate">
          <span className="topbar__mark" aria-hidden="true">
            US
          </span>
          <span className="topbar__name">
            Udit Singh <b>/ The Ride</b>
          </span>
        </a>
        <nav className="topbar__nav" aria-label="Ride">
          <a href="#line">Board</a>
          <a href="#exit">Exit</a>
        </nav>
        <div className="topbar__controls">
          <button ref={themeBtn} type="button" className="iconbtn" onClick={() => toggleTheme(themeBtn.current)} aria-label="Switch between day and night" title="Day / Night">
            <span className="only-day">
              <Moon />
            </span>
            <span className="only-night">
              <Sun />
            </span>
          </button>
          <button
            type="button"
            className="iconbtn"
            aria-pressed={sound}
            onClick={() => {
              primeAudio();
              const on = toggleSound();
              if (on) setTimeout(() => play("chime"), 30);
            }}
            aria-label={sound ? "Turn interface sounds off" : "Turn interface sounds on"}
            title={sound ? "Sound on" : "Sound off"}
          >
            {sound ? <SoundOn /> : <SoundOff />}
          </button>
          <button
            type="button"
            className="iconbtn"
            aria-pressed={calm}
            onClick={() => {
              toggleCalm();
              play("tick");
            }}
            aria-label="Calm ride: reduce motion"
            title="Calm ride"
          >
            <Calm />
          </button>
          <button
            type="button"
            className="btn btn--ghost topbar__cmd"
            onClick={() => {
              openPalette(true);
              play("pop");
            }}
            aria-keyshortcuts="Meta+K Control+K"
            title="Command palette"
          >
            <Command />
            <span className="sr-only">Command palette</span>
            <span className="topbar__cmdlabel">
              <span className="kbd">⌘</span>
              <span className="kbd">K</span>
            </span>
          </button>
          <a className="btn btn--primary topbar__resume" href={person.resume} target="_blank" rel="noreferrer noopener" aria-label="Boarding pass: open the résumé">
            <Ticket />
            <span>Boarding pass</span>
          </a>
        </div>
      </div>
    </header>
  );
}
