# Frontend rules

These are the rules. The `lumira-frontend` skill is the "how". Next.js 16 with `cacheComponents` and `partialPrefetching` is newer than most training data: confirm APIs in `node_modules/next/dist/docs/` first.

## Rendering

1. **Server Components by default.** Pages, layouts and sections render on the server.
2. **`"use client"` at the leaf.** Only components that need state, effects, event handlers or browser APIs (gallery carousel, colour picker, dealer map, form with live feedback). Pass them plain serialisable props.
3. **Data is dynamic by default under Cache Components.** Cache catalogue reads with `"use cache"` (plus `cacheLife` / `cacheTag`) in `lib/catalogue`; wrap genuinely request-time parts (anything reading `cookies()`/`headers()`) in `<Suspense>` with a fallback close to where they're used.
4. **Route params are Promises.** `await params` in pages, layouts and `generateMetadata`. Use the generated `PageProps<'/route'>` / `LayoutProps<'/route'>` types.
5. **Every route segment that loads data** has a sensible `loading.tsx` or `<Suspense>` fallback, and the catalogue has `not-found.tsx` for unknown slugs.

## Data and content

- Product data lives in `content/` and is read only through `lib/catalogue`. No prices, specs or model names typed into components.
- Prices: integer rupees in data; display with `formatInr()` (`₹12,499` style, `en-IN` grouping).
- Missing client content uses `TODO(content): …` placeholders that are easy to grep before launch.

## Styling

- Tailwind 4 utilities; brand colours, fonts, radii and spacing are theme tokens in `app/globals.css` (`@theme`). No hard-coded hex values in components.
- Mobile first; test at 360 px wide. No horizontal scroll.
- Dark mode only if the brand calls for it.

## Images and media

- `next/image` for every photo, with `width`/`height` (or `fill` + `sizes`) and descriptive `alt` (model, colour, view). Decorative images use `alt=""`.
- Only the hero/LCP image gets `priority`/preload.
- Prefer AVIF/WebP sources; keep originals out of `public/` if they're larger than needed.

## SEO

- Every page exports `metadata` or `generateMetadata` (title, description, canonical, Open Graph).
- Bike detail pages add Product JSON-LD (name, image, brand "Lumira", offers in INR).
- `app/sitemap.ts` lists every public route; `app/robots.ts` allows crawling of production only.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, headings in order.
- All controls reachable and operable by keyboard, with visible focus styles.
- Form fields have labels; errors are announced (`aria-describedby`, `role="alert"`).
- Colour contrast meets WCAG 2.2 AA.

## Performance budgets (mobile, mid-range Android, 4G)

- LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms.
- Keep client JavaScript small: prefer server-rendered sections over client libraries; lazy-load maps and heavy galleries.
- No third-party script without an issue that names its purpose and owner.
