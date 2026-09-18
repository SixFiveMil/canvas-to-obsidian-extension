import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const pkgPath = resolve(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const version = process.env.npm_package_version || pkg.version;

if (!version) {
  console.error("[SYNC-VERSION ERROR] Could not determine target version.");
  process.exit(1);
}

const manifestFiles = [
  "manifest.json",
  "manifest.chrome.json",
  "manifest.firefox.json"
];

const updatedFiles = [];

for (const relPath of manifestFiles) {
  const fullPath = resolve(root, relPath);
  if (existsSync(fullPath)) {
    const manifest = JSON.parse(readFileSync(fullPath, "utf8"));
    if (manifest.version !== version) {
      manifest.version = version;
      writeFileSync(fullPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
      console.log(`[SYNC-VERSION] Updated ${relPath} -> ${version}`);
      updatedFiles.push(relPath);
    } else {
      console.log(`[SYNC-VERSION] ${relPath} is already version ${version}`);
    }
  }
}

// Stage updated manifests if executed within git / npm version
if (updatedFiles.length > 0) {
  try {
    execSync(`git add ${updatedFiles.join(" ")}`, { cwd: root, stdio: "ignore" });
  } catch {
    // ignore if not in a git working tree
  }
}
