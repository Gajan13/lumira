# Folder map

Current state (Nov 2026): a fresh Next.js app. Folders below marked _(planned)_ are created when the first feature needs them — don't create empty ones. Update this file when a folder appears.

```
app/                        App Router routes
  layout.tsx                root layout: fonts, <html lang="en">, global styles
  page.tsx                  home page
  globals.css               Tailwind import + @theme brand tokens
  (marketing)/              (planned) about, story, careers
  bikes/                    (planned) /bikes, /bikes/[category], /bikes/[category]/[slug]
  dealers/                  (planned) dealer locator
  support/                  (planned) service booking, warranty, FAQs
  contact/                  (planned) enquiry forms
  sitemap.ts, robots.ts     (planned) SEO metadata routes
components/ui/              (planned) brand primitives — no data fetching
components/sections/        (planned) page sections built from ui/
lib/catalogue/              (planned) product types, data access ("use cache"), formatInr
lib/forms/<form>/           (planned) schema.ts + actions.ts per form
lib/seo/                    (planned) metadata + JSON-LD helpers
content/                    (planned) catalogue/page content (JSON or MDX)
public/images/              static images; bikes under public/images/bikes/<slug>/
scripts/                    check.mjs, verify.mjs, sync-rules.mjs
docs/agents/                agent docs and recipes
.claude/                    Claude settings, hooks, skills, reviewer
```

## Where does it go?

| I need…                                   | Put it in                     |
| ----------------------------------------- | ----------------------------- |
| a new URL                                 | `app/<path>/page.tsx`         |
| a reusable button/card/badge              | `components/ui/`              |
| a page block (hero, spec table, CTA band) | `components/sections/`        |
| reading product data                      | `lib/catalogue/`              |
| a form's validation + submit logic        | `lib/forms/<form>/`           |
| page titles, JSON-LD                      | `lib/seo/`                    |
| copy, specs, prices                       | `content/`                    |
| a brand colour/font/spacing               | `@theme` in `app/globals.css` |
| a one-off helper used by one component    | next to that component        |
