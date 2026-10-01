# Exatom presentations

Updated: 30 September 2026

The rules for every Exatom deck: sales decks, pitch decks and client status meetings. Written for people and for Claude. Give this file to Claude together with your content and it builds the deck in the Exatom style.

Colours, type and logo come from the brand guidelines (https://exatom-brand-guidelines.vercel.app/brand-guidelines.md). This file only says how they land on a slide.

---

## 1. How to use this file with Claude

The easiest way is the Claude skill `exatom-presentations` (download: https://exatom-brand-guidelines.vercel.app/exatom-presentations-skill.zip). Install it once; from then on Claude loads this file whenever someone asks for an Exatom deck, and always fetches the latest version from this address.

Without the skill, paste the link `https://exatom-brand-guidelines.vercel.app/presentations.md` into the chat. A downloaded copy of this file does not update, so avoid it unless Claude cannot reach the web.

Then:

1. Start a Design in Claude (the Design template, `/design`) for a slide canvas, or a normal chat.
2. Add your material: an old `.pptx` or PDF, an outline, meeting notes, screenshots, the client's logo.
3. Say what the deck is: a sales deck, a pitch, or a status meeting for a client, who presents it and for whom.
4. Claude builds one artboard per slide (1920 x 1080). Review on the canvas, comment on a slide, ask for changes.

When Claude builds from an existing deck, it keeps the order and the content, and restyles everything with the rules below. It never invents figures.

**Changing a rule.** Edit `src/presentations.md` in the brand guidelines repository, update the date at the top and push. Within a minute every Claude using the skill or the link works from the new version; nobody has to reinstall anything.

---

## 2. Format and grid

| Item | Rule |
|---|---|
| Slide size | 1920 x 1080 px, 16:9 |
| Margin | 48 px on all four sides |
| Columns | 4 columns of 432 px, 32 px gutters |
| Content area | starts at y 112 (under the eyebrow), ends 96 px above the bottom |
| Footer | "© 2026 Exatom B.V." bottom left, slide number bottom right, 16 px, 40 px from the bottom |

Layouts use the columns: a title in column 1 with content in columns 2 to 4, or a title on top with content across all four, or text in columns 1 to 2 with a visual in columns 3 to 4.

---

## 3. Backgrounds: one role each

| Background | Hex | Use it for |
|---|---|---|
| Blue Light | `#E8EEFF` | Slides with white cards: results, reviews, lists of points, insights |
| White | `#FFFFFF` | Slides whose main element is a visual on the gradient; alternative ground with cards that carry a 1 px `#E6E2DF` border |
| Dark | `#18122D` | Cover, agenda, chapter slides, the platform slide |
| Blue | `#2A5AE9` | The closing slide, a single statement |
| Blush | `#FEEFEF` | The problem: funnel loss (ink `#440020`, Coral only on the loss) |
| Burgundy | `#440020` | The cause: friction points in a form (ink `#FEEFEF`) |

- Behind a visual (a product shot, a phone, a form) use the blue gradient: `linear-gradient(180deg, #E8EEFF 0%, #2A5AE9 100%)`, 8 px radius.
- Never Warm White `#F7F4F2` as a slide background. Never the painted landscapes (those are for the website only). No Mint or Teal.
- On Dark all text is Blue Light `#E8EEFF`; secondary text uses opacity (72%, 60%).
- Coral `#FF5E74` only marks loss, errors or friction.

---

## 4. Type

Instrument Sans SemiBold for headings and figures, Inter for everything you read. Nothing heavier than 600. Sentence case.

| Style | Size | Tracking | Line height |
|---|---|---|---|
| Chapter title and number | 200 px | -4.5% | 0.95 |
| Cover title | 120 px | -4% | 1.0 |
| Statement | 96 px | -4% | 1.02 |
| Figure in a card | 96 to 112 px | -4.5% | 1.0 |
| Slide title | 64 px | -3.5% | 1.02 |
| Card title | 36 px | -2% | 1.1 |
| Body | 24 px, Inter | 0 | 1.5 |
| Label, caption, footer | 16 to 20 px, Inter | 0 | 1.4 |

Two-tone text is allowed for statements and quotes: the key words in full Dark, the rest in `#747181`.

---

## 5. The label above a slide

One eyebrow per slide, top left at 48 / 48: the website's ink-tinted pill.

```css
.eyebrow { display: inline-flex; align-items: center; height: 36px; padding: 0 14px; border-radius: 8px;
  background: rgba(24, 18, 45, 0.06); color: rgba(24, 18, 45, 0.66); font-size: 18px; font-weight: 500; }
/* on Dark: background rgba(232, 238, 255, 0.08); color rgba(232, 238, 255, 0.72) */
```

It names the section ("Results", "The platform", "Insurance funnel"). Never a two-part breadcrumb.

---

## 6. Building blocks

- **Card**: white, 8 px radius, no shadow, no left-border accent.
- **Result card**: logo top left, figure (Instrument Sans 96 to 104 px) and a short label at the bottom.
- **Numbered list**: rows with 1 px hairlines (`rgba(24,18,45,0.14)`, on Dark `rgba(232,238,255,0.22)`), the number on the right at 70% opacity.
- **Chip**: a pill, 48 px high. Green chip for results (`#DCF5E7` / `#135C37`, dot `#1DB463`), coral tint for problems (`#FFF1F3` / `#C4314B`).
- **Stage**: the blue gradient panel that holds a visual.
- **Phone**: 340 px wide screen in a 10 px `#18122D` bezel with a 48 px radius.
- **Pre / post table**: metric, pre period (grey figure), post period (Dark figure), change as a green chip; under it Exatom's feedback and a Blue Light box with the absolute numbers.

---

## 7. Slide types

1. **Cover**: Dark. Exatom logo with the Blue icon top left. Title, a short line, and G2 badges without a background bottom left. Right: the visual in a stage. For a client deck: the client's logo, always in white, next to Exatom's (thin divider) and a photo of the client (their product, their building) as the background behind the visual.
2. **Agenda**: Dark, title in column 1, numbered hairline list in columns 2 to 3.
3. **Chapter**: Dark. Title 200 px top left, number 200 px top right, a short intro bottom left, the chapter's contents as a numbered list bottom right, the Exatom icon bottom right.
4. **Statement**: one sentence. Two-tone on White or Blue Light, or white on Blue.
5. **Problem**: the pitch deck's two slides, built from templates 03 and 04 in the deck kit with their images. Blush with the funnel ("Brands consider a conversion rate of <20% ... as normal. We don't.") and Burgundy with the form full of friction points ("The average online form contains 20+ friction points").
6. **Results wall**: template 02, the pitch deck's "And it works!" on Blue Light, 4 x 2 result cards, the sectors on the right of the title.
7. **Platform**: template 07, the pitch deck's "One platform: detect, fix and guide visitors to conversion." on Dark, three visuals (Sense, AI CRO agent, Activation) with a numbered caption under each.
8. **Product**: White, a row of feature tabs (active tab Dark), title and one line in column 1, the product visual in a stage in columns 2 to 4.
9. **Use case**: White, title and labelled blocks (for example "Guidance nudge", "Campaign objective") in columns 1 to 2, the visual in columns 3 to 4, the client result as a green chip.
10. **Before and after**: a pre / post table next to the real screenshot in a phone or card.
11. **Funnel**: Blue Light, the steps as white cards on a Blue line, the drop-off per step in Coral below with the mobile and desktop split.
12. **Reviews**: Blue Light, 2 x 2 cards: logo, quote with the key words in Dark, round photo, name and role. Quotes word for word.
13. **Logo wall**: five per row, tiles follow the background, G2 row under it.
14. **Closing**: Blue. "Let's start!" (or "Thank you") at 200 px, the presenter's line drawing below it (the SVG from section 8), the contact list with white hairlines on the right, the white logo top right.

A complete example, the 28-slide sales deck built with these rules, is on https://exatom-brand-guidelines.vercel.app/presentations (each slide at `/slides/<number>-<name>.webp`).

---

## 8. Images

- **Real screenshots are pasted in.** A client's own web form, phone screen or configurator, and Exatom dashboard exports with client data (conversion paths, field tables), go in as images, framed in a white card or a phone on the gradient. Never rebuild a client's real interface.
- **Generic product visuals come from the deck kit** (section 12) when it has one. Otherwise they are rebuilt as HTML mock-ups in brand style: white card, 16 px radius, Inter, small caps labels, Blue for the active element, Coral only for loss, green pills for results.
- **Photos keep their aspect ratio.** Never crop a group photo into a tighter box. Case covers are photos of the company itself.
- **The presenter** appears as a line drawing (dark lines on Blue), never as a regular photo on the closing slide. Use the official SVG, never redraw or crop it into a circle:

| Person | Line drawing (SVG) |
|---|---|
| Stephan van den Bremer | https://exatom-brand-guidelines.vercel.app/assets/team/drawings/stephan.svg |
| Michaël Vaes | https://exatom-brand-guidelines.vercel.app/assets/team/drawings/michael.svg |
| Filip Lauweres | https://exatom-brand-guidelines.vercel.app/assets/team/drawings/filip.svg |
| Bart de Fluiter | https://exatom-brand-guidelines.vercel.app/assets/team/drawings/bart.svg |
| Oliver Bath | https://exatom-brand-guidelines.vercel.app/assets/team/drawings/oliver.svg |
| Sander Heymans | https://exatom-brand-guidelines.vercel.app/assets/team/drawings/sander.svg |
| Marcelo Bem | https://exatom-brand-guidelines.vercel.app/assets/team/drawings/marcelo.svg |
| Olger van de Vliet | https://exatom-brand-guidelines.vercel.app/assets/team/drawings/olger.svg |
| Matthieu | https://exatom-brand-guidelines.vercel.app/assets/team/drawings/matthieu.svg |

  The drawing stands on the bottom edge of the slide, about 640 px high, left of centre; lines stay Dark `#18122D` (or white on Dark).
- **Logos**: client logos from the brand guidelines' Partners page; on the cover the client's logo is always white; the Exatom logo variants from the Brand page.

---

## 9. Copy

- British spelling: optimise, analyse, colour, licence plate.
- Say prospects (lead forms), buyers (checkouts), visitors (privacy and measuring). Never "users" or "trial".
- Product names: Smart Nudges, Autofixes, Eureka, CRO Pulse. Not "Smart Tooltip", "Nudging" or "Autofixing".
- No em dashes.
- Fixed figures: 87% of prospects abandon the average web form; 20+ friction points in the average form; 23% average uplift across Exatom customers.
- Customer figures come from the case study or the client's own data, never typed from memory. When a figure is unknown, leave a placeholder like [FIGURE].
- A client's own field and step names (for example Dutch form labels) stay as they are.

---

## 10. Deck orders

**Sales deck**: Cover, Results wall, Problem (funnel), Problem (friction), Platform, product slides, How it works, Privacy by design, Reviews, chapter per product with use cases, Closing.

**Client status meeting**: Cover with the client's logo, Agenda, Company updates, Impact of Autofixes (before and after), Analysis per funnel (funnel, insights, conversion path and field table per step, findings), Open items and A/B tests, Proposal, Closing with the presenter.

**Pitch**: Cover, Problem (funnel), Problem (friction), Statement, Platform, Results wall, Reviews, market and metrics, team, Closing.

---

## 11. Checklist before sharing

- Every slide has one eyebrow, a title and a footer with the slide number.
- Backgrounds follow section 3; the gradient only sits behind visuals.
- No Warm White, no landscapes, no shadows, no left-border cards, no emoji.
- Real screenshots are pasted in, not redrawn; photos are not cropped awkwardly.
- Figures are sourced; copy is British and uses the product names.
- The cover carries the client's logo and photo when the deck is for a client.
- The closing slide shows the presenter's line drawing and contact details.

---

## 12. The deck kit: templates, images and the CSS

Never build a slide from scratch when a template exists. The deck kit holds everything, online and inside the skill:

- **Index**: https://exatom-brand-guidelines.vercel.app/deck-kit.md lists every template, image and logo with its link. Read it before building.
- **Slide templates**: the sales deck's 28 slides as HTML, at `https://exatom-brand-guidelines.vercel.app/kit/slides/<number>-<name>.txt` (markup) and `.html` (to view). Copy the template of the matching slide type, keep its structure and classes, replace only the content.
- **Images**: `https://exatom-brand-guidelines.vercel.app/kit/img/` holds the pitch deck funnel and friction form, the three platform visuals, the product mock-ups, the cover visual, the G2 badges, the ISO 27001 seal and the reviewer photos.
- **Reviews**: https://exatom-brand-guidelines.vercel.app/kit/reviews.md, word for word.
- **CSS**: https://exatom-brand-guidelines.vercel.app/kit/deck.css, the complete stylesheet, also printed below. Use it unchanged.

```css
/* Exatom deck system: 1920 x 1080, 48 px margin, 4 columns of 432 px with 32 px gutters. */
.s { position: relative; width: 1920px; height: 1080px; box-sizing: border-box; overflow: hidden; font-family: 'Inter', sans-serif; color: #18122D; -webkit-font-smoothing: antialiased; }
.s * { box-sizing: border-box; }
.bl { background: #E8EEFF; }
.wh { background: #FFFFFF; }
.dk { background: #18122D; color: #E8EEFF; }
.bu { background: #2A5AE9; color: #FFFFFF; }
.bs { background: #FEEFEF; color: #440020; }

/* Breadcrumb and footer */
.crumb { position: absolute; top: 48px; left: 48px; right: 48px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 32px; font-size: 18px; font-weight: 500; color: #464157; }
.dk .crumb { color: rgba(232, 238, 255, 0.6); }
.bs .crumb { color: rgba(68, 0, 32, 0.7); }
.foot { position: absolute; left: 48px; right: 48px; bottom: 40px; display: flex; justify-content: space-between; font-size: 16px; color: #747181; }
.dk .foot { color: rgba(232, 238, 255, 0.5); }
.bu .foot { color: rgba(255, 255, 255, 0.72); }
.bs .foot { color: rgba(68, 0, 32, 0.6); }

/* Content area under the breadcrumb: 4-column grid */
.grid { position: absolute; left: 48px; right: 48px; top: 112px; bottom: 96px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 32px; row-gap: 32px; }

/* Type */
.h-cover { margin: 0; font-family: 'Instrument Sans', sans-serif; font-weight: 600; font-size: 120px; line-height: 1; letter-spacing: -0.04em; text-wrap: balance; }
.h-chap { margin: 0; font-family: 'Instrument Sans', sans-serif; font-weight: 600; font-size: 200px; line-height: 0.95; letter-spacing: -0.045em; }
.h-state { margin: 0; font-family: 'Instrument Sans', sans-serif; font-weight: 600; font-size: 96px; line-height: 1.02; letter-spacing: -0.04em; text-wrap: balance; }
.h-slide { margin: 0; font-family: 'Instrument Sans', sans-serif; font-weight: 600; font-size: 64px; line-height: 1.02; letter-spacing: -0.035em; text-wrap: balance; }
.h-card { margin: 0; font-family: 'Instrument Sans', sans-serif; font-weight: 600; font-size: 36px; line-height: 1.1; letter-spacing: -0.02em; }
.fig { font-family: 'Instrument Sans', sans-serif; font-weight: 600; font-size: 112px; line-height: 1; letter-spacing: -0.045em; }
.body { margin: 0; font-size: 24px; line-height: 1.5; color: #464157; }
.dk .body { color: rgba(232, 238, 255, 0.72); }
.bu .body { color: rgba(255, 255, 255, 0.8); }
.bs .body { color: rgba(68, 0, 32, 0.8); }
.lbl { font-size: 20px; line-height: 1.35; color: #464157; }
.dk .lbl { color: rgba(232, 238, 255, 0.72); }
.cap { font-size: 18px; line-height: 1.4; color: #747181; }
.dk .cap { color: rgba(232, 238, 255, 0.55); }
.strong { color: #18122D; font-weight: 600; }

/* Eyebrow: ink-tinted pill, as on the website */
.eyebrow { display: inline-flex; align-items: center; height: 36px; padding: 0 14px; border-radius: 8px; background: rgba(24, 18, 45, 0.06); color: rgba(24, 18, 45, 0.66); font-size: 18px; font-weight: 500; width: max-content; }
.dk .eyebrow { background: rgba(232, 238, 255, 0.08); color: rgba(232, 238, 255, 0.72); }

/* Surfaces */
.card { background: #FFFFFF; border-radius: 8px; }
.card-dk { background: rgba(232, 238, 255, 0.05); border: 1px solid rgba(232, 238, 255, 0.12); border-radius: 8px; }
.stage { position: relative; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.stage > .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.stage > .shot { position: relative; display: block; border-radius: 8px; background: #FFFFFF; }
.cover-img { display: block; width: 100%; object-fit: cover; border-radius: 4px; }

/* Numbered list with hairlines */
.list { display: flex; flex-direction: column; border-bottom: 1px solid rgba(24, 18, 45, 0.14); }
.li { display: flex; justify-content: space-between; align-items: baseline; gap: 24px; padding: 16px 0; border-top: 1px solid rgba(24, 18, 45, 0.14); font-size: 24px; font-weight: 500; }
.dk .list, .bu .list { border-bottom-color: rgba(232, 238, 255, 0.22); }
.dk .li, .bu .li { border-top-color: rgba(232, 238, 255, 0.22); }
.li .n { font-size: 20px; font-weight: 500; opacity: 0.7; }

/* Labelled text blocks (use cases) */
.blk { display: flex; flex-direction: column; gap: 8px; padding: 20px 0; border-top: 1px solid rgba(24, 18, 45, 0.14); }
.blk b { font-family: 'Instrument Sans', sans-serif; font-size: 28px; font-weight: 600; letter-spacing: -0.02em; }

/* Pills */
.chip { display: inline-flex; align-items: center; gap: 10px; height: 48px; padding: 0 20px; border-radius: 999px; background: #FFFFFF; color: #18122D; font-size: 20px; font-weight: 600; white-space: nowrap; width: max-content; }
.chip i { width: 10px; height: 10px; border-radius: 50%; background: #2A5AE9; }
.chip.dark { background: #18122D; color: #E8EEFF; }
.chip.green { background: #DCF5E7; color: #135C37; }
.chip.green i { background: #1DB463; }
.tag { display: inline-flex; align-items: center; height: 44px; padding: 0 18px; border-radius: 999px; background: #FFFFFF; font-size: 20px; font-weight: 500; color: #18122D; }
.tabs { display: flex; gap: 8px; padding: 6px; border-radius: 999px; background: #FFFFFF; }
.tabs span { display: inline-flex; align-items: center; height: 44px; padding: 0 20px; border-radius: 999px; font-size: 18px; font-weight: 500; color: #464157; }
.tabs span.on { background: #18122D; color: #E8EEFF; }
.tick { display: flex; align-items: center; gap: 14px; font-size: 24px; }
.tick svg { width: 26px; height: 26px; flex: 0 0 26px; }
```

Fonts: Instrument Sans (500, 600) and Inter (400, 500, 600) from Google Fonts.
