---
name: exatom-presentations
description: Builds presentations and slide decks in the Exatom house style (sales decks, pitch decks, client status meetings, webinars). Use whenever someone asks for an Exatom presentation, deck, slides or a single slide, or asks to restyle an existing .pptx or PDF deck for Exatom.
---

# Exatom presentations

The rules for Exatom decks live online and change over time. Always work from the latest version. Everything needed to build a deck ships with this skill, so nobody needs files from someone else's computer.

## 1. Load the latest rules first

Before you design anything, fetch these three files and read them in full:

- https://exatom-brand-guidelines.vercel.app/presentations.md (slide format, backgrounds, slide types, images, copy, deck orders)
- https://exatom-brand-guidelines.vercel.app/brand-guidelines.md (colours, type, logo, team line drawings)
- https://exatom-brand-guidelines.vercel.app/deck-kit.md (the index of templates, images and logos)

If you cannot reach the web, use the copies in `reference/` in this skill and tell the person that you worked from the bundled copy of the date shown at the top of `reference/presentations.md`, which may be out of date.

The online files win over anything else in this skill, and over your own taste.

## 2. Build from the kit, not from scratch

This skill folder contains the deck kit:

- `kit/deck.css`: the complete slide stylesheet. Use it unchanged.
- `kit/slides/*.html`: the Exatom sales deck, 28 slides, one complete HTML page each. `reference/deck-kit.md` says which template fits which slide type.
- `kit/img/`: the visuals the templates use (pitch deck funnel and friction form, platform visuals, product mock-ups, G2 badges, ISO seal, reviewer photos).
- `logo/`, `assets/partners/`, `assets/team/drawings/`: Exatom logos, client logos and the team's line drawings.
- `kit/reviews.md`: every review, word for word.

For each slide, copy the template of the matching type, keep its structure, classes and positions, and replace only the content. Build a new layout only when no template fits, and then from the classes in `kit/deck.css`.

When the surface you build in cannot load files from a URL, embed the files from this folder (inline the SVG, upload or inline the image). When it can, the same files are online under https://exatom-brand-guidelines.vercel.app/kit/, /logo/ and /assets/.

If deck-kit.md online lists a template or image that is not in this folder, fetch it from its link.

## 3. Gather the material

Ask for what is missing, in one short message:

- what the deck is (sales deck, pitch, client status meeting, other), who presents it and to whom;
- the content: an old .pptx or PDF, an outline, or notes;
- for a client deck: the client's logo if it is not in `assets/partners/`, a photo of the client (their product, building or team), screenshots of their real forms, and the Exatom dashboard exports to show.

## 4. Build

- One 1920 x 1080 slide per page, following presentations.md exactly: grid, one eyebrow per slide, backgrounds by role.
- Keep the order and every figure of a deck you restyle. Never invent figures; write [FIGURE] where one is missing.
- Paste real screenshots in; rebuild only generic product visuals that the kit does not have.
- The closing slide shows the presenter's line drawing from `assets/team/drawings/`.

## 5. Check before handing over

Run the checklist at the end of presentations.md and fix what fails.
