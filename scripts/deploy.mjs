// Deploy helper. Default: the GitHub Pages project URL (/udit-portfolio/).
// With --domain <host>: build for the site root, write build/CNAME and publish, so the same repo
// serves a custom domain such as uditsingh.com.
//
//   node scripts/deploy.mjs
//   node scripts/deploy.mjs --domain uditsingh.com
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const i = process.argv.indexOf("--domain");
const domain = i > -1 ? process.argv[i + 1] : null;

const env = { ...process.env };
if (domain) {
  env.SITE_BASE = "/";
  env.VITE_SITE_URL = `https://${domain}/`;
  console.log(`deploy: building for https://${domain}/ (base "/")`);
} else {
  console.log("deploy: building for the GitHub Pages project path (/udit-portfolio/)");
}

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", env, shell: process.platform === "win32", cwd: root });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

run("npm", ["run", "build"]);
if (domain) fs.writeFileSync(path.join(root, "build", "CNAME"), domain + "\n");
run("npx", ["gh-pages", "-d", "build", "--dotfiles"]);
console.log(domain ? `deploy: published. Point DNS at GitHub Pages and enable HTTPS for ${domain}.` : "deploy: published.");
