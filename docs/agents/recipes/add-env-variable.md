# Recipe: add an environment variable

Tier 1 (secrets).

1. **Name it** in `SCREAMING_SNAKE_CASE`. Use the `NEXT_PUBLIC_` prefix **only** for values that are safe for every visitor to see (e.g. a public analytics site id). API keys, SMTP passwords and CRM tokens never get it.
2. **Document it** in `.env.example` with a comment: what it is, where to get it, an obviously fake example value.
3. **Read it** in one place (e.g. `lib/env.ts`) and validate it at startup, so a missing value fails loudly instead of at the first form submission.
4. **Server-only code** that reads secrets should import `server-only` so it can't end up in a client bundle.
5. **Never** write the real value into code, tests, docs, or `.env*` files through an agent; ask the user to set it locally and in the hosting dashboard.
6. **Verify:** `npm run check -- --full` with the variable unset (should fail clearly or use a safe default) and set.
