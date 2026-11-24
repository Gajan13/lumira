# Assets and performance

Source docs: `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`, `03-api-reference/02-components/image.md`, fonts guide.

## Images (product photography is most of the page weight)

- `next/image` always. Give `width`/`height`, or `fill` with a parent that has a size and a `sizes` attribute matching the layout (e.g. `sizes="(min-width: 1024px) 33vw, 100vw"` for a 3-column grid).
- The hero (LCP) image gets `priority`/preload; nothing else does.
- Store bike images under `public/images/bikes/<slug>/<colour>-<view>.webp`, max ~2400 px on the long side. Remote images need `images.remotePatterns` in `next.config.ts` (tier 1 change).
- Alt text: "Lumira <Model> in <colour>, side view". Decorative: `alt=""`.

## Fonts

- `next/font` only (already used for Geist in `app/layout.tsx`); expose as CSS variables and map them in `@theme`. Replace Geist with the brand fonts when the client supplies them.
- Subset to `latin` (add `devanagari` only if Hindi content is added).

## JavaScript budget

- Default to zero client JS per section. A client component must justify itself (interaction).
- Lazy-load maps (dealer locator), video, 360° viewers with `next/dynamic` below the fold.
- No third-party script without an issue; load with `next/script` and the least eager strategy that works.

## Budgets (mobile, mid-range Android on 4G)

LCP ≤ 2.5 s · CLS ≤ 0.1 · INP ≤ 200 ms. Check a production build (`npm run build && npm start`) with Lighthouse mobile before release; the dev server isn't representative.
