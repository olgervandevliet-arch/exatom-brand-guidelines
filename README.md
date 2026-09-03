# Exatom brand guidelines

The working reference for how Exatom looks — logo, color, typography, foundations,
UI elements, presentations and social media — plus every brand file to download.

It is a static site. No framework, no database, no build dependencies: one Node
script turns three source files into four pages, and Vercel serves them.

| URL | Page |
|---|---|
| `/` | Brand guidelines |
| `/presentations` | Presentations |
| `/social` | Social media |
| `/downloads` | Every brand file, generated from `assets/` |
| `/brand-guidelines.md` | The brand guidelines as Markdown, generated from the same source |

## Adding a file to the downloads

Drop it into `assets/`, in a subfolder that names the group:

```
assets/
  logo/          → shows up under "Logo"
  fonts/         → shows up under "Fonts"
  decks/         → shows up under "Deck templates"
  anything-else/ → shows up under "Anything else"
```

Commit it (dragging the file into the folder on github.com is enough) and Vercel
rebuilds within a minute. The build script scans the folder, so there is no list
to keep in sync. `README.md` files and dotfiles are skipped.

Everything in this repository is public. Do not put anything here that should not
be — sales decks, pricing sheets, customer data.

## Editing the guidelines

The content lives in three files under `src/`:

| File | Guide |
|---|---|
| `Brand.src.html` | Brand guidelines — logo, color, typography, foundations, UI elements |
| `Presentations.src.html` | Presentations — a coming-soon placeholder for now |
| `Social.src.html` | Social media — a coming-soon placeholder for now |

Presentations and social media are parked. The guides that were written for them
sit next to the placeholders as `Presentations.full.html` and `Social.full.html`;
the build ignores both. To bring one back, copy it over the matching `.src.html`
and rebuild — the sidebar menu returns on its own, because the build only draws
the Sections list when the source has one.

They carry some Claude Design canvas markup (`<x-dc>`, `<helmet>`, `{{ holes }}`)
because the same three files also feed the design canvas. `scripts/build.mjs`
strips it. Edit the HTML inside them and the site follows.

Colors, spacing and type live once, in the `<style>` block of `Brand.src.html`.
The other two files carry only what is specific to their medium; the build scopes
those rules per guide so they cannot leak.

## Running it locally

```bash
npm run build   # writes site/
npm run dev     # builds, then serves site/ on http://localhost:3000
```

## Deploying

Pushing to `main` deploys. Vercel runs `node scripts/build.mjs` and publishes
`site/` — configured in `vercel.json`, nothing to set up by hand.
