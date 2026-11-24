---
name: lumira-frontend
description: Decision guide for Lumira's pages, layouts, components, styling, images, SEO and caching in Next.js 16 (Cache Components, partial prefetching), React 19 and Tailwind 4. Load it for any UI, page, layout, styling, image, metadata or performance work, even small visual tweaks.
---

# Lumira frontend

Rules: `docs/agents/frontend.md`. This skill is how to apply them.

**Versions matter.** Next.js 16.4, React 19.3, Tailwind 4.3 differ from older training data. Before using an API, Grep `node_modules/next/dist/docs/` for it (e.g. `use-cache.md`, `forms.md`, `proxy.md`, `generate-metadata.md`, `image.md`).

## The frontend loop

1. **Match the design against the data.** Every element on the mockup maps to a content field or a fixed string. No buttons wired to nothing, no fields the data doesn't have — raise those as questions.
2. **Server first.** Build the section as a Server Component; mark only interactive leaves `"use client"`.
3. **Decide caching** with the table below.
4. **Build with tokens.** Tailwind utilities + `@theme` tokens from `app/globals.css`; mobile first.
5. **Images and metadata** — see references.
6. **Accessibility pass:** headings, labels, focus, alt text, contrast.
7. **Verify:** `npm run check -- --full`, then preview at 360 px and ≥1280 px.

## Rendering decisions

| Situation                                        | Use                                                                          |
| ------------------------------------------------ | ---------------------------------------------------------------------------- |
| static marketing content                         | Server Component; part of the prerendered shell automatically                |
| catalogue data (changes when the client updates) | `"use cache"` data function in `lib/catalogue` with `cacheTag` + `cacheLife` |
| per-request data (cookies, headers, geolocation) | read outside cache scopes, render inside `<Suspense fallback>` near the use  |
| interactivity (gallery, colour picker, filters)  | small `"use client"` component receiving plain props                         |
| heavy widget (map, 360° viewer)                  | client component loaded lazily (`next/dynamic`) below the fold               |
| form                                             | Server Action + client form with `useActionState` (`add-form` skill)         |
| shareable filter state (category, price range)   | URL `searchParams` (a Promise in pages), not client state only               |

## Common mistakes

| Wrong                                         | Right                                            |
| --------------------------------------------- | ------------------------------------------------ |
| `"use client"` on a whole page for one button | extract the button into its own client component |
| `params.slug`                                 | `const { slug } = await params`                  |
| `middleware.ts`                               | `proxy.ts` (Next 16 rename)                      |
| `export const runtime = "edge"`               | not supported with Cache Components — remove     |
| `cookies()` inside a `"use cache"` function   | read outside, pass the value in as an argument   |
| `<img src>` for product photos                | `next/image` with sizes and alt                  |
| `bg-[#e63946]`                                | a `@theme` token, e.g. `bg-brand`                |
| `₹{price}` / `toLocaleString()` by hand       | `formatInr(price)`                               |
| `tailwind.config.js`                          | Tailwind 4 config in CSS (`@theme`)              |

## Self-check

- [ ] No unnecessary client components; no server-only imports in client files.
- [ ] Data-reading segments have a loading state; unknown slugs hit `notFound()`.
- [ ] Every image: `next/image`, sized, meaningful alt; only the LCP image is prioritised.
- [ ] Metadata present and unique; bike pages emit Product JSON-LD; route in sitemap.
- [ ] Keyboard and screen-reader basics work; contrast AA.
- [ ] `npm run check -- --full` passes; pages checked in the preview at mobile and desktop widths.

## References

- [rendering-and-caching.md](references/rendering-and-caching.md)
- [assets-and-performance.md](references/assets-and-performance.md)
- [seo-and-metadata.md](references/seo-and-metadata.md)
- [three-scene.md](references/three-scene.md) — the scroll-driven 3D bike: files, rules, swapping in the real model
