@AGENTS.md

# Claude Code notes

These add to `AGENTS.md` and apply only to Claude.

## Skills

Project skills live in `.claude/skills/`:

- `lumira-engineering`: load for any code change (where code goes, house style, safe changes, testing).
- `lumira-frontend`: load for pages, components, styling, images, SEO and caching.
- `add-page`, `add-product`, `add-form`: workflows for the most common changes; each follows a recipe in `docs/agents/recipes/`.
- `create-issue`, `create-pr`: GitHub workflows.

## Issue first

If the user asks for a feature or fix with no issue number, offer `create-issue` before writing code. Small typo or copy fixes may skip this if the user says so.

## Ask first

Commits, pushes, PRs, issues and comments each need a separate yes. `git commit` and `git push` also prompt through `.claude/settings.json`.

## Verify and review

- Run `npm run check` (or `-- --fast` while iterating, `-- --full` for routes/config) and report the summary lines, not the full log.
- Before saying a change is done, delegate to the `reviewer` subagent. Ask for a "deep review" for tier 1 paths (`docs/agents/risk-tiers.md`).

## Hooks (what will happen to you)

- `pre-tool-guard`: blocks edits to the lockfile, `.env*`, `next-env.d.ts`, generated rule files and the Next.js blocks in `AGENTS.md`, and blocks commands that skip git hooks or force-push. Its message says what to do instead.
- `post-edit-format`: runs Prettier + ESLint on each edited file and reports remaining errors. Fix them right away.
- `stop-checks`: lints changed files once when you finish a turn. Fix what it reports.

## Environment

- Windows. The Bash tool is Git Bash; PowerShell is also available. Prefer `npm run …` scripts, which work in both.
- Preview: `.claude/launch.json` starts `npm run dev` on port 3000.
- Work in the main checkout; no worktrees unless asked.
