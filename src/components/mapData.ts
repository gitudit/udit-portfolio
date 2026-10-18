import { stations, type LandId } from "../content/ride";
import type { Zone } from "../lib/store";

// One winding ride path through four lands, in an 800 x 340 map. Pins and the "you are here" car sit
// on the same path with CSS motion paths (offset-path), so geometry lives in exactly one string.
export const MAP_D = "M 40 300 C 100 300, 110 235, 160 232 S 250 270, 300 240 S 380 150, 440 160 S 520 110, 580 110 S 660 150, 700 120 S 740 70, 770 70";

export type LabelSide = "above" | "below";
export type LabelAnchor = "start" | "middle" | "end";

export interface Pin {
  id: string;
  p: number;
  label: string;
  sub: string;
  land: LandId | "gate" | "exit";
  target: string;
  /** Where the label sits so neighbouring pins never collide. */
  side: LabelSide;
  anchor: LabelAnchor;
}

// Label placement per stop, chosen by hand against the path geometry.
const PLACE: Record<string, [LabelSide, LabelAnchor]> = {
  gate: ["below", "start"],
  gwalior: ["below", "middle"],
  byjus: ["above", "middle"],
  altair: ["below", "middle"],
  scaler: ["above", "middle"],
  cerebry: ["below", "middle"],
  cars24: ["above", "middle"],
  leena: ["below", "middle"],
  midway: ["above", "middle"],
  exit: ["above", "end"],
};
const place = (id: string): { side: LabelSide; anchor: LabelAnchor } => {
  const [side, anchor] = PLACE[id] ?? ["below", "middle"];
  return { side, anchor };
};

export const STATION_P = [0.09, 0.2, 0.3, 0.4, 0.56, 0.67, 0.78] as const;

export const pins: readonly Pin[] = [
  { id: "gate", p: 0, label: "Gate", sub: "Admit one", land: "gate", target: "top", ...place("gate") },
  ...stations.map<Pin>((s, i) => ({ id: s.id, p: STATION_P[i] ?? 0.5, label: s.name, sub: s.year, land: s.land, target: "stop-" + s.id, ...place(s.id) })),
  { id: "midway", p: 0.9, label: "The Midway", sub: "play", land: "midway", target: "midway", ...place("midway") },
  { id: "exit", p: 1, label: "Gift shop", sub: "exit", land: "exit", target: "exit", ...place("exit") },
];

export const LAND_BLOBS: Record<LandId, { cx: number; cy: number; rx: number; ry: number }> = {
  campus: { cx: 150, cy: 250, rx: 100, ry: 56 },
  training: { cx: 320, cy: 232, rx: 120, ry: 62 },
  thrill: { cx: 560, cy: 125, rx: 150, ry: 66 },
  midway: { cx: 712, cy: 108, rx: 72, ry: 56 },
};

export function markerProgress(zone: Zone, current: number): number {
  if (zone === "gate") return 0;
  if (zone === "midway") return 0.9;
  if (zone === "exit") return 1;
  return STATION_P[current] ?? 0;
}

export function whereLabel(zone: Zone, current: number): string {
  if (zone === "gate") return "At the gate";
  if (zone === "midway") return "The Midway";
  if (zone === "exit") return "Gift shop";
  return stations[current]?.name ?? "On the line";
}
