---
name: add-product
description: Add or change a Lumira bicycle model or category — specs, price in ₹, colours, images, listing/detail pages, Product JSON-LD and sitemap. Use when the user mentions a new bike, model, category, e-bike, spec sheet, price change, colour or product photos.
---

# Add or change a bicycle model

Follow `docs/agents/recipes/add-product.md`. Tier 2.

1. List the facts needed (name, category, price and whether GST is included, frame, sizes, wheel size, gears, brakes, weight, colours, warranty, images). Ask the user for anything missing; never invent specs or prices — use `TODO(content): …`.
2. Edit/add the entry in `content/`; keep slugs stable and unique; prices as integer rupees.
3. Extend types in `lib/catalogue` only if a new field is needed (optional or defaulted).
4. Add images under `public/images/bikes/<slug>/<colour>-<view>.webp` with alt text in the data.
5. Check listing + detail pages, `generateStaticParams`, cache tags, JSON-LD and sitemap pick it up.
6. Update catalogue tests; run `npm run check -- --full`; preview the pages.
7. Run the `reviewer` subagent; in the report, list what visitors will see differently.
