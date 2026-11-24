# Workflow: issues, findings, PRs

## Issues are specs

Every non-trivial change starts from a GitHub issue created from `.github/ISSUE_TEMPLATE/`. A good issue states:

- **Goal:** what the visitor or the client gets.
- **Acceptance criteria:** checkable bullets.
- **Affected files:** before → after.
- **Content needed from the client:** copy, photos, specs, prices — flagged so work isn't blocked silently.
- **Risk tier** from [risk-tiers.md](risk-tiers.md).

Branch: `<type>/LUM-<issue>-<short-summary>`, e.g. `feat/LUM-14-dealer-locator`. Types: `feat`, `fix`, `content`, `chore`, `docs`, `refactor`.

Recipe: [recipes/create-issue.md](recipes/create-issue.md).

## Findings

While working you will notice problems outside the task (an outdated dependency, a missing alt text on another page, a rule that doesn't fit). Don't fix them in the same change. List them at the end of your report and in the PR under **Findings**; the user decides whether each becomes an issue.

## Pull requests

1. The branch has an open issue.
2. `npm run check` passes (and `-- --full` when routes/config changed).
3. The reviewer has run (deep review for tier 1).
4. The PR body follows `.github/pull_request_template.md` and links the issue with `Closes #n`.
5. Ask before commit, before push, before opening the PR, and before each comment.

Recipe: [recipes/create-pull-request.md](recipes/create-pull-request.md).

## Commits

Conventional Commits with the issue key: `feat(bikes): add size guide (LUM-21)`. Small, coherent commits; no "wip" commits on `main`.
