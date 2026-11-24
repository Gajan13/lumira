# Risk tiers

The tier decides how much review a change needs. When a change touches several tiers, the highest one applies.

| Tier             | Areas                                                                                                                                                                                                                                                                                                                                                                                                                                  | Required                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **1 — critical** | Personal data from forms (enquiries, dealer applications, service bookings, warranty registration): `lib/forms/**`, any `actions.ts`. Secrets and env: `.env.example`, anything reading `process.env`. `proxy.ts`, `next.config.ts` (headers, redirects, images). Payments/checkout and authentication, if ever added. CI and agent config: `.github/workflows/**`, `.claude/settings.json`, `.claude/hooks/**`, `scripts/verify.mjs`. | reviewer in **deep review** mode, owner approval, a one-paragraph risk statement in the PR  |
| **2 — careful**  | Catalogue data and prices: `content/**`, `lib/catalogue/**`. SEO: `app/sitemap.ts`, `app/robots.ts`, metadata helpers, redirects. Analytics, cookie/consent banner, third-party scripts. Dealer locator data.                                                                                                                                                                                                                          | reviewer (default mode) + careful PR description listing what visitors will see differently |
| **3 — normal**   | Visual and copy changes, new marketing sections, components without data or forms, docs.                                                                                                                                                                                                                                                                                                                                               | normal gate (`npm run check`, reviewer)                                                     |

## Why personal data is tier 1

Forms collect names, phone numbers, emails and addresses from customers and dealers. India's Digital Personal Data Protection Act, 2023 expects a clear notice of what is collected and why, consent, and protection of that data. For every form:

- show what is collected, why, and a link to the privacy policy next to the submit button;
- collect only fields the purpose needs;
- validate on the server; never trust client validation alone;
- never log raw submissions or cache them with `"use cache"`;
- send submissions only to the destination the client approved (email/CRM), over HTTPS, with secrets in env variables.

## Deep review checklist

The `reviewer` subagent's deep mode (`.claude/agents/reviewer.md`) checks the items above plus: Next.js APIs exist in this version, client/server boundary, scope, tests, accessibility, docs.
