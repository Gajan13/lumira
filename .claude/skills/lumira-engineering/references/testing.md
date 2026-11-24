# Testing

## Setup

- Runner: Vitest (`vitest.config.mts`), environment `jsdom`, setup `vitest.setup.ts` (jest-dom matchers + cleanup).
- Library: `@testing-library/react`; matchers from `@testing-library/jest-dom/vitest`.
- Files: `*.test.ts` / `*.test.tsx` next to the code. Example: `app/page.test.tsx`.
- Run: `npm test` (once), `npm run test:watch`, or as part of `npm run check`.

## What to test

| Code                         | Test                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| form schema                  | valid input; each invalid field; missing consent; Indian phone/PIN formats           |
| Server Action                | success with the destination mocked (`vi.mock`); validation failure; honeypot filled |
| catalogue functions          | data loads; slugs unique; unknown slug → `null`; `formatInr` output                  |
| client component with logic  | user interactions via roles/labels (`getByRole`, `getByLabelText`)                   |
| synchronous Server Component | render and assert headings/text                                                      |
| async Server Component       | test its data function and child components separately                               |

## Style

- Query by role, label or visible text — not by class names or test ids unless there's no accessible handle.
- One behaviour per test; descriptive names (`"shows an error when the PIN code has 5 digits"`).
- No `.only` or `.skip` in commits. No snapshot tests for whole pages.
- Mock at the boundary (email/CRM client, `next/cache` if needed), not internal helpers.

## Later

Playwright end-to-end smoke tests (`e2e/`) for: home → bike listing → bike detail → enquiry form, at mobile and desktop widths. Add when those pages exist and wire into `npm run verify`.
