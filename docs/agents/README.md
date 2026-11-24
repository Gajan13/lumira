# Agent docs — index

Lumira is built by people and coding agents (Claude Code, Cursor, Copilot, Codex). The rules are written once in [`AGENTS.md`](../../AGENTS.md); this folder holds the detail.

## I want to…

| I want to…                                | Read                                                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| understand the rules                      | [`AGENTS.md`](../../AGENTS.md)                                                                                                                   |
| set up my tool (Claude, Cursor, Copilot…) | [tools.md](tools.md)                                                                                                                             |
| open an issue or a PR                     | [workflow.md](workflow.md), [recipes/create-issue.md](recipes/create-issue.md), [recipes/create-pull-request.md](recipes/create-pull-request.md) |
| know if my change needs a deep review     | [risk-tiers.md](risk-tiers.md)                                                                                                                   |
| build a page, component or style          | [frontend.md](frontend.md), [recipes/add-page.md](recipes/add-page.md)                                                                           |
| add or change a bicycle model             | [recipes/add-product.md](recipes/add-product.md)                                                                                                 |
| add an enquiry / dealer / service form    | [recipes/add-form.md](recipes/add-form.md)                                                                                                       |
| add an npm package                        | [recipes/add-dependency.md](recipes/add-dependency.md)                                                                                           |
| add an environment variable               | [recipes/add-env-variable.md](recipes/add-env-variable.md)                                                                                       |
| see how the agent setup was planned       | [agent-setup-plan.md](agent-setup-plan.md)                                                                                                       |

## Enforcement layers

Instructions are soft; commands are hard. Everything important is stated in `AGENTS.md` **and** enforced somewhere a tool can't skip.

| Layer              | What                                                                                    | Applies to |
| ------------------ | --------------------------------------------------------------------------------------- | ---------- |
| Rules              | `AGENTS.md` (+ generated `.cursor/rules/lumira.mdc`, `.github/copilot-instructions.md`) | all tools  |
| Claude permissions | `.claude/settings.json`: secrets unreadable, force-push/deploy denied, commit/push ask  | Claude     |
| Claude hooks       | `.claude/hooks/`: protected files, hook-skipping git, format on edit, lint on stop      | Claude     |
| Git hooks          | Husky: pre-commit lint-staged, pre-push `npm run verify`                                | everyone   |
| CI                 | `.github/workflows/ci.yml`: `npm run verify` on every PR                                | everyone   |
| Branch protection  | `main` requires CI + one review (set in GitHub settings)                                | everyone   |

## Gate commands

| Command                   | Runs                                                     |
| ------------------------- | -------------------------------------------------------- |
| `npm run check -- --fast` | lint, format check, typecheck                            |
| `npm run check`           | + unit tests — the "is it done?" command                 |
| `npm run check -- --full` | + `next build`                                           |
| `npm run verify`          | `rules:check` + `check --full` — pre-push and CI         |
| `npm run rules:sync`      | regenerate Cursor/Copilot rules after editing core rules |

## When a check is wrong

Don't disable it inline. Open an issue describing the false positive, then fix the check (or the rule) in its own PR. `eslint-disable` and `@ts-expect-error` need a comment with the reason and issue number.
