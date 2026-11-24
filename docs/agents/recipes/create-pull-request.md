# Recipe: create a pull request

1. **Issue:** find the issue number from the branch name (`LUM-<n>`) or ask. Check it's open with `gh issue view <n>`. No issue → stop and offer [create-issue.md](create-issue.md).
2. **Branch:** if on `main`, propose `<type>/LUM-<n>-<summary>` and create it after a yes.
3. **Gate:** `npm run check` (`-- --full` for routes/config). Fix failures before going on.
4. **Reviewer:** run it (deep review for tier 1 — see [risk-tiers.md](../risk-tiers.md)). Fix "Must fix" items.
5. **Findings:** collect unrelated problems noticed along the way.
6. **Body:** fill `.github/pull_request_template.md`: summary, `Closes #n`, risk tier (+ risk statement for tier 1), how it was verified (commands and their result, pages checked, widths), screenshots for visual changes, findings.
7. **Commit:** show the files and a Conventional Commit message (`feat(scope): … (LUM-n)`); commit after a yes.
8. **Push:** ask, then `git push -u origin <branch>` (pre-push runs `npm run verify`; if it fails, fix and retry, never skip).
9. **Open:** ask, then `gh pr create --title "<title>" --body-file <file> --base main`.
10. **Report** the PR URL. Ask separately before posting any comment.
