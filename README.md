# Zaid Hijazi — Security Research Desk

Static GitHub Pages portfolio and field-notes site for the public defensive-security work of Zaid Hijazi.

Live site: [z3x-1337.github.io](https://z3x-1337.github.io/)

## Architecture

The site is intentionally static so it deploys directly through GitHub Pages without a build step or runtime dependencies.

- `index.html` — research-desk home, current direction, project evidence, and latest writing.
- `writing.html` — searchable field-note index.
- `writing/` — individual long-form article pages with table of contents and adjacent-note navigation.
- `projects.html` — project index with public evidence and maturity boundaries.
- `systems.html` — evidence-first working method.
- `stack.html` — demonstrated capabilities and stated development priorities.
- `contact.html` — professional channels and handling boundary.
- `styles.css` — site tokens, responsive layout rules, interaction states, and article typography.
- `script.js` — accessible mobile navigation, reduced-motion-safe reveal enhancement, article TOC state, and local writing search.

## Content standard

The site only presents claims tied to public repositories, documented training, or explicitly stated learning priorities. It does not claim CVEs, third-party findings, client work, bounty payouts, or exploit impact.

## Quality and deployment

- Responsive static HTML/CSS/JavaScript compatible with GitHub Pages.
- Semantic landmarks, skip links, keyboard-visible focus states, accessible mobile navigation, and `prefers-reduced-motion` handling.
- Canonical URLs, Open Graph metadata, article structured data, `robots.txt`, `sitemap.xml`, RSS, and a custom `404.html`.
- No external scripts, analytics, secrets, or package dependencies.

To preview locally, serve the repository with any static web server and open the local URL in a browser.
