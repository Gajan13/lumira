---
name: add-form
description: Build a Lumira form that collects personal data — product enquiry, dealer/distributor application, service booking, bulk or corporate quote, warranty registration, contact — with a zod schema, Server Action, consent text, spam protection and tests. Use for any form or submission flow. Tier 1.
---

# Add a form

Follow `docs/agents/recipes/add-form.md`. Read `docs/agents/risk-tiers.md` and the Next docs `node_modules/next/dist/docs/01-app/02-guides/forms.md` and `server-actions.md` first.

1. Confirm: fields and purpose of each, destination of submissions (client-approved), privacy-policy URL. Ask if unknown — don't pick a destination yourself.
2. `lib/forms/<form>/schema.ts`: zod schema with Indian phone/PIN formats and a required `consent`.
3. `lib/forms/<form>/actions.ts`: `"use server"`, `safeParse(Object.fromEntries(formData))`, honeypot, typed result, secrets from env (`add-env-variable` recipe), no PII in logs, never `"use cache"`.
4. Client form component with `useActionState`, labels, accessible errors, pending state, consent checkbox unchecked by default, notice + privacy link by the submit button.
5. Tests for schema, action (destination mocked) and UI labels/errors.
6. `npm run check -- --full`; submit test data in the preview.
7. Run the `reviewer` subagent with **"deep review"**; include a risk statement in the report/PR.
