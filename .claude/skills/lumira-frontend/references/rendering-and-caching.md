# Rendering and caching (Next.js 16, Cache Components)

Source docs: `node_modules/next/dist/docs/01-app/01-getting-started/` (caching, fetching-data), `03-api-reference/01-directives/use-cache.md`, `03-api-reference/05-config/01-next-config-js/cacheComponents.md`.

## The model

- With `cacheComponents: true`, Next prerenders a **static shell** for each route and streams dynamic parts into it.
- Data fetching is **dynamic by default**. Opt into caching with `"use cache"` at file, component or function level; cached functions must be `async`.
- `cacheLife("minutes" | "hours" | "days" | …)` sets freshness; `cacheTag("catalogue")` lets you invalidate with `revalidateTag` / `updateTag` when content changes.
- Runtime APIs (`cookies()`, `headers()`, `searchParams`) make their subtree dynamic: put it inside `<Suspense>` so the rest of the page stays in the shell.
- A layout that reads runtime data blocks navigation (it doesn't fall back to `loading.tsx`); Cache Components reports this at build time. Move the access into the page or wrap it in `<Suspense>`.
- `partialPrefetching: true`: `<Link>` prefetches the static parts of routes by default; `prefetch={true}` on a link fetches more.
- Navigations keep recently visited routes mounted but hidden (React `<Activity>`): effects clean up and re-run; component state survives back/forward.

## Lumira defaults

| Data                          | Cache                                                       |
| ----------------------------- | ----------------------------------------------------------- |
| catalogue (bikes, categories) | `"use cache"`, `cacheTag("catalogue")`, `cacheLife("days")` |
| dealer list                   | `"use cache"`, `cacheTag("dealers")`, `cacheLife("days")`   |
| marketing copy in `content/`  | static (read at build)                                      |
| anything with personal data   | never cached                                                |

## Client/server handoff

- Server Components fetch and pass **plain serialisable props** (no class instances, functions or Dates — pass ISO strings).
- Client components never import from server-only modules (`import "server-only"` in those modules makes mistakes fail loudly).
