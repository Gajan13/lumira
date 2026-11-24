#!/usr/bin/env node
// Stop hook: when Claude is about to finish, lint the files it changed.
// Runs once per turn (stop_hook_active guard). Slow checks (typecheck, tests,
// build) are left to `npm run check` / `npm run verify` / pre-push.
import { spawnSync } from "node:child_process";
import { formatEslintOutput } from "./lib/eslint-report.mjs";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const ROOT = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
const LINT_EXT = new Set([
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
]);
const MAX_DIAGNOSTICS = 20;

let data = {};
try {
  data = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  /* no input */
}
if (data.stop_hook_active) process.exit(0);

const git = (args) => spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });

let diff = git(["diff", "--name-only", "HEAD"]);
if (diff.status !== 0) diff = git(["diff", "--name-only", "--cached"]); // repo without commits
const untracked = git(["ls-files", "--others", "--exclude-standard"]);

const changed = [
  ...new Set(`${diff.stdout || ""}\n${untracked.stdout || ""}`.split("\n")),
]
  .map((f) => f.trim())
  .filter((f) => f && LINT_EXT.has(extname(f)) && existsSync(join(ROOT, f)));

if (!changed.length) process.exit(0);

const eslint = join(
  ROOT,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "eslint.cmd" : "eslint",
);
if (!existsSync(eslint)) process.exit(0);

const res = spawnSync(
  `"${eslint}"`,
  ["--max-warnings=0", "--format", "json", ...changed.map((f) => `"${f}"`)],
  { cwd: ROOT, shell: true, encoding: "utf8" },
);

if (res.status !== 0) {
  const lines = formatEslintOutput(
    ROOT,
    res.stdout,
    res.stderr,
    MAX_DIAGNOSTICS,
  );
  process.stderr.write(
    `Fix these before finishing (AGENTS.md §8):\n${lines.join("\n")}\n`,
  );
  process.exit(2);
}
process.exit(0);
