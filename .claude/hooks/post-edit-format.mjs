#!/usr/bin/env node
// PostToolUse: format the edited file with Prettier, apply ESLint fixes, and
// report remaining lint errors so Claude fixes them immediately.
// Exit 2 = feed the message back to Claude; exit 0 = fine.
import { spawnSync } from "node:child_process";
import { formatEslintOutput } from "./lib/eslint-report.mjs";
import { existsSync, readFileSync } from "node:fs";
import { extname, isAbsolute, join, relative, resolve } from "node:path";

const ROOT = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
const FORMAT_EXT = new Set([
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".md",
  ".mdx",
  ".yml",
  ".yaml",
]);
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
const MAX_DIAGNOSTICS = 10;

let data = {};
try {
  data = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const filePath = data.tool_input?.file_path;
if (!filePath) process.exit(0);
const abs = isAbsolute(filePath) ? filePath : resolve(ROOT, filePath);
const rel = relative(ROOT, abs).replace(/\\/g, "/");
if (rel.startsWith("..") || rel.includes("node_modules/") || !existsSync(abs))
  process.exit(0);

const ext = extname(abs).toLowerCase();
if (!FORMAT_EXT.has(ext)) process.exit(0);

const bin = (name) =>
  join(
    ROOT,
    "node_modules",
    ".bin",
    process.platform === "win32" ? `${name}.cmd` : name,
  );
const run = (name, args) =>
  spawnSync(
    `"${bin(name)}"`,
    args.map((a) => `"${a}"`),
    {
      cwd: ROOT,
      shell: true,
      encoding: "utf8",
    },
  );

if (existsSync(bin("prettier"))) {
  run("prettier", ["--write", "--ignore-unknown", "--log-level", "warn", rel]);
}

if (LINT_EXT.has(ext) && existsSync(bin("eslint"))) {
  const res = run("eslint", [
    "--fix",
    "--max-warnings=0",
    "--format",
    "json",
    rel,
  ]);
  if (res.status !== 0) {
    const lines = formatEslintOutput(
      ROOT,
      res.stdout,
      res.stderr,
      MAX_DIAGNOSTICS,
    );
    process.stderr.write(
      `ESLint problems remain in ${rel} — fix them now (AGENTS.md §6):\n${lines.join("\n")}\n`,
    );
    process.exit(2);
  }
}

process.exit(0);
