import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const cacheDir = join(root, "scripts/.cache");
const sentenceFile = join(cacheDir, "remedi-sentences.txt");
const gramFile = join(cacheDir, "remedi-8grams.txt");
if (!existsSync(sentenceFile) || !existsSync(gramFile)) {
  console.error("Missing Remedi corpus. Run python3 scripts/fetch-remedi.py first.");
  process.exit(1);
}
const remediSentences = new Set(readFileSync(sentenceFile, "utf8").split("\n").filter(Boolean));
const remediGrams = new Set(readFileSync(gramFile, "utf8").split("\n").filter(Boolean));

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, acc);
    else if (name.endsWith(".html")) acc.push(path);
  }
  return acc;
}

function textFrom(html) {
  const match = html.match(/<article[^>]*data-unique="true"[^>]*>([\s\S]*?)<\/article>/i);
  const source = match ? match[1] : html;
  return source
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, " and ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

let maxScore = 0;
let worst = "";
let sentenceHits = 0;
let gramHits = 0;
const files = walk(join(root, "out"));
for (const file of files) {
  const text = textFrom(readFileSync(file, "utf8"));
  const words = text.split(" ").filter(Boolean);
  const ours = new Set();
  for (let i = 0; i <= words.length - 8; i += 1) {
    const gram = words.slice(i, i + 8).join(" ");
    ours.add(gram);
    if (remediGrams.has(gram)) {
      gramHits += 1;
      console.error(`SHARED 8-GRAM ${file}\n  ${gram}`);
    }
  }
  const sentences = text.split(/[.!?]/);
  for (const sentence of sentences) {
    const cleaned = sentence.replace(/\s+/g, " ").trim();
    const count = cleaned.split(" ").filter(Boolean).length;
    if (count >= 8 && remediSentences.has(cleaned)) {
      sentenceHits += 1;
      console.error(`SHARED SENTENCE ${file}\n  ${cleaned}`);
    }
  }
  if (ours.size) {
    let inter = 0;
    for (const gram of ours) if (remediGrams.has(gram)) inter += 1;
    const score = inter / ours.size;
    if (score > maxScore) {
      maxScore = score;
      worst = file;
    }
  }
}

console.log(
  `remedi check pages=${files.length} sharedSentences=${sentenceHits} shared8grams=${gramHits} maxOverlap=${maxScore.toFixed(4)} worst=${worst}`,
);
if (sentenceHits || gramHits || maxScore > 0.02) process.exit(1);
