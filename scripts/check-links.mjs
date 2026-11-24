import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, normalize } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const outDir = join(root, "out");
const banned = ["ironpeak", "formspree", "supabase", "googletagmanager", "remedipestcontrol", "917-5101", "533-9217"];

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, acc);
    else if (name.endsWith(".html")) acc.push(path);
  }
  return acc;
}

function resolveTarget(fromFile, href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return null;
  let path;
  if (clean.startsWith("/")) path = join(outDir, clean);
  else path = normalize(join(dirname(fromFile), clean));
  if (path.endsWith("/")) path = join(path, "index.html");
  else if (!path.split("/").pop().includes(".")) path = join(path, "index.html");
  return path;
}

const files = walk(outDir);
let missing = 0;
const hrefRe = /(?:href|src)="([^"]+)"/g;
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const lowered = html.toLowerCase();
  for (const word of banned) {
    if (lowered.includes(word)) {
      console.error(`BANNED ${word} in ${file}`);
      missing += 1;
    }
  }
  for (const match of html.matchAll(hrefRe)) {
    const href = match[1];
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("data:")) continue;
    if (href.startsWith("http://") || href.startsWith("https://")) continue;
    if (href.startsWith("#")) continue;
    const target = resolveTarget(file, href);
    if (target && !existsSync(target)) {
      console.error(`MISSING ${href} from ${file.replace(outDir, "")}`);
      missing += 1;
    }
  }
}
console.log(`link check files=${files.length} problems=${missing}`);
if (missing) process.exit(1);
