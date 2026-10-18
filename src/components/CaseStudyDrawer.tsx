import { useRef } from "react";
import { caseStudies, type CaseStudyId } from "../content/ride";
import { openDrawer } from "../lib/store";
import { useDialogFocus } from "../lib/hooks";
import { play } from "../lib/sound";
import { Close } from "./Icons";

export default function CaseStudyDrawer({ id }: { id: CaseStudyId }) {
  const cs = caseStudies[id];
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialogFocus(closeRef);
  const close = () => {
    openDrawer(null);
    play("close");
  };
  return (
    <div className="overlay" onClick={close}>
      <article className="drawer" role="dialog" aria-modal="true" aria-labelledby="cs-title" onClick={(e) => e.stopPropagation()}>
        <div className="drawer__head">
          <div>
            <p className="eyebrow">Case study · {cs.org}</p>
            <h2 id="cs-title" className="display drawer__title">
              {cs.title}
            </h2>
          </div>
          <button ref={closeRef} type="button" className="iconbtn" onClick={close} aria-label="Close">
            <Close />
          </button>
        </div>
        <section className="drawer__sec">
          <h3 className="mono">Challenge</h3>
          <p>{cs.challenge}</p>
        </section>
        <section className="drawer__sec">
          <h3 className="mono">My role</h3>
          <p>{cs.role}</p>
        </section>
        <section className="drawer__sec">
          <h3 className="mono">Decisions</h3>
          <ol className="drawer__list">
            {cs.decisions.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
        </section>
        <section className="drawer__sec">
          <h3 className="mono">Outcome</h3>
          <ul className="drawer__list drawer__list--outcome">
            {cs.outcome.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>
        <p className="drawer__lesson display">“{cs.lesson}”</p>
      </article>
    </div>
  );
}
