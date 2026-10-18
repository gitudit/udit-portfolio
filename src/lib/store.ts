// Tiny external store for UI state that several components share.
// Server and first client render use `initial`; persisted values are applied in an effect (see hydrateStore).
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";
import { achievements as achievementList, isAchievementId, isStationId, type AchievementId, type CaseStudyId, type StationId } from "../content/ride";

export interface Toast {
  id: number;
  title: string;
  desc: string;
}

/** Which part of the park is at the centre of the viewport. */
export type Zone = "gate" | "ride" | "midway" | "exit";

export interface RideState {
  sound: boolean;
  calm: boolean;
  /** Station ids reached. */
  stamps: StationId[];
  /** Achievement ids unlocked. */
  achievements: AchievementId[];
  toasts: Toast[];
  mapOpen: boolean;
  paletteOpen: boolean;
  terminalOpen: boolean;
  /** Case study open in the drawer. */
  drawer: CaseStudyId | null;
  /** Station index at the car. */
  current: number;
  zone: Zone;
  /** Konami / express auto-ride. */
  express: boolean;
  hydrated: boolean;
}

type Patch = Partial<RideState>;
type Listener = () => void;

const initial: RideState = {
  sound: false,
  calm: false,
  stamps: [],
  achievements: [],
  toasts: [],
  mapOpen: false,
  paletteOpen: false,
  terminalOpen: false,
  drawer: null,
  current: 0,
  zone: "gate",
  express: false,
  hydrated: false,
};

let state: RideState = initial;
const listeners = new Set<Listener>();
const PERSIST = ["sound", "calm", "stamps", "achievements"] as const;

function emit(): void {
  for (const l of listeners) l();
}

export function getState(): RideState {
  return state;
}
const getServerState = (): RideState => initial;

export function setState(partial: Patch | ((s: RideState) => Patch)): void {
  const next = typeof partial === "function" ? partial(state) : partial;
  state = { ...state, ...next };
  emit();
  persist(next);
}

function persist(changed: Patch): void {
  if (typeof localStorage === "undefined" || !state.hydrated) return;
  try {
    for (const k of PERSIST) if (k in changed) localStorage.setItem("ride:" + k, JSON.stringify(state[k]));
  } catch {
    /* storage unavailable */
  }
}

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : (JSON.parse(raw) as unknown);
  } catch {
    return undefined;
  }
}

/** Apply persisted values after mount so the first client render matches the pre-rendered HTML. */
export function hydrateStore(): void {
  if (typeof localStorage === "undefined") return;
  const next: Patch = { hydrated: true };
  const sound = readJson("ride:sound");
  if (typeof sound === "boolean") next.sound = sound;
  const calm = readJson("ride:calm");
  if (calm === true || calm === 1 || calm === "1") next.calm = true;
  const stamps = readJson("ride:stamps");
  if (Array.isArray(stamps)) next.stamps = stamps.filter(isStationId);
  const unlocked = readJson("ride:achievements");
  if (Array.isArray(unlocked)) next.achievements = unlocked.filter(isAchievementId);
  if (next.calm) document.documentElement.dataset.calm = "1";
  setState(next);
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function shallowEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  const ka = Object.keys(a) as (keyof T)[];
  if (ka.length !== Object.keys(b).length) return false;
  for (const k of ka) if (!Object.is(a[k], b[k])) return false;
  return true;
}

/**
 * Read a slice of the store. Selectors may return fresh objects; the selector shim memoises the
 * result and compares with `isEqual` so React sees a stable snapshot.
 */
export function useStore<T>(selector: (s: RideState) => T, isEqual: (a: T, b: T) => boolean = shallowEqual): T {
  return useSyncExternalStoreWithSelector(subscribe, getState, getServerState, selector, isEqual);
}

// ---- actions

let toastSeq = 0;
export function toast(title: string, desc: string): void {
  const id = ++toastSeq;
  // At most two on screen: the oldest makes room, so a burst of achievements never buries the page.
  setState((s) => ({ toasts: [...s.toasts.slice(-1), { id, title, desc }] }));
  setTimeout(() => dismissToast(id), 4200);
}
export function dismissToast(id: number): void {
  setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
}

/** Unlock an achievement. Returns true when it was newly unlocked. */
export function unlock(id: AchievementId): boolean {
  if (state.achievements.includes(id)) return false;
  const a = achievementList.find((x) => x.id === id);
  setState((s) => ({ achievements: [...s.achievements, id] }));
  if (a) toast("Achievement · " + a.title, a.desc);
  return true;
}

/** Stamp a station. Returns true when it was newly stamped. */
export function stamp(stationId: StationId, total: number): boolean {
  if (state.stamps.includes(stationId)) return false;
  const stamps = [...state.stamps, stationId];
  setState({ stamps });
  if (stamps.length >= total) unlock("all-stops");
  return true;
}

/** Toggle interface sounds. Returns the new value. */
export function toggleSound(): boolean {
  setState((s) => ({ sound: !s.sound }));
  return state.sound;
}

/** Toggle calm ride (reduced motion). Returns the new value. */
export function toggleCalm(): boolean {
  const calm = !state.calm;
  setState({ calm });
  if (calm) document.documentElement.dataset.calm = "1";
  else delete document.documentElement.dataset.calm;
  try {
    localStorage.setItem("ride:calm", calm ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (calm) unlock("calm");
  return calm;
}

export function openMap(open = true): void {
  setState({ mapOpen: open, paletteOpen: false, terminalOpen: false });
  if (open) unlock("map");
}
export function openPalette(open = true): void {
  setState({ paletteOpen: open, terminalOpen: false });
}
export function openTerminal(open = true): void {
  setState({ terminalOpen: open, paletteOpen: false });
  if (open) unlock("terminal");
}
export function openDrawer(id: CaseStudyId | null): void {
  setState({ drawer: id, paletteOpen: false, terminalOpen: false });
}
export function closeOverlays(): void {
  setState({ mapOpen: false, paletteOpen: false, terminalOpen: false, drawer: null });
}
export function setCurrent(index: number): void {
  if (state.current !== index) setState({ current: index });
}
export function setZone(zone: Zone): void {
  if (state.zone !== zone) setState({ zone });
}
export function setExpress(on: boolean): void {
  setState({ express: on });
}
