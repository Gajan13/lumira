# Recipe: add a page or route

Use for a new public page (About, Story, Careers, a support page) or a new route segment.

1. **Confirm the issue** lists the URL, the sections on the page, and which content the client has supplied.
2. **Pick the location** using `AGENTS.md` §5: marketing pages under `app/(marketing)/`, catalogue under `app/bikes/`, etc. Use kebab-case folder names; the URL is the folder path.
3. **Create `page.tsx`** as a Server Component:
   - export `metadata` (static) or `generateMetadata` (dynamic, `await params`);
   - type props with `PageProps<'/your/route'>`;
   - compose existing `components/sections/*` and `components/ui/*` before writing new ones.
4. **Loading and errors:** add `loading.tsx` if the page reads data; `not-found.tsx` for dynamic segments; `error.tsx` (client component) only where a section can fail independently.
5. **Navigation:** add the link to the header/footer navigation data if the page should be reachable from it.
6. **SEO:** add the route to `app/sitemap.ts`. Check the title is unique and under ~60 characters; description ~150 characters.
7. **Test:** a `page.test.tsx` that renders the page (or its main section) and checks the `h1` and key content. Async Server Components that read data may be tested through their data functions and child sections instead.
8. **Verify:** `npm run check -- --full` (routes need a build), then preview at `npm run dev` and check at 360 px and desktop widths.
9. **Reviewer:** default mode (tier 3) unless the page includes a form (→ [add-form.md](add-form.md), tier 1).
