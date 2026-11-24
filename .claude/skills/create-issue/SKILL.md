---
name: create-issue
description: Draft and open a GitHub issue (spec) for Lumira with gh. Use when the user asks for an issue, spec, ticket or bug report, asks for a feature or fix without an issue number, or wants a PR for work that has no linked issue.
---

# Create an issue

Follow `docs/agents/recipes/create-issue.md` and `AGENTS.md` §9.

1. `gh auth status`; stop if not logged in. If the repo has no GitHub remote, say so and offer to draft the issue as text instead.
2. Search duplicates: `gh issue list --search "<keywords>" --state all --limit 10`.
3. Ask at most 3 clarifying questions.
4. Read the relevant code briefly; draft using the Feature or Bug headings from `.github/ISSUE_TEMPLATE/` (affected files before → after, content needed from the client, risk tier from `docs/agents/risk-tiers.md`).
5. List findings separately.
6. Show the draft; wait for a clear yes.
7. Write the body to a temp file; `gh issue create --title … --body-file … --label feature|bug`.
8. Report the URL and branch name `<type>/LUM-<n>-<summary>`.
