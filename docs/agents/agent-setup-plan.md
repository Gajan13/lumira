# Lumira: AI-agent setup plan

This plan adapts the setup described in _Lodge Agent Configuration Guide_ (3 Nov 2026) to the Lumira website. It says which parts carry over, what changes, and the order to build them in.

**About Lumira:** a website for Lumira, a bicycle manufacturer based in India.
**Stack today:** a single Next.js 16.4 app (App Router, `cacheComponents`, React 19.3, Tailwind 4.3, TypeScript 5) with npm, ESLint 9 (`eslint-config-next`), one commit, and no tests, formatter, CI or git hooks yet.

> Status (24 Nov 2026): built. Steps 1–9 of the build order are in place, and the smoke tests in step 10 pass. Not done yet: a GitHub remote and branch protection (§9 Q6), a shared `.mcp.json` (not needed so far), and Playwright e2e tests (wait until real pages exist). The "Stack today" line above describes the repo before this setup was added.

---

## 1. What changes from Lodge, and why

| Lodge                                         | Lumira                                                                                | Reason                                                                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| pnpm monorepo (Turborepo, 3 apps, 2 packages) | One Next.js app, npm                                                                  | No scoped `apps/*/AGENTS.md`. Use one root rulebook, plus scoped files only when a folder needs its own rules.                   |
| Fastify + oRPC API, Drizzle migrations        | Next.js Server Components, Server Actions, Route Handlers                             | `add-procedure`, `add-module` and `db-migration` don't apply yet. Write a `db-migration` skill only if a database is added.      |
| Astro 7 islands, CSP                          | Next.js 16 rendering (Server Components by default, `"use client"` only where needed) | Rewrite `lodge-frontend` as `lumira-frontend`. Next 16 is newer than model training data, as the existing AGENTS.md block warns. |
| Biome                                         | ESLint (already set up) + Prettier (to be added)                                      | Hooks call `eslint --fix` / `prettier --write` instead of Biome.                                                                 |
| lefthook                                      | Husky + lint-staged                                                                   | The common npm choice. The guard blocks `HUSKY=0` instead of `LEFTHOOK=0`.                                                       |
| `astro-docs` MCP                              | Next.js docs bundled at `node_modules/next/dist/docs/`                                | Point agents at the local docs first. A docs MCP is optional.                                                                    |
| Terraform / deploy denies                     | Vercel deploy denies (`vercel --prod`, `vercel deploy`)                               | Deploys stay human-only.                                                                                                         |
| Branch `<type>/LODGE-<n>-<summary>`           | `<type>/LUM-<n>-<summary>`                                                            | Project prefix.                                                                                                                  |
| Tamil replies, Stitch MCP project             | Your call                                                                             | Keep Tamil in CLAUDE.md if you want it. Stitch stays a personal MCP and never goes in the repo.                                  |

**Kept as is:** one rulebook (AGENTS.md) for all tools. Instructions are soft and commands are hard. Ask before every commit, push, PR, issue or comment. Work starts from an issue. Agents verify by running commands. A cheap reviewer subagent runs the gate. Recipes are written for people and wrapped by skills for Claude.

---

## 2. Target folder tree

```
lumira/
├── AGENTS.md                      THE rulebook. Keep the Next.js agent-rules block, add core-rules markers + sections
├── CLAUDE.md                      "@AGENTS.md" + Claude-only notes
├── .mcp.json                      (optional) shared docs MCP servers
│
├── .claude/
│   ├── settings.json              deny/ask permissions + hook registration
│   ├── launch.json                preview server: "web", npm run dev, port 3000
│   ├── hooks/
│   │   ├── pre-tool-guard.mjs     block lockfile/.env/generated edits + hook-skipping git
│   │   ├── post-edit-format.mjs   prettier --write + eslint --fix on the edited file
│   │   └── stop-checks.mjs        eslint on changed files, once per turn
│   ├── agents/
│   │   └── reviewer.md            Haiku: runs `npm run check`, reports in 15 lines or fewer
│   └── skills/
│       ├── lumira-engineering/    where code goes, house style, safe changes
│       │   ├── SKILL.md
│       │   └── references/{folder-map,patterns,safe-changes,testing,pitfalls}.md
│       ├── lumira-frontend/       Next 16 rendering, caching, images, SEO, a11y, brand UI
│       │   ├── SKILL.md
│       │   └── references/{rendering-and-caching,assets-and-performance,seo-and-metadata}.md
│       ├── add-page/SKILL.md      new route/page with metadata, loading/error states
│       ├── add-product/SKILL.md   new bicycle model or category in the catalogue
│       ├── add-form/SKILL.md      enquiry / dealer / service form via Server Action
│       ├── create-issue/SKILL.md  copied from Lodge, adapted
│       └── create-pr/SKILL.md     copied from Lodge, adapted
│
├── .cursor/rules/lumira.mdc       GENERATED by rules:sync (only if the team uses Cursor)
├── .github/
│   ├── copilot-instructions.md    GENERATED (only if the team uses Copilot)
│   ├── pull_request_template.md
│   ├── ISSUE_TEMPLATE/{feature,bug}.yml
│   └── workflows/ci.yml           npm ci → npm run verify
│
├── .husky/{pre-commit,pre-push}   lint-staged / npm run verify
│
├── docs/agents/
│   ├── README.md                  "I want to… → read" index + enforcement layers
│   ├── tools.md                   how Claude/Cursor/Copilot/Codex get the rules
│   ├── workflow.md                issues, findings, PRs
│   ├── risk-tiers.md              Lumira's tier 1/2/3 areas
│   ├── frontend.md                frontend rules (lumira-frontend = the "how")
│   └── recipes/                   add-page, add-product, add-form, add-dependency,
│                                  add-env-variable, create-issue, create-pull-request
│
└── scripts/
    ├── sync-rules.mjs             npm run rules:sync / rules:check
    ├── check.mjs                  npm run check: short output, log path on failure
    └── verify.mjs                 npm run verify: rules:check + check + build
```

