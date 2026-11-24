# Patterns

Shapes to copy. Confirm details against `node_modules/next/dist/docs/` — these follow Next.js 16 with `cacheComponents: true`. Replace this file's examples with pointers to real files once they exist.

## Page (Server Component) with dynamic params

```tsx
// app/bikes/[category]/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBike } from "@/lib/catalogue";

export async function generateMetadata({
  params,
}: PageProps<"/bikes/[category]/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const bike = await getBike(slug);
  return bike ? { title: bike.name, description: bike.summary } : {};
}

export default async function BikePage({
  params,
}: PageProps<"/bikes/[category]/[slug]">) {
  const { slug } = await params;
  const bike = await getBike(slug);
  if (!bike) notFound();
  return <BikeDetail bike={bike} />;
}
```

## Cached data access

```ts
// lib/catalogue/get-bike.ts
import { cacheLife, cacheTag } from "next/cache";

export async function getBike(slug: string) {
  "use cache";
  cacheTag("catalogue", `bike:${slug}`);
  cacheLife("days");
  return (await loadCatalogue()).find((bike) => bike.slug === slug) ?? null;
}
```

Don't read `cookies()`/`headers()` inside a `"use cache"` scope; read them outside and pass values in.

## Client component at the leaf

```tsx
"use client";
import { useState } from "react";

export function ColourPicker({ colours }: { colours: ColourOption[] }) {
  const [selected, setSelected] = useState(colours[0]?.id);
  // …
}
```

The parent page stays a Server Component and passes plain data.

## Server Action form

See `docs/agents/recipes/add-form.md`. Shape: `lib/forms/<form>/schema.ts` (zod) → `actions.ts` (`"use server"`, `safeParse`, typed result) → client form component with `useActionState`.

## Price formatting

```ts
const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
export const formatInr = (rupees: number) => INR.format(rupees); // ₹12,499
```
