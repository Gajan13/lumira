# How each tool gets the rules

| Tool           | Reads                                                                        | Machine-enforced                                              | Instruction-only               |
| -------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------ |
| Claude Code    | `CLAUDE.md` → `@AGENTS.md`; skills in `.claude/skills/`; `reviewer` subagent | permissions + hooks in `.claude/settings.json`, git hooks, CI | everything else in `AGENTS.md` |
| Cursor         | `.cursor/rules/lumira.mdc` (generated, `alwaysApply`) and `AGENTS.md`        | git hooks, CI                                                 | all rules                      |
| GitHub Copilot | `.github/copilot-instructions.md` (generated)                                | git hooks, CI                                                 | all rules                      |
| Codex          | `AGENTS.md` natively                                                         | git hooks, CI                                                 | all rules                      |

## Keeping the generated files in sync

1. Edit the block between `<!-- core-rules:start -->` and `<!-- core-rules:end -->` in `AGENTS.md`.
2. Run `npm run rules:sync`.
3. Commit `AGENTS.md`, `.cursor/rules/lumira.mdc` and `.github/copilot-instructions.md` together.

`npm run verify` (pre-push and CI) fails if they drift. If the team stops using Cursor or Copilot, remove that target from `scripts/sync-rules.mjs` and delete the file.

## Next.js-managed blocks

`next dev` writes `<!-- BEGIN:nextjs-agent-… -->` blocks into `AGENTS.md` and re-adds them if removed. Leave them alone and commit them with your work. Claude's guard hook blocks edits to them.

## Ask-first settings

Tools without Claude-style hooks follow the rules by instruction only, so keep their approvals on:

- **Cursor:** keep terminal-command approval on (don't enable auto-run / "YOLO" mode); review diffs before accepting.
- **Copilot (agent mode):** keep "confirm before running terminal commands" on.
- **Codex:** use the default approval mode (asks before commands outside the workspace and before network access).
- **Claude Code:** don't put `git commit`, `git push` or `gh pr create` in a personal allow-list; `.claude/settings.local.json` is for personal overrides and is git-ignored.

## MCP servers

There is no shared `.mcp.json` yet: Next.js ships version-matched docs in `node_modules/next/dist/docs/`, which agents read directly. Add a shared server only if it proves useful for everyone. Personal servers (Figma, Stitch, …) are added per developer with `claude mcp add` and stay out of the repo.