---

## 3. Gate commands (build first, everything else refers to them)

| Script                               | Runs                                  | Used by                                  |
| ------------------------------------ | ------------------------------------- | ---------------------------------------- |
| `npm run lint`                       | `eslint` (exists)                     | stop hook (changed files only)           |
| `npm run typecheck`                  | `tsc --noEmit`                        | check                                    |
| `npm run test`                       | Vitest + Testing Library (to add)     | check                                    |
| `npm run check`                      | lint + typecheck + test, short output | reviewer, the "is it done?" command      |
| `npm run verify`                     | rules:check → check → `next build`    | pre-push hook, CI                        |
| `npm run rules:sync` / `rules:check` | `scripts/sync-rules.mjs`              | after editing core rules / inside verify |
| `npm run e2e` _(later)_              | Playwright smoke tests on key pages   | verify, once pages exist                 |

---

## 4. Guardrails (`.claude/settings.json` + hooks)

**deny (read):** `./.env`, `./.env.local`, `./.env.*.local`, `./**/*.pem`, `./**/*.key`. `.env.example` stays readable. Note that `.gitignore` currently ignores `.env*`, so add `!.env.example`.
**deny (git):** `git push --force`, `git push -f`, `git commit --no-verify`, `git reset --hard`, `git clean -fd`.
**deny (deploy):** `vercel --prod`, `vercel deploy`, `npm publish`.
**ask:** `git commit`, `git push`.

**pre-tool-guard.mjs:** copy Lodge's tokenizer and git checks. Protected paths:

- `package-lock.json`: change `package.json` and run `npm install` instead
- `.env*` except `.env.example`
- `next-env.d.ts`: generated by Next
- `AGENTS.md` between the `BEGIN/END:nextjs-agent-rules` markers: rewritten by `next dev`
- `.cursor/rules/lumira.mdc`, `.github/copilot-instructions.md`: generated, so run `rules:sync`
- swap the `LEFTHOOK=` / `core.hooksPath` checks for `HUSKY=0`

**post-edit-format.mjs:** for `.ts .tsx .js .jsx .mjs .cjs .json .css .md`, run `prettier --write` then `eslint --fix`. Report remaining errors (up to 10) with exit 2.
**stop-checks.mjs:** keep the `stop_hook_active` guard and changed-file detection. Run ESLint on changed files only. Leave `tsc`, tests and build to `check`/`verify`.

---

## 5. Skills, adapted to a bicycle-manufacturer website

**Knowledge skills (broad descriptions so they trigger reliably):**

- **lumira-engineering:** the change loop (understand → reuse → design → change safely → style → test → verify with commands → reviewer → findings), house style, checks by area, token use.
  - `folder-map.md`: `app/` route groups (e.g. `(marketing)`, `bikes/[category]/[slug]`, `dealers`, `support`), `components/ui`, `components/sections`, `lib/`, `content/`
  - `patterns.md`: Server Component page, client component, Server Action form, Route Handler, data loader
  - `safe-changes.md`, `testing.md`, `pitfalls.md` (starts with: Next 16 ≠ training data, Windows shell quirks, INR/₹ formatting, Indian phone numbers and PIN codes)
- **lumira-frontend:** Next 16 rendering decisions (server vs `"use client"`, `cacheComponents`, partial prefetching), `next/image` for product photography, fonts, Tailwind 4 tokens for the Lumira brand, accessibility, Core Web Vitals budgets for mobile users on slower Indian networks.
  - `seo-and-metadata.md`: `generateMetadata`, Product JSON-LD for bike models, sitemap and robots, Open Graph images, `hreflang` if Hindi or regional languages are added

**Workflow skills (each wraps one recipe in `docs/agents/recipes/`):**

