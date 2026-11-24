# Recipe: create an issue

1. `gh auth status` — stop and ask the user to log in if it fails.
2. Search for duplicates: `gh issue list --search "<keywords>" --state all --limit 10`.
3. Ask at most 3 questions if the goal, acceptance criteria or content source are unclear.
4. Read the relevant code briefly and draft the issue with the Feature or Bug form headings from `.github/ISSUE_TEMPLATE/`:
   - Feature: Goal · Acceptance criteria · Affected files (before → after) · Content needed from client · Risk tier · Out of scope.
   - Bug: What happened · Expected · Steps to reproduce · Page/URL and device · Affected files · Risk tier.
   - Add a Mermaid diagram only if a flow or data path changes.
5. List findings (unrelated problems you noticed) separately, not in the issue.
6. Show the draft and wait for a clear yes.
7. Write the body to a temp file and run `gh issue create --title "<title>" --body-file <file> --label <feature|bug>`.
8. Report the issue URL and the branch name: `<type>/LUM-<number>-<short-summary>`.
