---
name: lumira-engineering
description: How to make any code change in the Lumira website (Next.js 16 + React 19 + Tailwind 4) — where code goes, house style, safe changes, tests and verification. Load it for every code task in this repo, even if the user doesn't mention patterns or style.
---

# Lumira engineering

`AGENTS.md` says **what** the rules are; this skill is **how** to follow them.

## The loop for any change

1. **Understand.** Read the issue (or ask for one: `create-issue`). Restate the acceptance criteria in one line each.
2. **Reuse first.** Search before writing: `components/ui`, `components/sections`, `lib/*`. See [references/folder-map.md](references/folder-map.md).
3. **Design outside-in.** Data shape (`content/`, `lib/catalogue` types) → server logic (`lib/*`, Server Actions) → page (`app/`) → components. For forms follow the `add-form` skill; for pages `add-page`; for bikes `add-product`.
4. **Check the API.** Any Next.js API you're not certain of: find it in `node_modules/next/dist/docs/` first (Grep the docs folder for the name).
5. **Change safely.** Smallest change that meets the criteria. See [references/safe-changes.md](references/safe-changes.md).
6. **House style** (below). The post-edit hook formats and lints each file; fix what it reports at once.
7. **Test** behaviour, next to the code. See [references/testing.md](references/testing.md).
8. **Verify with commands:** `npm run check -- --fast` while iterating, `npm run check` before done, `-- --full` for routes/config/metadata.
9. **Reviewer** subagent (deep review for tier 1), then report: what changed, check result, findings.

## House style

- Prettier + ESLint zero warnings; TypeScript strict — no `any`, `!`, `@ts-ignore`.
- Components `PascalCase.tsx` with a named export (pages/layouts use default export as Next requires). One component per file unless tiny and private.
- Functions are verbs (`getBikes`, `formatInr`), booleans `is/has/can`, constants `SCREAMING_SNAKE_CASE` with units.
- `@/` imports across folders, relative within one folder. No barrel files that pull server code into client bundles.
- Props: small explicit types; accept `className` on UI primitives and merge it last.
- Errors: Server Actions return typed results; pages use `notFound()` for unknown slugs; never swallow errors silently.
- Comments explain why. No commented-out code.

## Checks by area

| You changed…                          | Run                                        | Also                                  |
| ------------------------------------- | ------------------------------------------ | ------------------------------------- |
| a component or style                  | `npm run check`                            | look at it in the preview at 360 px   |
| a page, layout, route, metadata       | `npm run check -- --full`                  | preview the route                     |
| `next.config.ts`, `proxy.ts`          | `npm run check -- --full`                  | deep review (tier 1)                  |
| a form / Server Action                | `npm run check -- --full`                  | deep review (tier 1)                  |
| catalogue data or types               | `npm run check -- --full`                  | listing + detail pages in the preview |
| core rules in `AGENTS.md`             | `npm run rules:sync` then `npm run verify` |                                       |
| agent config (`.claude/`, `scripts/`) | `npm run check`                            | deep review (tier 1)                  |

## Token use

- Read the smallest relevant file region; Grep before Read.
- Trust `npm run check` output; open the log path only for a failure you can't understand from the tail.
- Don't paste large files or logs into the report; give `file:line` and one-line causes.

## Self-check before saying done

- [ ] Acceptance criteria met, nothing outside scope changed.
- [ ] No hard-coded prices/specs, secrets, or `NEXT_PUBLIC_` misuse.
- [ ] `"use client"` only where needed.
- [ ] Tests added/updated; `npm run check` (or `--full`) passes.
- [ ] Reviewer PASS; findings listed.
- [ ] Recipes/docs updated if a procedure changed. New trap found? Add it to [references/pitfalls.md](references/pitfalls.md).

## References

- [folder-map.md](references/folder-map.md) — layout and "where does it go?"
- [patterns.md](references/patterns.md) — page, client component, data access, Server Action, metadata
- [safe-changes.md](references/safe-changes.md) — blast radius, additive changes
- [testing.md](references/testing.md) — Vitest + Testing Library setup and patterns
- [pitfalls.md](references/pitfalls.md) — traps already hit