| Skill          | Triggers on                                                                         | Does                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `add-page`     | new page, route, section of the site                                                | route folder, `page.tsx` + `loading`/`error`/`not-found`, metadata, sitemap entry, smoke test                                |
| `add-product`  | new bike model, category, spec change                                               | content entry (specs: frame, gears, wheel size, weight, price in ₹), images, listing + detail page, JSON-LD, comparison data |
| `add-form`     | enquiry, dealer application, service booking, bulk/B2B quote, warranty registration | Server Action + schema validation (zod), spam protection, consent text, success/error states, no PII in logs                 |
| `create-issue` | issue, spec, bug report, work with no issue number                                  | Lodge flow, branch `<type>/LUM-<n>-<summary>`                                                                                |
| `create-pr`    | create/open/raise a PR                                                              | Lodge 10-step flow with `npm run check` and the reviewer                                                                     |

**Later, only if the site grows into them:** `db-migration` (Prisma/Drizzle, if a database is added), `add-cms-type` (if a headless CMS is chosen), `checkout` (if online sales with Razorpay/Stripe are in scope).

---

## 6. Risk tiers for Lumira (`docs/agents/risk-tiers.md`)

| Tier         | Areas                                                                                                                                                                                        | Required                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 1 (critical) | Payments/checkout (if added), customer and dealer PII from forms (name, phone, address), secrets/env, auth for any dealer or admin area, middleware/proxy, `next.config.ts` security headers | reviewer in **deep review** mode + owner approval |
| 2            | Product prices and specs, dealer locator data, SEO metadata/sitemap, analytics and consent                                                                                                   | reviewer + careful PR description                 |
| 3            | Visual and content changes, new marketing sections                                                                                                                                           | normal gate                                       |

Deep-review checklist for `reviewer.md`: no secrets in client bundles (`NEXT_PUBLIC_` misuse), Server Actions validate input and check auth, PII not logged or cached in shared caches, prices shown in ₹ from one source, no invented Next 16 APIs (check against `node_modules/next/dist/docs/`), and the India DPDP Act 2023 checklist (consent and purpose shown on forms that collect personal data).

---

## 7. Rules: AGENTS.md + CLAUDE.md

**AGENTS.md:** keep the existing `nextjs-agent-rules` block at the top, unchanged. Below it, add:

- `<!-- core-rules:start -->` … `<!-- core-rules:end -->`: the generic Lodge rules (don't guess, change only what the task needs, done means `npm run check` passes, ask before commit/push/PR/issue/comment, issue first, findings not fixed in the same change, spend few tokens, risky areas need deep review, GitHub through `gh`, design-tool output is a reference)
- §1 Sources of truth · §2 Don't guess · §3 Don't overwrite other work · §4 How a change flows · §5 Architecture (Next app layout) · §6 Code style · §7 Tests · §8 Git hooks and definition of done · §9 Issues and PRs · §10 Paths that need an owner's review · §11 Brand and content rules (Lumira name and voice, ₹ formatting, metric units, Indian English, image alt text)

**CLAUDE.md:** `@AGENTS.md`, the list of skills and when to load them, ask-first and issue-first, `gh`, reviewer usage, hooks summary, Windows/PowerShell tips, and language preference if wanted.

---

## 8. Build order

1. **Gates:** add Prettier, Vitest, `typecheck`/`check`/`verify` scripts, `scripts/check.mjs`, `scripts/verify.mjs`.
2. **Rulebook:** AGENTS.md (core rules + sections) and CLAUDE.md.
3. **Sync:** `scripts/sync-rules.mjs` and generated Cursor/Copilot files (skip whichever tools the team doesn't use).
4. **Guardrails:** `.claude/settings.json` and the three hooks. Add `.claude/settings.local.json` and `!.env.example` to `.gitignore`.
5. **Reviewer:** `.claude/agents/reviewer.md`.
6. **Docs:** `docs/agents/` README, tools, workflow, risk-tiers, frontend.
7. **Skills + recipes:** `create-issue` and `create-pr` first (most reusable), then `lumira-engineering`, `lumira-frontend`, `add-page`, `add-product`, `add-form`. Fill the reference files from real code as pages get built. Don't write them ahead of the code.
8. **Launch + MCP:** `.claude/launch.json` (`npm run dev`, port 3000). Add `.mcp.json` only if a docs server proves useful.
9. **Hard gates:** Husky (pre-commit → lint-staged, pre-push → verify), GitHub Actions CI, branch protection on `main`.
10. **Smoke test:** the edit to `package-lock.json` is blocked, `git commit --no-verify` is blocked, a lint error is caught after an edit, the stop hook fires once, `/create-pr` without an issue stops, and unsynced core rules fail `rules:check`.

---

## 9. Open questions for the client / team

1. **Scope:** brand and catalogue site with enquiries and a dealer locator, or online sales too? This decides whether checkout and payment skills and tier-1 payment rules are needed.
2. **Content source:** product data in the repo (MDX/JSON), or a headless CMS?
3. **Languages:** English only, or Hindi/regional languages as well (i18n routing)?
4. **Agents:** which tools will the team use (Claude, Cursor, Copilot, Codex)? Generate only those files.
5. **Hosting:** Vercel or elsewhere? This decides the deploy deny list and the preview workflow.
6. **Repo:** GitHub, so `gh`, issue templates and Actions apply?
