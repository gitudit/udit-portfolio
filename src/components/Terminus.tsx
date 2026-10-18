import { useEffect, useRef, useState } from "react";
import { person, stations, achievements } from "../content/ride";
import { useStore, openMap, unlock } from "../lib/store";
import { play } from "../lib/sound";
import ContactForm from "./ContactForm";
import { BrandIcon, Mail, Ticket, MapIcon } from "./Icons";

export default function Terminus() {
  const { stamps, unlocked } = useStore((s) => ({ stamps: s.stamps, unlocked: s.achievements }));
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          if (unlock("gift-shop")) play("chime");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      play("tick");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = "mailto:" + person.email;
    }
  };

  const complete = stamps.length >= stations.length;

  return (
    <section className="terminus section" id="exit" ref={ref} aria-labelledby="exit-title">
      <div className="wrap">
        <p className="eyebrow">Terminus · exit through the gift shop</p>
        <h2 id="exit-title" className="display terminus__title">
          Thanks for riding.
        </h2>
        <p className="muted terminus__sub">Four lands, seven stops, one line. If you are hiring for a frontend engineer who treats speed and polish as the same job, the gift shop is open.</p>

        <div className="terminus__grid">
          <div className="giftshop">
            <div className={"ticketcard" + (complete ? " is-complete" : "")}>
              <div className="ticketcard__head">
                <span className="mono">Ride photo</span>
                <span className="mono">{complete ? "Fully stamped" : `${stamps.length} / ${stations.length} stamps`}</span>
              </div>
              <div className="ticketcard__name display">{person.name}</div>
              <div className="ticketcard__role">{person.tagline}</div>
              <ol className="ticketcard__stamps" aria-label="Station stamps">
                {stations.map((s) => (
                  <li key={s.id} className={stamps.includes(s.id) ? "is-stamped" : ""}>
                    <span>{s.name}</span>
                  </li>
                ))}
              </ol>
              <div className="ticketcard__actions">
                <a className="btn btn--primary" href={person.resume} target="_blank" rel="noreferrer noopener">
                  <Ticket /> Boarding pass (résumé)
                </a>
                <button type="button" className="btn" onClick={() => void copyEmail()} aria-live="polite">
                  <Mail /> {copied ? "Copied" : "Copy email"}
                </button>
              </div>
            </div>

            <ul className="socials" aria-label="Elsewhere">
              {person.socials.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noreferrer noopener" className="social">
                    <BrandIcon id={s.id} />
                    <span className="social__label">{s.label}</span>
                    <span className="social__handle mono">{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="achievements">
              <div className="achievements__head">
                <span className="eyebrow">Achievements</span>
                <span className="mono muted">
                  {unlocked.length} / {achievements.length}
                </span>
              </div>
              <ul>
                {achievements.map((a) => (
                  <li key={a.id} className={unlocked.includes(a.id) ? "is-unlocked" : ""}>
                    <b>{a.title}</b>
                    <span>{unlocked.includes(a.id) ? a.desc : "Locked"}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ContactForm />
        </div>

        <footer className="footer">
          <div className="footer__row">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                openMap(true);
                play("pop");
              }}
            >
              <MapIcon /> Park map
            </button>
            <a className="btn btn--ghost" href="#top">
              Back to the gate
            </a>
          </div>
          <p className="mono muted">
            © {new Date().getFullYear()} Udit Singh · {person.location}
          </p>
        </footer>
      </div>
    </section>
  );
}
