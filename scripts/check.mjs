#!/usr/bin/env node
// `npm run check` — the "is it done?" gate: lint, typecheck, unit tests.
// Prints one line per step; on failure prints the tail of the output and the
// full log path, so agents spend few tokens.
//   --fast  lint + typecheck only
//   --full  also runs `next build`
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = new Set(process.argv.slice(2));
const root = process.cwd();
const logDir = join(root, ".check-logs");

const steps = [
  { name: "lint", cmd: "npx eslint --max-warnings=0 ." },
  { name: "format", cmd: "npx prettier --check . --log-level warn" },
  { name: "typecheck", cmd: "npx tsc --noEmit" },
];
if (!args.has("--fast")) steps.push({ name: "test", cmd: "npx vitest run" });
if (args.has("--full")) steps.push({ name: "build", cmd: "npx next build" });

let failed = 0;
for (const step of steps) {
  const started = Date.now();
  const res = spawnSync(step.cmd, {
    shell: true,
    encoding: "utf8",
    env: { ...process.env, FORCE_COLOR: "0", CI: "1" },
  });
  const secs = ((Date.now() - started) / 1000).toFixed(1);
  if (res.status === 0) {
    console.log(`PASS ${step.name} (${secs}s)`);
    continue;
  }
  failed++;
  mkdirSync(logDir, { recursive: true });
  const logPath = join(logDir, `${step.name}.log`);
  const output = `${res.stdout ?? ""}${res.stderr ?? ""}`;
  writeFileSync(logPath, output);
  const tail = output.trim().split("\n").slice(-25).join("\n");
  console.log(`FAIL ${step.name} (${secs}s)\n${tail}\n(full log: ${logPath})`);
}

console.log(failed ? `check: ${failed} step(s) failed` : "check: all passed");
process.exit(failed ? 1 : 0);
