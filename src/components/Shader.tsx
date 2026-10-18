import { useEffect, useRef } from "react";
import { prefersCalm } from "../lib/hooks";

// One domain-warped noise shader in the brand palette, rendered at half resolution,
// paused when off-screen or hidden, capped near 30 fps, skipped on software GL, and never started
// under calm ride or reduced motion.
const FRAG = `
precision mediump float;
uniform vec2 u_res; uniform float u_time; uniform vec3 u_c1; uniform vec3 u_c2; uniform vec3 u_c3;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / u_res; vec2 p = uv * vec2(u_res.x / u_res.y, 1.0) * 1.5; float t = u_time * 0.045;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.6*q + vec2(1.7, 9.2) + 0.15*t), fbm(p + 3.6*q + vec2(8.3, 2.8) + 0.126*t));
  float f = fbm(p + 3.4*r);
  vec3 col = mix(u_c1, u_c2, clamp(f*f*2.4, 0.0, 1.0));
  col = mix(col, u_c3, clamp(length(q) * 0.75, 0.0, 1.0) * 0.42);
  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  gl_FragColor = vec4(col * mix(0.86, 1.0, vig), 1.0);
}`;
const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

// Resolve a design token to RGB through a hidden probe element, so any CSS colour syntax (hex,
// rgb(), color-mix()) comes back as the browser computes it: "rgb(r, g, b)" or "color(srgb r g b)".
function cssColor(probe: HTMLElement, name: string): [number, number, number] {
  probe.style.backgroundColor = `var(${name})`;
  const v = getComputedStyle(probe).backgroundColor;
  const rgb = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(v);
  if (rgb) return [Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255];
  const srgb = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(v);
  if (srgb) return [Number(srgb[1]), Number(srgb[2]), Number(srgb[3])];
  return [0.5, 0.5, 0.5];
}

export default function Shader() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return undefined;
    // Software GL (SwiftShader, llvmpipe, headless audits) would burn the main thread for a backdrop;
    // keep the CSS gradient instead. ANGLE reports SwiftShader with "Google" as the GPU vendor.
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    const bail = () => {
      // Hide the canvas so the CSS backdrop shows through; React still owns and unmounts the node.
      canvas.style.display = "none";
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return undefined;
    };
    if (/swiftshader|llvmpipe|software|basic render|angle [(]google/i.test(renderer)) return bail();
    const sh = (type: number, src: string): WebGLShader | null => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!prog || !vs || !fs) return undefined;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return undefined;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uC = [1, 2, 3].map((i) => gl.getUniformLocation(prog, "u_c" + i));

    const probe = document.createElement("i");
    probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    const setColors = () => {
      gl.uniform3fv(uC[0] ?? null, cssColor(probe, "--bg"));
      gl.uniform3fv(uC[1] ?? null, cssColor(probe, "--bg-2"));
      gl.uniform3fv(uC[2] ?? null, cssColor(probe, "--accent"));
    };
    const resize = () => {
      const scale = 0.5;
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let raf = 0;
    let running = false;
    let visible = true;
    const start = performance.now();
    let lastDraw = 0;
    const frame = () => {
      const now = performance.now();
      // ~30 fps is plenty for a slow domain warp and halves the GPU and battery cost.
      if (running && now - lastDraw < 31) {
        raf = requestAnimationFrame(frame);
        return;
      }
      lastDraw = now;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (running && !prefersCalm()) raf = requestAnimationFrame(frame);
      else running = false;
    };
    const run = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    setColors();
    resize();
    // Adaptive quality: time the first frame with a pipeline flush. A real GPU draws this in a few
    // milliseconds; anything slower stays on the static CSS gradient rather than stealing main-thread time.
    const t0 = performance.now();
    frame();
    gl.finish();
    if (performance.now() - t0 > 24) {
      stop();
      return bail();
    }
    run();

    const io = new IntersectionObserver(([e]) => {
      visible = !!e && e.isIntersecting;
      if (visible) run();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) frame();
    });
    ro.observe(canvas);
    const onTheme = () => {
      setColors();
      if (!running) frame();
    };
    window.addEventListener("ride:theme", onTheme);
    const onCalm = new MutationObserver(() => (prefersCalm() ? stop() : run()));
    onCalm.observe(document.documentElement, { attributes: true, attributeFilter: ["data-calm"] });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      onCalm.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("ride:theme", onTheme);
      probe.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);
  return <canvas ref={ref} className="hero__shader" aria-hidden="true" />;
}
