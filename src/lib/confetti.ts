// A short confetti burst on a throwaway canvas. Used when the ticket is fully stamped and for the express pass.
import { prefersCalm } from "./hooks";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  vr: number;
  col: string;
  life: number;
}

export function burst(originX?: number, originY?: number): void {
  if (typeof document === "undefined" || prefersCalm()) return;
  const c = document.createElement("canvas");
  c.setAttribute("aria-hidden", "true");
  Object.assign(c.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "200" });
  document.body.appendChild(c);
  const dpr = Math.min(1.5, window.devicePixelRatio || 1);
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  const ctx = c.getContext("2d");
  if (!ctx) {
    c.remove();
    return;
  }
  ctx.scale(dpr, dpr);
  const styles = getComputedStyle(document.documentElement);
  const colors = [styles.getPropertyValue("--accent").trim(), styles.getPropertyValue("--ink").trim(), styles.getPropertyValue("--accent-2").trim(), "#ffffff"];
  const ox = originX ?? innerWidth / 2;
  const oy = originY ?? innerHeight * 0.4;
  const parts: Particle[] = Array.from({ length: 140 }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 6 + Math.random() * 9;
    return {
      x: ox,
      y: oy,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 6,
      r: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      col: colors[(Math.random() * colors.length) | 0] ?? "#ffffff",
      life: 1,
    };
  });
  const t0 = performance.now();
  const frame = (now: number) => {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of parts) {
      p.vy += 0.35;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life = Math.max(0, 1 - t / 1.6);
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
      ctx.restore();
    }
    if (t < 1.6) requestAnimationFrame(frame);
    else c.remove();
  };
  requestAnimationFrame(frame);
}
