import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = new URL("..", import.meta.url).pathname;
const dest = join(root, "public/og/default.png");
mkdirSync(dirname(dest), { recursive: true });

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#021f4d"/>
  <rect x="0" y="0" width="18" height="630" fill="#f98527"/>
  <text x="80" y="250" fill="#88cff9" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" letter-spacing="3">ROOF AND BEYOND HOME SOLUTIONS</text>
  <text x="80" y="340" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700">Roofs, siding, windows,</text>
  <text x="80" y="420" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700">and gutters</text>
  <text x="80" y="510" fill="#f98527" font-family="Arial, Helvetica, sans-serif" font-size="32">Media, PA  ·  (717) 804-0990  ·  PA HIC #PA240642</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(dest);
console.log("wrote", dest);
