import type { KeyboardEvent } from "react";
import { lands } from "../content/ride";
import { openMap, useStore } from "../lib/store";
import { play } from "../lib/sound";
import { LAND_BLOBS, MAP_D, markerProgress, pins, whereLabel } from "./mapData";

function scrollToId(id: string): void {
  if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
  else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}


export function MapGraphic({ interactive = false }: { interactive?: boolean }) {
  const { zone, current } = useStore((s) => ({ zone: s.zone, current: s.current }));
  const p = markerProgress(zone, current);

  const board = (target: string) => {
    openMap(false);
    play("tick");
    setTimeout(() => scrollToId(target), 10);
  };
  const onKey = (e: KeyboardEvent<SVGGElement>, target: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      board(target);
    }
  };

  return (
    <svg className={"map" + (interactive ? " map--full" : " map--mini")} viewBox="0 0 800 340" role={interactive ? "group" : "img"} aria-label={interactive ? "Park map" : `Park map, you are at ${whereLabel(zone, current)}`}>
      {lands.map((l) => {
        const b = LAND_BLOBS[l.id];
        return <ellipse key={l.id} className={`map__land map__land--${l.id}`} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} />;
      })}
      {interactive &&
        lands.map((l) => {
          const b = LAND_BLOBS[l.id];
          return (
            <text key={l.id} className="map__landname" x={b.cx} y={l.id === "midway" ? b.cy + b.ry - 4 : b.cy - b.ry + 4} textAnchor="middle">
              {l.numeral} · {l.name}
            </text>
          );
        })}
      <path d={MAP_D} className="map__track" pathLength={1} />
      <path d={MAP_D} className="map__lit" pathLength={1} style={{ strokeDasharray: `${p} 1` }} />
      {pins.map((pin) => (
        <g
          key={pin.id}
          className={`map__pin map__pin--${pin.land}` + (pin.p <= p ? " is-passed" : "")}
          style={{ offsetDistance: `${pin.p * 100}%` }}
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? `Board at ${pin.label}` : undefined}
          onClick={interactive ? () => board(pin.target) : undefined}
          onKeyDown={interactive ? (e) => onKey(e, pin.target) : undefined}
        >
          <circle r={interactive ? 9 : 7} className="map__pinring" />
          <circle r={interactive ? 4 : 3} className="map__pindot" />
          {interactive && (
            <text className="map__pinlabel" y={pin.land === "thrill" || pin.land === "midway" || pin.land === "exit" ? -16 : 26} textAnchor="middle">
              {pin.label}
              <tspan className="map__pinsub"> · {pin.sub}</tspan>
            </text>
          )}
        </g>
      ))}
      <g className="map__you" style={{ offsetDistance: `${p * 100}%` }}>
        <circle r={interactive ? 15 : 11} className="map__youring" />
        <circle r={interactive ? 10 : 7} className="map__youdot" />
        <text className="map__youtext" y={interactive ? 3.5 : 2.5} textAnchor="middle">
          US
        </text>
      </g>
    </svg>
  );
}

/** Corner mini-map: appears once the ride starts; tap to open the full park map. */
export function MiniMap() {
  const { zone, current } = useStore((s) => ({ zone: s.zone, current: s.current }));
  return (
    <button
      type="button"
      className={"minimap" + (zone !== "gate" ? " is-on" : "")}
      onClick={() => {
        openMap(true);
        play("pop");
      }}
      aria-label={`Park map. You are at ${whereLabel(zone, current)}. Open the full map`}
      tabIndex={zone !== "gate" ? 0 : -1}
    >
      <MapGraphic />
      <span className="minimap__row mono">
        <span className="minimap__dot" aria-hidden="true" />
        <span>You are here · {whereLabel(zone, current)}</span>
        <span className="minimap__kbd kbd" aria-hidden="true">
          M
        </span>
      </span>
    </button>
  );
}
