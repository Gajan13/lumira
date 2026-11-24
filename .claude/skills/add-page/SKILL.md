---
name: add-page
description: Add a new page or route to the Lumira website (about, story, careers, support, contact, a catalogue route…) with metadata, loading/not-found states, sitemap entry and a test. Use when the user asks for a new page, route, URL or section of the site.
---

# Add a page

Follow `docs/agents/recipes/add-page.md` step by step. Load `lumira-frontend` too.

1. Confirm the issue gives the URL, sections and available content; ask if not.
2. Check `AGENTS.md` §5 and `.claude/skills/lumira-engineering/references/folder-map.md` for the location.
3. Create `app/<path>/page.tsx` (Server Component, `PageProps<'/path'>`, `metadata`/`generateMetadata`).
4. Reuse `components/sections` and `components/ui`; new sections go in `components/sections/`.
5. Add `loading.tsx` / `not-found.tsx` as the recipe says.
6. Add navigation link (if wanted) and the `app/sitemap.ts` entry.
7. Add a test; run `npm run check -- --full`; preview at 360 px and desktop.
8. If the page has a form, switch to the `add-form` skill for that part (tier 1).
9. Run the `reviewer` subagent and report.
