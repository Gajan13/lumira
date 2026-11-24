# Recipe: add an npm package

1. **Need it?** Check whether Next.js, React or an existing package already covers it. Prefer small, maintained packages with types.
2. **Check it:** weekly downloads, last release date, licence (MIT/Apache/BSD/ISC are fine; ask about anything else), bundle size if it ships to the client.
3. **Install** with npm only: `npm install <pkg>` or `npm install -D <pkg>`. Never edit `package-lock.json` by hand (the Claude guard blocks it).
4. **Client cost:** if it runs in the browser, import it only from the leaf client component that needs it, or load it lazily.
5. **Peer conflicts:** fix the cause (e.g. bump a version) rather than using `--force` or `--legacy-peer-deps`; if unavoidable, explain why in the PR.
6. **Verify:** `npm run check -- --full`.
7. **PR:** say why the package was added and what it replaces, if anything.
