import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadJson(path) {
  const raw = readFileSync(path, "utf8");
  if (/^<{7}|^={7}|^>{7}/m.test(raw)) {
    throw new Error(`${path} has unresolved Git merge conflict markers`);
  }
  return JSON.parse(raw);
}

loadJson(join(root, "content", "settings.json"));

const friendsDir = join(root, "content", "friends");
for (const file of readdirSync(friendsDir)) {
  if (file.endsWith(".json")) {
    loadJson(join(friendsDir, file));
  }
}

console.log("Content JSON files are valid.");
