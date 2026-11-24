# Pitfalls

Traps already hit or known up front. Add one line (with the date) whenever something costs time.

## Versions newer than training data

- Next.js 16.4: Middleware is now **Proxy** (`proxy.ts`). `params`/`searchParams` are Promises. `cacheComponents` + `partialPrefetching` are on: data is dynamic by default and you opt in to caching with `"use cache"`. Route segment `runtime` exports aren't supported with Cache Components. Check `node_modules/next/dist/docs/` before using any API from memory.
- `next dev` writes `nextjs-agent-*` blocks into `AGENTS.md` (`experimental.agentFeedback` is on). Don't remove them; commit them.
- Tailwind 4: configuration lives in CSS (`@import "tailwindcss"`, `@theme`), not `tailwind.config.js`.
- React 19: `useActionState` (not `useFormState`); `ref` is a normal prop.

## Tooling

- 2026-11-24: Vitest 5 needs `@types/node` ≥ 22; the project uses `^24` (Node 26 runtime).
- `@testing-library/jest-dom` matchers for Vitest come from `@testing-library/jest-dom/vitest`.
- Don't fix npm peer conflicts with `--force`; bump the conflicting package instead.

- 2026-11-24: after `next build` or big edits, the dev server's Tailwind output can go stale (new colour classes missing, old template classes still present). Stop `next dev`, delete `.next/`, restart.
- Brand tokens (`sky`, `ocean`, `coral` + `-deep`/`-soft` variants) live in `@theme` in `app/globals.css`: Sky 60% surfaces, Ocean 30% text/bars, Coral 10% accent only. Sky and Ocean hex values were read from a mockup — confirm with the client.

## Windows

- The Bash tool is Git Bash; PowerShell 5.1 is also available (no `&&`; use `;` and `if ($?)`). Prefer `npm run …` scripts.
- Line endings are normalised to LF by `.gitattributes`; `rules:check` also normalises CRLF.

## India-specific content

- Prices: `Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })` → `₹1,24,999` (lakh grouping). Don't format by hand.
- Mobile numbers: 10 digits starting 6–9, optionally prefixed `+91`/`0`; strip spaces before validating.
- PIN codes: 6 digits, first digit 1–9.
- Dates: `24 Nov 2026` (`en-IN`, `day: "numeric", month: "short", year: "numeric"`).
