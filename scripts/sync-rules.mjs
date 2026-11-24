#!/usr/bin/env node
// Builds the Cursor and Copilot rule files from the core-rules block in AGENTS.md.
//   npm run rules:sync    rewrite generated files that differ
//   npm run rules:check   compare only; exit 1 if any file has drifted (runs inside `npm run verify`)
// Workflow: edit the core block in AGENTS.md → npm run rules:sync → commit all three files together.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const START = "<!-- core-rules:start -->";
const END = "<!-- core-rules:end -->";
const BANNER =
  "<!-- Generated from AGENTS.md by `npm run rules:sync`. Do not edit; change AGENTS.md instead. -->";

const normalize = (text) => text.replace(/\r\n/g, "\n");

const agents = normalize(readFileSync(join(ROOT, "AGENTS.md"), "utf8"));
const startAt = agents.indexOf(START);
const endAt = agents.indexOf(END);
if (startAt === -1 || endAt === -1 || endAt < startAt) {
  console.error(`AGENTS.md must contain ${START} … ${END}`);
  process.exit(1);
}
const coreRules = agents.slice(startAt + START.length, endAt).trim();

const pointer = (agentsLink) =>
  `Lumira is a Next.js 16 website for an Indian bicycle manufacturer. The full rulebook is ${agentsLink}; procedures are in \`docs/agents/recipes/\`, frontend rules in \`docs/agents/frontend.md\`, risky paths in \`docs/agents/risk-tiers.md\`, issue/PR flow in \`docs/agents/workflow.md\`, and per-tool setup in \`docs/agents/tools.md\`. Read the relevant one before changing code. Next.js APIs: check \`node_modules/next/dist/docs/\` first.`;

const REVIEW = `## When reviewing pull requests

Flag: secrets or server-only values exposed to the client (\`NEXT_PUBLIC_\`), forms or Server Actions without schema validation or consent text, personal data written to logs, prices or specs typed into pages instead of read from catalogue data, missing alt text, unnecessary \`"use client"\`, Next.js APIs that don't exist in the installed version, and changes to tier 1 paths without a deep-review note.`;

const targets = [
  {
    path: ".cursor/rules/lumira.mdc",
    content: `---
description: Lumira repository rules for every change
alwaysApply: true
---

${BANNER}

${pointer("`AGENTS.md`")}

${coreRules}
`,
  },
  {
    path: ".github/copilot-instructions.md",
    content: `# Lumira — Copilot instructions

${BANNER}

${pointer("[AGENTS.md](../AGENTS.md)")}

## Core rules

${coreRules}

${REVIEW}
`,
  },
];

const checkOnly = process.argv.includes("--check");
const drifted = [];
for (const target of targets) {
  const file = join(ROOT, target.path);
  const current = existsSync(file)
    ? normalize(readFileSync(file, "utf8"))
    : null;
  if (current === target.content) continue;
  drifted.push(target.path);
  if (!checkOnly) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, target.content);
  }
}

if (checkOnly && drifted.length) {
  console.error(
    `rules:check failed — out of date: ${drifted.join(", ")}\nRun \`npm run rules:sync\` and commit the result.`,
  );
  process.exit(1);
}
console.log(
  checkOnly
    ? "rules:check: generated rule files are up to date"
    : drifted.length
      ? `rules:sync: wrote ${drifted.join(", ")}`
      : "rules:sync: nothing to update",
);
