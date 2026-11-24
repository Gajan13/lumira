# Recipe: add a form (enquiry, dealer application, service booking, B2B quote, warranty)

Forms collect personal data. **Tier 1**: deep review and owner approval. Read [risk-tiers.md](../risk-tiers.md) first and `node_modules/next/dist/docs/01-app/02-guides/forms.md` + `server-actions.md`.

1. **Confirm in the issue:** the fields and why each is needed, where submissions go (email address, CRM, sheet — the client decides), who can read them, and the privacy-policy URL.
2. **Schema.** In `lib/forms/<form-name>/schema.ts`, define a zod schema (add zod through [add-dependency.md](add-dependency.md) if it isn't installed). Indian formats: mobile `^[6-9]\d{9}$` after stripping `+91`/spaces, PIN code `^\d{6}$`. Include a required `consent` boolean.
3. **Server Action.** In `lib/forms/<form-name>/actions.ts` with `"use server"`:
   - parse `FormData` with the schema (`safeParse`); return field errors, never throw raw errors to the client;
   - spam protection: a honeypot field plus rate limiting or a CAPTCHA approved by the client;
   - send to the approved destination using secrets from env (see [add-env-variable.md](add-env-variable.md));
   - no `console.log` of the submission; log only an id and outcome;
   - return a typed result `{ ok: true } | { ok: false, errors }`.
4. **UI.** A client component (`"use client"`) using `useActionState` for pending/success/error states. Every field has a `<label>`; errors use `aria-describedby` and `role="alert"`; the submit button shows pending state and can't double-submit. Next to the button: what's collected, why, and a privacy-policy link; the consent checkbox is unchecked by default.
5. **Page.** Place the form in its page (via [add-page.md](add-page.md)); the page itself stays a Server Component.
6. **Tests.** Schema: valid, each invalid field, missing consent. Action: success path with the destination mocked, validation failure, honeypot filled. UI: labels exist, errors render.
7. **Verify.** `npm run check -- --full`; submit the form in the preview with test data only.
8. **Reviewer:** ask for a **deep review**. Put the risk statement in the PR.
