// Build-time pre-render: injects the server-rendered app markup into build/index.html so the first
// paint does not wait for JavaScript, and inlines the stylesheet. Runs after `vite build` and the SSR build.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ssrDir = path.join(root, ".ssr-build");
const buildDir = path.join(root, "build");
const htmlPath = path.join(buildDir, "index.html");

const ssrEntry = fs.readdirSync(ssrDir).find((f) => /^entry-server.*\.m?js$/.test(f));
if (!ssrEntry) throw new Error("prerender: SSR entry not found in " + ssrDir);
const { render } = await import(pathToFileURL(path.join(ssrDir, ssrEntry)).href);

let html = fs.readFileSync(htmlPath, "utf8");
const placeholder = '<div id="root"></div>';
if (!html.includes(placeholder)) throw new Error("prerender: could not find the root placeholder in build/index.html");

const appHtml = await render();
if (!appHtml || appHtml.length < 1000) throw new Error("prerender: rendered markup is suspiciously small (" + appHtml.length + " bytes)");

html = html.replace(placeholder, `<div id="root">${appHtml}</div>`);

// Inline the single stylesheet: one fewer render-blocking round trip before first paint.
html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/, (tag, href) => {
  const cssPath = path.join(buildDir, href.slice(href.lastIndexOf("/assets/") + 1));
  if (!fs.existsSync(cssPath)) return tag;
  const css = fs.readFileSync(cssPath, "utf8");
  console.log(`prerender: inlined ${path.basename(cssPath)} (${css.length} bytes)`);
  return `<style>${css}</style>`;
});

fs.writeFileSync(htmlPath, html);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: injected ${appHtml.length} bytes of markup into build/index.html`);
