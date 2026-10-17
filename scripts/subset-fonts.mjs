// Regenerates the self-hosted WOFF2 fonts in src/assets/fonts from the originals in tools/fonts-src.
// Run with `npm run fonts:subset` after changing the logo text or adding an icon (add its codepoint below
// and its CSS rule in src/styles/icons.css).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "tools", "fonts-src");
const OUT = path.join(root, "src", "assets", "fonts");

const rangeText = (ranges) => {
  let s = "";
  for (const [a, b] of ranges) for (let c = a; c <= b; c++) s += String.fromCodePoint(c);
  return s;
};
const codepoints = (list) => list.map((c) => String.fromCodePoint(c)).join("");

const LOGO_TEXT = "Udit Singh"; // must match greeting.username in src/portfolio.js

const jobs = [
  // Body font: Basic Latin, Latin-1, Latin Extended-A, general punctuation, currency, ™, arrows.
  ["Montserrat-Regular.ttf", "Montserrat-Regular.woff2", rangeText([[0x20, 0x7e], [0xa0, 0x17f], [0x2000, 0x206f], [0x20a0, 0x20cf], [0x2122, 0x2122], [0x2190, 0x21ff]])],
  // Logo font: only the glyphs the logo renders.
  ["Agustina.woff", "Agustina.woff2", LOGO_TEXT],
  // Font Awesome 5.13.0 brands: js react sass html5 node google linkedin-in github kaggle hackerrank
  ["fa-brands-400.woff2", "fa-brands-400.woff2", codepoints([0xf3b8, 0xf41b, 0xf41e, 0xf13b, 0xf419, 0xf1a0, 0xf0e1, 0xf09b, 0xf5fa, 0xf5f7])],
  // Font Awesome 5.13.0 solid: database quote-left map-marker hand-point-up
  ["fa-solid-900.woff2", "fa-solid-900.woff2", codepoints([0xf1c0, 0xf10d, 0xf041, 0xf0a6])],
  // font-mfizz 2.4.1: aws git mongodb redis
  ["font-mfizz.ttf", "font-mfizz.woff2", codepoints([0xf107, 0xf12a, 0xf152, 0xf170])],
];

for (const [input, output, text] of jobs) {
  const buf = fs.readFileSync(path.join(SRC, input));
  const out = await subsetFont(buf, text, { targetFormat: "woff2" });
  fs.writeFileSync(path.join(OUT, output), out);
  console.log(`${output.padEnd(28)} ${String(buf.length).padStart(7)} -> ${String(out.length).padStart(6)} bytes`);
}
