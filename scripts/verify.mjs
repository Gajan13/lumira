#!/usr/bin/env node
// `npm run verify` — whole-repo gate used by the pre-push hook and CI.
// 1. generated agent rule files match AGENTS.md (rules:check)
// 2. `npm run check -- --full` (lint, format, typecheck, tests, build)
import { spawnSync } from "node:child_process";

const run = (cmd) =>
  spawnSync(cmd, { shell: true, stdio: "inherit" }).status ?? 1;

if (run("node scripts/sync-rules.mjs --check") !== 0) process.exit(1);
process.exit(run("node scripts/check.mjs --full"));
