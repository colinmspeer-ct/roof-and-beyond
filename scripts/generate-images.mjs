import { readFile, mkdir, access, writeFile } from "node:fs/promises";
import sharp from "sharp";

const manifest = JSON.parse(await readFile(new URL("./image-prompts.json", import.meta.url)));
const output = new URL("../public/images/gen/", import.meta.url);
const key = process.env.OPENAI_API_KEY;
if (!key) throw new Error("Set OPENAI_API_KEY before generating images.");
await mkdir(output, { recursive: true });

const selected = process.argv.slice(2);
const jobs = Object.entries(manifest.scenes).filter(([name]) => !selected.length || selected.includes(name));
if (!jobs.length) throw new Error("No matching image prompts.");

async function generate([name, { prompt, size }]) {
  const webp = new URL(name + ".webp", output);
  const avif = new URL(name + ".avif", output);
  const exists = await Promise.all([webp, avif].map((path) => access(path).then(() => true, () => false)));
  if (exists.every(Boolean)) return;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt: manifest.direction + " " + prompt, size, quality: "high" }),
    signal: AbortSignal.timeout(300000),
  });
  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    throw new Error(`Images API HTTP ${response.status} (${details.error?.code ?? "no error code"})`);
  }
  const result = await response.json();
  const source = sharp(Buffer.from(result.data[0].b64_json, "base64")).resize({ width: 1600, withoutEnlargement: true });
  for (const [format, destination] of [["webp", webp], ["avif", avif]]) {
    for (let quality = 84; quality >= 24; quality -= 5) {
      const buffer = await source.clone().toFormat(format, { quality, effort: 5 }).toBuffer();
      if (buffer.length <= 200000) {
        await writeFile(destination, buffer);
        break;
      }
      if (quality - 5 < 24) throw new Error(`Unable to optimize ${format} within 200 KB`);
    }
  }
  console.log(name);
}

await Promise.all(Array.from({ length: 6 }, async () => {
  for (let job; (job = jobs.shift()); ) {
    try {
      await generate(job);
    } catch (error) {
      console.error(job[0], error.message);
      process.exitCode = 1;
    }
  }
}));
