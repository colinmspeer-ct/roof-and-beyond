import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const outDir = join(root, "out");

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, acc);
    else if (name.endsWith(".html")) acc.push(path);
  }
  return acc;
}

function decode(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, " and ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, " ")
    .replace(/&[a-z]+;/gi, " ");
}

function wordsOf(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function shingles(words, n) {
  const set = new Set();
  for (let i = 0; i <= words.length - n; i += 1) {
    set.add(words.slice(i, i + n).join(" "));
  }
  return set;
}

const files = walk(outDir);
const pages = [];
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const match = html.match(/<article[^>]*data-unique="true"[^>]*>([\s\S]*?)<\/article>/i);
  if (!match) continue;
  const words = wordsOf(decode(match[1]));
  if (words.length < 80) {
    console.error(`SHORT ${words.length} ${file}`);
    process.exitCode = 1;
  }
  pages.push({ file, words, shingles: shingles(words, 6), grams12: shingles(words, 12) });
}

let worst = { score: 0, a: "", b: "" };
const seen12 = new Map();
for (const page of pages) {
  for (const gram of page.grams12) {
    const prior = seen12.get(gram);
    if (prior && prior !== page.file) {
      console.error(`SHARED12 ${prior} <> ${page.file}\n  ${gram}`);
      process.exitCode = 1;
      break;
    }
    if (!prior) seen12.set(gram, page.file);
  }
}

for (let i = 0; i < pages.length; i += 1) {
  for (let j = i + 1; j < pages.length; j += 1) {
    let inter = 0;
    const a = pages[i].shingles;
    const b = pages[j].shingles;
    const [small, large] = a.size < b.size ? [a, b] : [b, a];
    for (const gram of small) if (large.has(gram)) inter += 1;
    if (!inter) continue;
    const score = inter / (a.size + b.size - inter);
    if (score > worst.score) worst = { score, a: pages[i].file, b: pages[j].file };
    if (score > 0.2) {
      console.error(`SIMILAR ${score.toFixed(3)} ${pages[i].file} <> ${pages[j].file}`);
      process.exitCode = 1;
    }
  }
}

console.log(
  `duplicate check pages=${pages.length} max6gramJaccard=${worst.score.toFixed(4)} ${worst.a} <> ${worst.b}`,
);
if (process.exitCode) process.exit(process.exitCode);
