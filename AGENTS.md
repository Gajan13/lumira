<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Lumira — rules for people and coding agents

Lumira is the public website of Lumira, a bicycle manufacturer based in India: brand story, bicycle catalogue, dealer locator and customer enquiry forms. It is one Next.js 16 app (App Router, Cache Components, React 19, Tailwind 4, TypeScript), installed with npm.

This file is the single source of truth for how to work here. Claude reads it through `CLAUDE.md`; Cursor and Copilot get a generated copy of the core rules (`npm run rules:sync`). Procedures live in `docs/agents/recipes/`.

## Core rules

<!-- core-rules:start -->

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

<!-- core-rules:end -->

## 1. Sources of truth

| Topic                        | Source                                                    |
| ---------------------------- | --------------------------------------------------------- |
| How to work                  | this file                                                 |
| Next.js APIs                 | `node_modules/next/dist/docs/` (version-matched)          |
| Procedures                   | `docs/agents/recipes/`                                    |
| Frontend rules               | `docs/agents/frontend.md`                                 |
| Risky areas                  | `docs/agents/risk-tiers.md`                               |
| Issues, findings, PRs        | `docs/agents/workflow.md`                                 |
| What a task must do          | its GitHub issue                                          |
| Brand (colours, type, voice) | design files from the client; tokens in `app/globals.css` |

When sources disagree, stop and ask. Do not pick one silently.

## 2. Don't guess

- Look up every Next.js API you are not certain of in the bundled docs, especially caching (`"use cache"`, `cacheLife`, `cacheTag`), `proxy.ts` (formerly middleware), metadata and forms.
- Don't invent product facts: model names, specs, prices, warranty terms and dealer details come from the client. Use clearly marked placeholders (`TODO(content): …`) when they are missing.
- If a package API is unclear, read its types in `node_modules` rather than assuming.

## 3. Don't overwrite other work

- Read a file before changing it; keep unrelated edits intact.
- Never run `git reset --hard`, `git clean -fd`, `git checkout -- .` or force pushes.
- Work in the main checkout; don't create worktrees unless the user asks.

## 4. How a change flows

1. Issue (spec) → branch `<type>/LUM-<n>-<summary>`; `<type>` is one of `feat`, `fix`, `content`, `chore`, `docs`, `refactor`.
2. Read the relevant recipe and this file's sections.
3. Change → `npm run check` → reviewer subagent (Claude) → list findings.
4. Ask → commit (Conventional Commits, e.g. `feat(bikes): add comparison table (LUM-12)`).
5. Ask → push (pre-push runs `npm run verify`) → ask → PR from `.github/pull_request_template.md`.

## 5. Architecture

```
app/                         routes (App Router). Server Components by default
  (marketing)/               home, about, story, careers — shared marketing layout
  bikes/                     catalogue: /bikes, /bikes/[category], /bikes/[category]/[slug]
  dealers/                   dealer locator
  support/                   service booking, warranty, FAQs
  contact/                   enquiry forms
  sitemap.ts, robots.ts      SEO metadata routes
components/
  ui/                        brand primitives (Button, Card, Price, Badge…), no data fetching
  sections/                  page sections composed from ui/ (Hero, SpecTable, DealerMap…)
  three/                     client-only 3D bike (three.js); see lumira-frontend/references/three-scene.md
lib/
  bike-scene/                scroll poses, finishes and device check for the 3D bike
  catalogue/                 product types, data access, price formatting
  forms/                     zod schemas + Server Actions for enquiries
  seo/                       metadata and JSON-LD helpers
content/                     catalogue and page content (JSON/MDX) until a CMS is chosen
public/images/               static brand imagery
```

The folders appear as features need them; don't create empty ones. Data flows one way: `content/` → `lib/catalogue` → Server Components → `components/`. Client components receive plain props and never import from `lib/*/server`.

## 6. Code style

- Prettier formats everything (with the Tailwind class sorter); ESLint (`next/core-web-vitals` + `next/typescript`) must pass with zero warnings.
- TypeScript strict: no `any`, no non-null `!`, no `@ts-ignore`/`@ts-expect-error` without a linked issue.
- Names: components `PascalCase`, functions are verbs (`getBikeBySlug`), booleans `is/has/can…`, constants `SCREAMING_SNAKE_CASE` with units (`HERO_IMAGE_MAX_WIDTH_PX`).
- Import with the `@/` alias across folders; relative imports inside one folder.
- Tailwind for styling; brand values are theme tokens in `app/globals.css`, not hard-coded hex values.
- Comments explain why, not what. Keep functions small; split components over ~150 lines.
- Text is Indian English; units are metric (kg, mm, km); prices use `formatInr()` from `lib/catalogue`.

## 7. Tests

- Vitest + Testing Library; test files sit next to the code as `*.test.ts(x)`.
- Test behaviour users see (roles, text, labels), not implementation details.
- Required: schemas and Server Actions for every form (valid, invalid, missing consent), price/spec formatting, catalogue data access, any component with logic.
- Playwright end-to-end smoke tests come later for key journeys (browse → bike detail → enquiry).

## 8. Git hooks and definition of done

- `pre-commit`: lint-staged (ESLint fix + Prettier on staged files).
- `pre-push`: `npm run verify` (rules check, lint, format, typecheck, tests, build).
- CI runs `npm run verify` on every PR.

A change is done when: the issue's acceptance criteria are met, `npm run check` passes (`-- --full` for route/config changes), the reviewer reports PASS, findings are listed, and docs/recipes are updated if a procedure changed.

## 9. Issues and PRs

- Issues use `.github/ISSUE_TEMPLATE/` (Feature, Bug). Each has acceptance criteria and affected files.
- PRs use `.github/pull_request_template.md`, link the issue (`Closes #n`), state the risk tier, and list how it was verified.
- One topic per PR. Keep PRs reviewable (aim for under ~400 changed lines excluding content and images).

## 10. Paths that need an owner's review

Tier 1 (deep review + owner approval): `lib/forms/**`, any `actions.ts`, `proxy.ts`, `next.config.ts`, `.env.example`, anything handling payments or authentication, `.github/workflows/**`, `.claude/settings.json`, `.claude/hooks/**`.
Tier 2: `content/**` prices and specs, `lib/catalogue/**`, `app/sitemap.ts`, `app/robots.ts`, analytics and consent code.
Full table: `docs/agents/risk-tiers.md`.

## 11. Brand and content

- The name is always **Lumira** (capital L only).
- Voice: confident, warm, plain language; no exaggerated claims about speed, safety or certification unless the client supplied them.
- Every bike image has descriptive alt text (model, colour, view).
- Phone numbers in `+91 98765 43210` format; PIN codes are 6 digits; dates like `24 Nov 2026`.

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
