# Recipe: add or change a bicycle model

Use for a new model, a new category (e.g. city, mountain, kids, e-bike), or changes to specs, prices, colours or images. Tier 2.

1. **Get the facts from the client.** Model name, category, price (₹, incl. GST or not — state which), frame material and size range, wheel size, gearing, brakes, weight, colours, warranty, images per colour. Never invent missing values; use `TODO(content): …`.
2. **Data first.** Add or edit the entry in `content/` (one file per model, or one per category — follow what exists). Keep a stable `slug` (kebab-case, never reused); prices are integer rupees.
3. **Types.** If a new field is needed, add it to the product type in `lib/catalogue` and give it a default or mark it optional so existing entries still validate.
4. **Images.** Put optimised images under `public/images/bikes/<slug>/` named `<colour>-<view>.webp` (e.g. `matte-black-side.webp`). Every image gets descriptive alt text in the data.
5. **Pages.** Listing (`/bikes`, `/bikes/[category]`) and detail (`/bikes/[category]/[slug]`) pages read the data through `lib/catalogue`; they should need no change for a new model. If they do, that's a code change: note it in the PR.
6. **Static params and cache.** Make sure the new slug is returned by `generateStaticParams` (if used) and that catalogue cache tags cover it.
7. **SEO.** The detail page emits Product JSON-LD and appears in `app/sitemap.ts` automatically from the data. Check both.
8. **Test.** Update catalogue tests (data loads, slug is unique, price formats as ₹). Add a case for any new field.
9. **Verify.** `npm run check -- --full`; open the listing and detail pages in the preview.
10. **PR.** List what visitors will see differently (new model, changed price) so the client can confirm.
