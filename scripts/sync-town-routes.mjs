import { cpSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const launch = JSON.parse(readFileSync(join(root, "launch.json"), "utf8"));
const townDir = join(root, "src/app/where-we-work/[county]/[town]");
const serviceDir = join(townDir, "[service]");

if (!launch.includeTownPages) {
  rmSync(townDir, { recursive: true, force: true });
  console.log("town routes excluded from the app directory");
} else {
  mkdirSync(serviceDir, { recursive: true });
  cpSync(join(root, "src/features/town-pages/town-page.tsx"), join(townDir, "page.tsx"));
  cpSync(
    join(root, "src/features/town-pages/town-service-page.tsx"),
    join(serviceDir, "page.tsx"),
  );
  console.log("town routes copied into the app directory");
}

void dirname;
