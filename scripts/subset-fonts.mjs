// Regenerates the self-hosted variable fonts in src/assets/fonts from the full Latin builds in
// tools/fonts-src. Keeps every glyph the site can render (ASCII, Latin-1, general punctuation,
// arrows, the geometric marks used as ornaments) plus any other character found in src/.
// Variable axes opsz / wght / SOFT are kept so the kinetic type works (Fraunces opsz trimmed to the 72–144 range in use).
//
//   node scripts/subset-fonts.mjs            → writes src/assets/fonts
//   node scripts/subset-fonts.mjs --out dir  → writes elsewhere (for comparison)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "tools", "fonts-src");
const outArg = process.argv.indexOf("--out");
const outDir = outArg > -1 && process.argv[outArg + 1] ? path.resolve(process.argv[outArg + 1]) : path.join(root, "src", "assets", "fonts");
fs.mkdirSync(outDir, { recursive: true });

// Fraunces is the display face: headings, numbers and the hero only, so it carries just ASCII plus the
// typographic punctuation those use, and only optical sizes 72–144 (the Google build has no WONK axis).
// The body and mono faces keep the full glyph set.
const DISPLAY_TEXT = Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCodePoint(0x20 + i)).join("") + "“”‘’–—−…·×€₹©";
const fonts = [
  { src: "Fraunces-latin-google.woff2", out: "Fraunces.woff2", text: DISPLAY_TEXT, variationAxes: { opsz: { min: 72, max: 144 } } },
  { src: "InstrumentSans-latin-google.woff2", out: "InstrumentSans.woff2" },
  { src: "JetBrainsMono-latin-google.woff2", out: "JetBrainsMono.woff2" },
];

// Code point ranges that are always included.
const ranges = [
  [0x20, 0x7e], // ASCII
  [0xa0, 0xff], // Latin-1 Supplement (é, ü, ©, ·, ×, …)
  [0x2010, 0x2027], // dashes, quotes, bullets, ellipsis
  [0x2030, 0x203a], // ‰ ′ ″ ‹ ›
  [0x2190, 0x2199], // arrows
  [0x2318, 0x2318], // ⌘
  [0x2500, 0x2500], // ─
  [0x25a0, 0x25cf], // geometric shapes (■ ▲ ◆ ● …)
  [0x2605, 0x2606], // ★ ☆
  [0x2713, 0x2718], // ✓ ✕ …
  [0x20b9, 0x20b9], // ₹
  [0x20ac, 0x20ac], // €
];
const always = new Set();
for (const [a, b] of ranges) for (let c = a; c <= b; c++) always.add(c);

// Plus every character that appears in the source tree (content, components, styles).
function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(tsx?|css|html|md)$/.test(e.name)) yield p;
  }
}
const found = new Set();
for (const f of [...walk(path.join(root, "src")), path.join(root, "index.html")]) {
  for (const ch of fs.readFileSync(f, "utf8")) {
    const cp = ch.codePointAt(0);
    // Skip scripts the Latin fonts cannot cover anyway (Devanagari etc.); they fall back to system fonts.
    if (cp > 0x7f && cp < 0x2000 && cp > 0x24f) continue;
    if (cp >= 0x900 && cp <= 0xdff) continue;
    found.add(cp);
  }
}
const text = String.fromCodePoint(...new Set([...always, ...found])).replace(/[\r\n\t]/g, "");

for (const f of fonts) {
  const input = fs.readFileSync(path.join(srcDir, f.src));
  const chars = f.text ?? text;
  const output = await subsetFont(input, chars, { targetFormat: "woff2", ...(f.variationAxes ? { variationAxes: f.variationAxes } : {}) });
  fs.writeFileSync(path.join(outDir, f.out), output);
  console.log(`${f.out}: ${(input.length / 1024).toFixed(1)} KB → ${(output.length / 1024).toFixed(1)} KB  (${chars.length} code points)`);
}
