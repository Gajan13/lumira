# Safe changes

## Find the blast radius first

- Grep for the symbol, component or route before changing it: `Grep "BikeCard"` across `app/`, `components/`, `lib/`.
- For a shared UI primitive, list every page that renders it and check them in the preview.
- For catalogue types, every page that lists or shows bikes is affected; run `npm run check -- --full`.

## Rules per kind of change

| Change                      | Do                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| rename/move a route         | add a permanent redirect in `next.config.ts` (`redirects`) so old links and search results keep working; update `sitemap.ts` |
| change a product slug       | don't — slugs are permanent URLs. If unavoidable, redirect old → new                                                         |
| add a data field            | make it optional or give a default so existing entries still work                                                            |
| remove a data field / prop  | remove every use in the same change; `npm run check -- --full` catches leftovers                                             |
| change a shared component   | keep the old props working, or update every caller in the same change                                                        |
| change `globals.css` tokens | screenshot affected pages before/after                                                                                       |
| change `next.config.ts`     | tier 1 — deep review; build must pass                                                                                        |

## Keep unfinished work unreachable

Half-built pages must not be linked from navigation or listed in `sitemap.ts`. Missing client content uses `TODO(content): …` placeholders; `grep -r "TODO(content)"` must be empty before launch.

## Before saying done

Run the check for the area (see SKILL.md "Checks by area"), look at the changed pages in the preview, and list anything you noticed but didn't fix as findings.
