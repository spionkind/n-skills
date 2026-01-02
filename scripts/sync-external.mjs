#!/usr/bin/env node

/**
 * sync-external.mjs
 *
 * Syncs external skills from upstream repositories into n-skills.
 * Reads sources.yaml, clones/fetches repos, and copies skill folders.
 *
 * Usage:
 *   node scripts/sync-external.mjs [--force] [--skill=name]
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, rmSync, cpSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCES_FILE = join(ROOT, "sources.yaml");
const SYNC_STATE_FILE = join(ROOT, ".sync-state.json");
const TEMP_DIR = join(ROOT, ".sync-temp");

// Parse CLI arguments
const args = process.argv.slice(2);
const force = args.includes("--force");
const skillArg = args.find((a) => a.startsWith("--skill="));
const targetSkill = skillArg ? skillArg.split("=")[1] : null;

console.log("🔄 n-skills External Sync");
console.log("=".repeat(50));

// Read sources.yaml
if (!existsSync(SOURCES_FILE)) {
  console.error("❌ sources.yaml not found");
  process.exit(1);
}

const sourcesContent = readFileSync(SOURCES_FILE, "utf-8");
const sources = parseYaml(sourcesContent);

// Load previous sync state
let syncState = {};
if (existsSync(SYNC_STATE_FILE)) {
  try {
    syncState = JSON.parse(readFileSync(SYNC_STATE_FILE, "utf-8"));
  } catch (e) {
    console.warn("⚠️  Could not read sync state, starting fresh");
  }
}

// Create temp directory
if (existsSync(TEMP_DIR)) {
  rmSync(TEMP_DIR, { recursive: true });
}
mkdirSync(TEMP_DIR, { recursive: true });

let hasChanges = false;
const errors = [];

// Process each skill
for (const skill of sources.skills || []) {
  // Skip native skills (maintained directly in repo)
  if (skill.native) {
    console.log(`\n⏭️  ${skill.name} (native, skipping sync)`);
    continue;
  }

  // Skip if targeting specific skill
  if (targetSkill && skill.name !== targetSkill) {
    continue;
  }

  console.log(`\n📦 Processing: ${skill.name}`);
  console.log(`   Source: ${skill.source.repo}/${skill.source.path}`);
  console.log(`   Target: ${skill.target.path}`);

  try {
    const repoUrl = `https://github.com/${skill.source.repo}.git`;
    const ref = skill.source.ref || "main";
    const repoDir = join(TEMP_DIR, skill.source.repo.replace("/", "-"));

    // Clone or fetch
    if (!existsSync(repoDir)) {
      console.log(`   Cloning ${skill.source.repo}...`);
      execSync(`git clone --depth 1 --branch ${ref} ${repoUrl} ${repoDir}`, {
        stdio: "pipe",
      });
    }

    // Get current commit hash
    const commitHash = execSync(`git -C ${repoDir} rev-parse HEAD`, {
      encoding: "utf-8",
    }).trim();

    console.log(`   Commit: ${commitHash.slice(0, 8)}`);

    // Check if already synced
    const prevState = syncState[skill.name] || {};
    if (!force && prevState.commit === commitHash) {
      console.log(`   ✅ Already up to date`);
      continue;
    }

    // Source and target paths
    const sourcePath = join(repoDir, skill.source.path);
    const targetPath = join(ROOT, skill.target.path);

    if (!existsSync(sourcePath)) {
      throw new Error(`Source path not found: ${skill.source.path}`);
    }

    // Validate SKILL.md exists
    const skillMdPath = join(sourcePath, "SKILL.md");
    if (!existsSync(skillMdPath)) {
      throw new Error(`SKILL.md not found in ${skill.source.path}`);
    }

    // Clean target directory
    if (existsSync(targetPath)) {
      rmSync(targetPath, { recursive: true });
    }
    mkdirSync(dirname(targetPath), { recursive: true });

    // Copy files
    const syncConfig = skill.sync || {};
    const includes = syncConfig.include || null;
    const excludes = syncConfig.exclude || ["node_modules/", "*.lock", "bun.lock", "tmp/"];

    if (includes) {
      // Copy specific files/folders
      mkdirSync(targetPath, { recursive: true });
      for (const item of includes) {
        const src = join(sourcePath, item);
        const dest = join(targetPath, item);
        if (existsSync(src)) {
          cpSync(src, dest, { recursive: true });
        }
      }
    } else {
      // Copy everything except excludes
      cpSync(sourcePath, targetPath, {
        recursive: true,
        filter: (src) => {
          const relativePath = src.replace(sourcePath, "");
          return !excludes.some((pattern) => {
            if (pattern.endsWith("/")) {
              return relativePath.includes(pattern.slice(0, -1));
            }
            if (pattern.startsWith("*.")) {
              return relativePath.endsWith(pattern.slice(1));
            }
            return relativePath.includes(pattern);
          });
        },
      });
    }

    // Write attribution file
    const attributionPath = join(targetPath, ".source.json");
    writeFileSync(
      attributionPath,
      JSON.stringify(
        {
          synced_from: skill.source.repo,
          source_path: skill.source.path,
          commit: commitHash,
          synced_at: new Date().toISOString(),
          homepage: skill.homepage,
          author: skill.author,
          license: skill.license,
        },
        null,
        2
      )
    );

    // Update sync state
    syncState[skill.name] = {
      commit: commitHash,
      synced_at: new Date().toISOString(),
      source: skill.source.repo,
    };

    hasChanges = true;
    console.log(`   ✅ Synced successfully`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    errors.push({ skill: skill.name, error: error.message });
  }
}

// Save sync state
writeFileSync(SYNC_STATE_FILE, JSON.stringify(syncState, null, 2));

// Cleanup
rmSync(TEMP_DIR, { recursive: true });

// Summary
console.log("\n" + "=".repeat(50));
console.log("📊 Sync Summary");

if (hasChanges) {
  console.log("   Status: Changes detected");
  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    writeFileSync(process.env.GITHUB_OUTPUT, "changes=true\n", { flag: "a" });
  }
} else {
  console.log("   Status: No changes");
  if (process.env.GITHUB_OUTPUT) {
    writeFileSync(process.env.GITHUB_OUTPUT, "changes=false\n", { flag: "a" });
  }
}

if (errors.length > 0) {
  console.log(`   Errors: ${errors.length}`);
  for (const e of errors) {
    console.log(`     - ${e.skill}: ${e.error}`);
  }
  process.exit(1);
}

console.log("\n✨ Done!\n");
