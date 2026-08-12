# Z3X-1337 — Security Engineering Notes

The public GitHub Pages site for [Zaid Hijazi](https://github.com/Z3X-1337). It presents verified public projects and educational security notes without claiming third-party findings, client work, CVEs, or bounty results.

Live: [z3x-1337.github.io](https://z3x-1337.github.io/)

## Architecture

This is a deliberately dependency-free static site so it can publish directly from the `main` branch through GitHub Pages.

- `index.html` — introduction, research areas, selected work, and recent notes.
- `research/` — searchable research index and four long-form field notes.
- `projects/` — public project evidence and technology boundaries.
- `about/` — working principles, responsible-scope statement, and contact channels.
- `assets/css/site.css` — visual tokens, responsive layout, article styles, and accessibility states.
- `assets/js/site.js` — accessible mobile navigation, reduced-motion-safe enhancements, article progress/TOC, and local search.
- `scripts/verify-site.mjs` — dependency-free verification for HTML structure and internal links.

## Local preview and verification

Any static server can preview the site. For example:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

Run the repository checks with:

```bash
npm run check
```

The verification script checks declared internal links, duplicate document titles, missing page descriptions, and expected accessibility primitives. It intentionally does not execute network requests.

## Content standard

Project claims are tied to the linked public repositories. The four field notes are educational material; illustrative examples are clearly framed as such and do not represent findings against third-party systems.

## Deployment

GitHub Pages can serve the static files directly from the `main` branch. `.nojekyll` prevents Jekyll from rewriting or omitting directories that begin with underscores in future content additions.
