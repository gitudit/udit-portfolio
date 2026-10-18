import { useRef } from "react";
import { lands } from "../content/ride";
import { openMap, useStore } from "../lib/store";
import { useDialogFocus } from "../lib/hooks";
import { play } from "../lib/sound";
import { Close } from "./Icons";
import { MapGraphic } from "./MapGraphic";
import { whereLabel } from "./mapData";

export default function ParkMap() {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { zone, current } = useStore((s) => ({ zone: s.zone, current: s.current }));
  useDialogFocus(closeRef);
  const close = () => {
    openMap(false);
    play("close");
  };
  return (
    <div className="overlay" onClick={close}>
      <article className="parkmap" role="dialog" aria-modal="true" aria-labelledby="map-title" onClick={(e) => e.stopPropagation()}>
        <div className="parkmap__head">
          <div>
            <p className="eyebrow">Park map · you are at {whereLabel(zone, current)}</p>
            <h2 id="map-title" className="display parkmap__title">
              Four lands. One line.
            </h2>
          </div>
          <button ref={closeRef} type="button" className="iconbtn" onClick={close} aria-label="Close">
            <Close />
          </button>
        </div>
        <div className="parkmap__board">
          <MapGraphic interactive />
        </div>
        <ol className="parkmap__legend">
          {lands.map((l) => (
            <li key={l.id} className={`parkmap__land parkmap__land--${l.id}`}>
              <i aria-hidden="true" />
              <b>
                {l.numeral} · {l.name}
              </b>
              <span className="mono muted">{l.years}</span>
            </li>
          ))}
        </ol>
        <p className="parkmap__hint mono muted">Tap a pin to board that stop · the car follows your scroll</p>
      </article>
    </div>
  );
}
