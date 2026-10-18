// Build-time pre-render: injects the server-rendered app markup into build/index.html
// so the first paint does not wait for JavaScript, inlines the stylesheet, and writes build/hood.json
// with asset stats that the "Open the hood" panel shows. Runs after `vite build` and the SSR build.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ssrDir = path.join(root, ".ssr-build");
const buildDir = path.join(root, "build");
const htmlPath = path.join(buildDir, "index.html");
const BASE = "/udit-portfolio/";

const ssrEntry = fs.readdirSync(ssrDir).find((f) => /^entry-server.*\.m?js$/.test(f));
if (!ssrEntry) throw new Error("prerender: SSR entry not found in " + ssrDir);
const { render } = await import(pathToFileURL(path.join(ssrDir, ssrEntry)).href);

let html = fs.readFileSync(htmlPath, "utf8");
const placeholder = '<div id="root"></div>';
if (!html.includes(placeholder)) throw new Error("prerender: could not find the root placeholder in build/index.html");

const appHtml = await render();
if (!appHtml || appHtml.length < 1000) throw new Error("prerender: rendered markup is suspiciously small (" + appHtml.length + " bytes)");

html = html.replace(placeholder, `<div id="root">${appHtml}</div>`);

// Inline the single (~9 KB gzipped) stylesheet: one fewer render-blocking round trip before first paint.
html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/, (tag, href) => {
  const cssPath = path.join(buildDir, href.startsWith(BASE) ? href.slice(BASE.length) : href);
  if (!fs.existsSync(cssPath)) return tag;
  const css = fs.readFileSync(cssPath, "utf8");
  console.log(`prerender: inlined ${path.basename(cssPath)} (${css.length} bytes)`);
  return `<style>${css}</style>`;
});

fs.writeFileSync(htmlPath, html);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: injected ${appHtml.length} bytes of markup into build/index.html`);

// ---- hood.json: what shipped
const assetsDir = path.join(buildDir, "assets");
const kb = (n) => Math.round(n / 1024);
const gz = (buf) => zlib.gzipSync(buf, { level: 6 }).length;
const totals = { js: { raw: 0, gz: 0, files: 0 }, css: { raw: 0, gz: 0, files: 0 }, fonts: { raw: 0, files: 0 }, images: { raw: 0, files: 0 }, html: { raw: 0, gz: 0 } };
const files = [];
for (const f of fs.readdirSync(assetsDir)) {
  const p = path.join(assetsDir, f);
  const buf = fs.readFileSync(p);
  const ext = path.extname(f).slice(1).toLowerCase();
  const entry = { file: f, raw: buf.length };
  if (ext === "js") {
    totals.js.raw += buf.length;
    totals.js.gz += gz(buf);
    totals.js.files++;
    entry.gz = gz(buf);
  } else if (ext === "css") {
    totals.css.raw += buf.length;
    totals.css.gz += gz(buf);
    totals.css.files++;
    entry.gz = gz(buf);
  } else if (/^(woff2?|ttf|otf)$/.test(ext)) {
    totals.fonts.raw += buf.length;
    totals.fonts.files++;
  } else if (/^(png|jpe?g|webp|avif|svg|gif)$/.test(ext)) {
    totals.images.raw += buf.length;
    totals.images.files++;
  }
  files.push(entry);
}
const htmlBuf = fs.readFileSync(htmlPath);
totals.html.raw = htmlBuf.length;
totals.html.gz = gz(htmlBuf);
const out = {
  generatedAt: new Date().toISOString(),
  totals: {
    js: { raw: kb(totals.js.raw), gz: kb(totals.js.gz), files: totals.js.files },
    css: { raw: kb(totals.css.raw), gz: kb(totals.css.gz), files: totals.css.files },
    fonts: { raw: kb(totals.fonts.raw), files: totals.fonts.files },
    images: { raw: kb(totals.images.raw), files: totals.images.files },
    html: { raw: kb(totals.html.raw), gz: kb(totals.html.gz) },
  },
  files: files.sort((a, b) => b.raw - a.raw).map((e) => ({ ...e, raw: kb(e.raw), gz: e.gz !== undefined ? kb(e.gz) : undefined })),
};
fs.writeFileSync(path.join(buildDir, "hood.json"), JSON.stringify(out));
console.log(`hood.json: js ${out.totals.js.gz} KB gz in ${out.totals.js.files} files · css ${out.totals.css.gz} KB gz · fonts ${out.totals.fonts.raw} KB · html ${out.totals.html.gz} KB gz (styles inlined)`);
