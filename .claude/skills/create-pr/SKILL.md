---
name: create-pr
description: Create, open or raise a pull request for Lumira — checks the issue, runs the gate and reviewer, fills the PR template, and asks before each commit, push, PR and comment. Use whenever the user says create/open/raise/submit a PR.
---

# Create a pull request

Follow `docs/agents/recipes/create-pull-request.md`. Each of commit, push, PR, comment needs its own yes.

1. Find the issue (`LUM-<n>` in the branch, or ask); `gh issue view <n>` must be open. None → stop and offer `create-issue`.
2. On `main`? Propose `<type>/LUM-<n>-<summary>`; create after a yes.
3. `npm run check` (`-- --full` for routes/config/metadata). Fix failures.
4. `reviewer` subagent (deep review for tier 1). Fix "Must fix".
5. Collect findings.
6. Fill `.github/pull_request_template.md` into a temp file: summary, `Closes #n`, risk tier (+ risk statement for tier 1), verification (commands + results, pages and widths checked), screenshots for visual changes, findings.
7. Show files + Conventional Commit message `type(scope): … (LUM-n)`; commit after a yes.
8. Ask; `git push -u origin <branch>`. Pre-push runs `npm run verify`; on failure fix and retry — never skip hooks.
9. Ask; `gh pr create --base main --title … --body-file …`.
10. Report the PR URL. Ask separately before any comment.
