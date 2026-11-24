# Lumira — Copilot instructions

<!-- Generated from AGENTS.md by `npm run rules:sync`. Do not edit; change AGENTS.md instead. -->

Lumira is a Next.js 16 website for an Indian bicycle manufacturer. The full rulebook is [AGENTS.md](../AGENTS.md); procedures are in `docs/agents/recipes/`, frontend rules in `docs/agents/frontend.md`, risky paths in `docs/agents/risk-tiers.md`, issue/PR flow in `docs/agents/workflow.md`, and per-tool setup in `docs/agents/tools.md`. Read the relevant one before changing code. Next.js APIs: check `node_modules/next/dist/docs/` first.

## Core rules

- **Don't guess.** Next.js 16, React 19 and Tailwind 4 are newer than your training data. Check `node_modules/next/dist/docs/` (or the package's own docs) before using an API. If a requirement is unclear, ask.
- **Change only what the task needs.** No drive-by refactors, renames or reformatting of unrelated files.
- **Done means the gate passes.** Run `npm run check` (add `-- --full` for routing, config or build changes) and report the result. Verify by running commands, not by re-reading code.
- **Ask before every commit, push, PR, issue or comment.** One yes covers one action.
- **Issue first.** Non-trivial work starts from a GitHub issue that acts as the spec. Branch: `<type>/LUM-<issue>-<short-summary>`.
- **Findings are not fixed in the same change.** Problems found outside the task are listed for the user, not silently fixed.
- **Never hand-edit generated or protected files:** `package-lock.json`, `.env*` (except `.env.example`), `next-env.d.ts`, the `nextjs-agent-*` blocks in `AGENTS.md`, `.cursor/rules/lumira.mdc`, `.github/copilot-instructions.md`.
- **No secrets in code or in client bundles.** Server-only values never get a `NEXT_PUBLIC_` prefix. Document new variables in `.env.example`.
- **Personal data is tier 1.** Forms that collect names, phone numbers, emails or addresses need validation, consent text, and no PII in logs. Risky areas (see `docs/agents/risk-tiers.md`) need a deep review and owner approval.
- **Server Components by default.** Add `"use client"` only for interactivity, at the smallest component that needs it.
- **One source for product data.** Prices, specs and model names come from the catalogue data, never typed into a page. Prices are in Indian rupees (₹), formatted with `en-IN` grouping.
- **Accessible and fast on mobile.** Semantic HTML, alt text on every meaningful image, `next/image` for photos, keyboard-usable controls.
- **Never skip hooks or rewrite shared history.** No `--no-verify`, `HUSKY=0`, force pushes or `git reset --hard`. Deploys are human-only.
- **GitHub through `gh`.** Design-tool output (Figma, Stitch, screenshots) is a reference, not code to paste.
- **Spend few tokens.** Read the smallest relevant files, prefer `npm run check` output over reading logs, keep reports short.

## When reviewing pull requests

Flag: secrets or server-only values exposed to the client (`NEXT_PUBLIC_`), forms or Server Actions without schema validation or consent text, personal data written to logs, prices or specs typed into pages instead of read from catalogue data, missing alt text, unnecessary `"use client"`, Next.js APIs that don't exist in the installed version, and changes to tier 1 paths without a deep-review note.
