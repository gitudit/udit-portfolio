// Build-time pre-render: injects the server-rendered app markup into build/index.html
// so the first paint does not wait for JavaScript. Runs after `vite build` and the SSR build.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ssrDir = path.join(root, ".ssr-build");
const htmlPath = path.join(root, "build", "index.html");

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

let html = fs.readFileSync(htmlPath, "utf8");
const placeholder = '<div id="root"></div>';
if (!html.includes(placeholder)) {
  throw new Error("prerender: could not find the root placeholder in build/index.html");
}

const appHtml = render();
if (!appHtml || appHtml.length < 1000) {
  throw new Error("prerender: rendered markup is suspiciously small (" + appHtml.length + " bytes)");
}

html = html.replace(placeholder, `<div id="root">${appHtml}</div>`);
fs.writeFileSync(htmlPath, html);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: injected ${appHtml.length} bytes of markup into build/index.html`);
