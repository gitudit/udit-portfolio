// Interface sounds synthesised with the Web Audio API: zero bytes to download, off by default.
// The AudioContext is created lazily on first use after a user gesture.
import { getState } from "./store";

export type SoundName = "tick" | "pop" | "close" | "stamp" | "chime" | "unlock" | "whoosh-up" | "whoosh-down" | "type";

interface ToneOpts {
  type?: OscillatorType;
  from?: number;
  to?: number;
  dur?: number;
  gain?: number;
  attack?: number;
  delay?: number;
}
interface NoiseOpts {
  dur?: number;
  from?: number;
  to?: number;
  gain?: number;
  delay?: number;
}

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function ensure(): AudioContext | null {
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);
  return ctx;
}

function tone({ type = "sine", from = 440, to = from, dur = 0.08, gain = 1, attack = 0.004, delay = 0 }: ToneOpts): void {
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t0);
  if (to !== from) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(master);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

function noise({ dur = 0.3, from = 400, to = 2400, gain = 0.6, delay = 0 }: NoiseOpts): void {
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + delay;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 0.9;
  f.frequency.setValueAtTime(from, t0);
  f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(master);
  src.start(t0);
}

const sounds: Record<SoundName, () => void> = {
  tick: () => tone({ type: "sine", from: 880, dur: 0.05, gain: 0.5 }),
  pop: () => tone({ type: "sine", from: 520, to: 920, dur: 0.09, gain: 0.7 }),
  close: () => tone({ type: "sine", from: 720, to: 380, dur: 0.09, gain: 0.5 }),
  stamp: () => {
    tone({ type: "triangle", from: 150, to: 80, dur: 0.14, gain: 1 });
    noise({ dur: 0.08, from: 1200, to: 300, gain: 0.5 });
  },
  chime: () => {
    tone({ type: "sine", from: 660, dur: 0.18, gain: 0.6 });
    tone({ type: "sine", from: 990, dur: 0.22, gain: 0.45, delay: 0.09 });
  },
  unlock: () => {
    [523, 659, 784, 1046].forEach((f, i) => tone({ type: "triangle", from: f, dur: 0.16, gain: 0.5, delay: i * 0.07 }));
  },
  "whoosh-up": () => noise({ dur: 0.45, from: 300, to: 2600, gain: 0.5 }),
  "whoosh-down": () => noise({ dur: 0.45, from: 2600, to: 300, gain: 0.5 }),
  type: () => tone({ type: "square", from: 1200, dur: 0.02, gain: 0.08 }),
};

export function play(name: SoundName): void {
  if (typeof window === "undefined") return;
  if (!getState().sound) return;
  try {
    const c = ensure();
    if (c && c.state === "suspended") void c.resume();
    sounds[name]();
  } catch {
    /* audio blocked */
  }
}

/** Called from the sound toggle so the context is created inside a user gesture. */
export function primeAudio(): void {
  try {
    const c = ensure();
    if (c && c.state === "suspended") void c.resume();
  } catch {
    /* ignore */
  }
}
