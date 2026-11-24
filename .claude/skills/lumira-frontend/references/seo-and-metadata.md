# SEO and metadata

Source docs: `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`, `03-api-reference/04-functions/generate-metadata.md`, `03-api-reference/03-file-conventions/01-metadata/` (sitemap, robots, opengraph-image).

## Every page

- `export const metadata` or `export async function generateMetadata({ params })` (await params).
- Title pattern: set `title.template` once in the root layout (`"%s | Lumira"`); pages give the short title.
- Description ~150 characters, unique per page. Canonical URL via `alternates.canonical` once the production domain is known (`metadataBase` in the root layout).
- Open Graph image: a default `app/opengraph-image.(png|tsx)`; bike pages use the main product photo.

## Bike detail pages — Product JSON-LD

Render in the page as `<script type="application/ld+json">` with `JSON.stringify` of:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Lumira <Model>",
  "brand": { "@type": "Brand", "name": "Lumira" },
  "image": ["https://<domain>/images/bikes/<slug>/<colour>-side.webp"],
  "description": "<summary>",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "12499",
    "availability": "https://schema.org/InStock"
  }
}
```

Only include `offers` if the client confirms prices are public; only include ratings if real reviews exist.

## Site-wide

- `app/sitemap.ts` builds entries from routes + catalogue data (one entry per bike).
- `app/robots.ts` allows everything in production and disallows all on preview deployments.
- Old URLs (from any previous Lumira site) get permanent redirects in `next.config.ts` — ask the client for the old sitemap.
- Languages: English only for now. If Hindi/regional pages are added, use locale route segments and `alternates.languages` (hreflang).
