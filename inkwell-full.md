# Inkwell

A calm, editorial style for self-contained HTML pages. One ink on a pale ground, a serif for reading (Lora), a geometric sans for structure (Outfit), a monospace for metadata (DM Mono), and colour only for status.

This file is the entry point. It is short on purpose: read it, then use the builder. The builder supplies all CSS, scripts, icons and page chrome, so never write or copy them by hand.

Live specimen of every component: https://claude.ai/artifact/4GktYTSLJWj6YFDHRDUeUv

---

## For Claude: how to make a page

The toolkit lives in the folder that holds this file (normally `~/inkwell`). The commands below assume that location; use the real path if it differs.

1. **Scaffold** a page source for the closest page type:
   `python3 ~/inkwell/build.py new report.src.html --type report --title "Quarterly report"`
   (`build.py types` lists the types; they are also in the table below.)
2. **Write the content** into the `.src.html` file. Keep the front matter and replace the example sections.
   - `build.py list` shows every component.
   - `build.py snippet NAME [NAME ...]` prints the exact markup and rules for the ones you need. Use those class names exactly.
   - Write only content: sections, components and page-specific script. Never write `<html>`, `<head>`, the masthead, the toggle, the contents list, a footer or any CSS.
3. **Build** a single self-contained file:
   `python3 ~/inkwell/build.py report.src.html` writes `report.html` next to the source.
   It prints a one-line summary and any warnings. Fix every warning, then build again.
4. **Check** the page if you can render it: 390px and 1400px wide, light and dark. Deliver the `.html` file, or publish it if an artifact tool is available.

Read `rules.md` only for a decision this file does not settle: colour use, type scale, spacing, accessibility or wording.

---

## The page source

```html
<!--
title: Quarterly report
lede: One to three sentences in italic that say what the page is for.
meta: Finance · Draft
date: today
-->

<section class="section" id="summary">
  <h2>Summary</h2>
  <p>Opening paragraph.</p>
  <button type="button" class="btn btn-secondary">{{icon:link}}Copy link</button>
</section>

<section class="section">
  <h2>Costs</h2>
  <div class="table-wrap wide">…</div>
</section>

<script>
  // Page script: runs after the component scripts, with their helpers in scope
</script>
```

**Front matter** (an HTML comment at the very top; one `key: value` per line; indent a line to continue the value):

| Key | Default | Meaning |
|---|---|---|
| `title` | required | The page title, used for `<title>` and the `h1` |
| `lede` | none | The italic intro under the title. Inline HTML allowed |
| `meta` | none | Facts after the date on the meta line, separated with ` · ` |
| `date` | `today` | `YYYY-MM-DD`, `today` or `none`. Shown as DD/MM/YYYY |
| `layout` | `column` | `column` is the centred reading column. `wide` is a left-aligned work surface for apps, dashboards and trackers (rules 5.7) |
| `rail` | `auto` | Contents rail and progress line. `auto` turns on at four or more sections, except in the wide layout |
| `numbers` | follows `rail` | Mono section numbers above each `h2` |
| `footer` | follows `rail` | The "Back to top" footer |
| `modules` | `auto` | CSS modules, detected from the classes used. Write `+data` to add one, or a list to fix them |
| `scripts` | detected | Extra component scripts to force in, e.g. `+tokens` |
| `lang` | `en` | The page language |

**What the builder does for you:**
- writes the masthead: title, meta line with the theme toggle, and lede;
- gives each `<section class="section">` an id (from its `h2` if missing), `aria-labelledby` and a number;
- builds the contents rail and progress line, and adds the footer;
- adds a `#` link to each `h2` (in script);
- includes only the CSS blocks, modules, scripts and icons the page uses, and adds Prism when there is `language-*` code;
- expands `{{icon:name}}` to an inline icon; `{{icon:arrow-up-right ext}}` adds the extra class `ext`;
- lifts any `<style>` block into the stylesheet after the modules, and any inline `<script>` into the page script.

**Page script** runs inside the same closure as the component scripts, so these helpers are in scope:
- `$`, `$$` and `root`;
- `icon(name)` and `toast(message)`;
- `MONTHS`, `redrawers` (redrawn on resize and theme change) and `themeListeners` (theme change only);
- for data pages: `lineChart`, `heatmap`, `calendar`, `token` and `tokenHex`;
- `setLoading` for loading placeholders.

Each component's snippet shows how to call its function.

---

## Quick brief

1. **Palette:** one ink on a pale ground, plus five shades of ink for data. Three signal colours (danger, warning, success) mark status only, always beside a glyph or a word. Eight categorical colours tell groups apart in data, and do nothing else.
2. **Typefaces:** Lora for reading, Outfit 600 for headings and UI, DM Mono for metadata. Nothing else.
3. **Four voices, one job each:** roman serif for content, italic serif for commentary, sans for structure, mono for metadata.
4. **Column:** prose sits in a 36rem column. Tables, charts, tools and diagrams that need room go in `.wide`, which grows into the right margin up to 54rem. A `.band.full` spans the window. Apps, dashboards and trackers can take `layout: wide` instead, where the page is left-aligned and wide and prose still keeps to 36rem.
5. **Separation:** hairlines and space, not boxes. Filled surfaces only for code, callouts, alerts, selected states and panels.
6. **Headings:** Outfit 600. Small labels use the spaced uppercase label style.
7. **Interaction:** hovered links invert to ground-on-ink. Pressed controls fill with ink.
8. **State:** carried by form (fill, hatching, dashes, glyphs) as well as colour.
9. **Theme:** Auto by default (Claude's theme, else the system), with the small toggle beside the date. The builder handles this.
10. **Frame:** nothing above the title. Long pages get the rail and a footer holding only "Back to top".
11. **No ornament:** no drop caps, gradients, emoji, brand colour, or shadows except on dialogs.
12. **Icons:** line icons from the sprite (`build.py list icons`), for scanning only. Icon-only buttons need an `aria-label`.
13. **Motion:** small and optional; off under reduced motion.
14. **Faint text** only for information that is repeated or not essential.
15. **Words:** British English, plain and active. Labels say exactly what happens. Never claim an action that did not happen.
16. **Data:** greyscale charts with mono labels. When greyscale cannot tell the groups apart (networks, scatter plots, maps, many series), use the categorical colours in order. Label example data as example data on the page.

---

## Bending the rules

The rules serve reading. A page that is a tool rather than a document may bend some of them where that makes it work better. Say why in a comment beside the change.

- **Width:** `layout: wide` gives apps, dashboards and trackers the whole window (rules 5.7).
- **Colour for identity:** the categorical colours `--cat-1` to `--cat-8`, only when greyscale cannot tell the groups apart (rules 3.6).
- **Component sizes:** a page `<style>` may change the size, spacing and layout of components to fit its content, using tokens only.

Some rules never bend: tokens only and no raw colours, the three typefaces and four voices, signal colours kept for status and paired with a glyph or word, both themes, no ornament or shadows, accessibility and the writing rules. Rules section 15 has the detail.

---

## Page types

| `--type` | For | Typical components |
|---|---|---|
| `note` | Note, memo, letter | Sections, lists, callouts |
| `report` | Essay, article, report, plan | Pull quote, sidenotes, footnotes, figures, timeline, tables |
| `docs` | Documentation, guide | Steps, code tabs, diff, callouts, comparison table, disclosure |
| `tool` | Calculator, converter, checker | Split view, form controls, big number, signal results |
| `app` | Small app or tool, in the wide layout | App shell, segmented control, side filters, board, compact table, dialog |
| `dashboard` | Metrics, tracking, in the wide layout | Stat tiles, sparklines, line chart, heatmap band, calendar, compact table |
| `form` | Form or wizard | Step indicator, fields with inline errors, selectable cards, review rows |
| `diagram` | Diagram or explainer | Mermaid diagram, steps, callouts |

A page needs only what its content calls for. No page needs every component.

---

## Builder reference

```
build.py new PAGE.src.html --type TYPE --title "Title" [--force]
build.py PAGE.src.html [-o OUT.html] [--no-prune]
build.py types
build.py list [core|longform|tools|data|diagrams|icons]
build.py snippet NAME [NAME ...]
build.py export [-o FILE]       # the whole system as one markdown file
```

Vanilla Python 3.8 or later; nothing to install. The built page loads fonts from Google Fonts, plus Prism or Mermaid from a CDN only when it uses them. Everything else is inline.

## Files

| Path | What |
|---|---|
| `DESIGN.md` | This entry point |
| `rules.md` | The full rules: colour, type, layout, icons, data, motion, accessibility, writing, do and don't |
| `components/*.md` | Notes and markup per module, read through `build.py snippet` |
| `templates/*.src.html` | Page-type starters used by `build.py new` |
| `assets/` | `css/`, `js/`, `icons.svg`, `skeleton.html`. The builder reads these; edit them only to change the system |
| `build.py` | The builder |


---

# Inkwell: Rules

The full rules behind `DESIGN.md`. Read the section you need; there is no need to read this file end to end.

1. Essence
2. Principles
3. Colour
4. Typography
5. Layout and spacing
6. Lines, surfaces and shape
7. Icons
8. Components
9. Charts and data
10. Interaction and motion
11. Accessibility
12. Writing
13. Environment and checks
14. Do and don't
15. Bending the rules

---

## 1. Essence

| Quality | What it means in practice |
|---|---|
| **Quiet** | Greyscale by default. No accent colour. Nothing competes with the text. |
| **Editorial** | It reads like a well-set essay: one column, generous leading, real italics, sidenotes where they help. |
| **Precise** | Hairline rules, tabular numbers, small spaced capitals for labels, monospace for anything machine-like. |
| **Restrained** | One display weight. Few surfaces. Colour only when status needs it. |
| **Warm** | A slightly warm off-white ground and a calligraphic serif keep the monochrome from feeling clinical. |

Reference points: personal essay sites, literary journals, good technical documentation, and calm internal tools. The same system covers documents, dashboards, small apps and reports.

---

## 2. Principles

1. **One ink, sparing signals.** Every neutral is a shade of the ink on the ground. Emphasis means darker. A signal colour appears only when something has succeeded, failed, or needs care.
2. **Four voices, one job each.** See 4.2. A voice never borrows another's job.
3. **Type does the work.** Use size, weight and case for hierarchy before reaching for boxes, icons or colour.
4. **Rules, not boxes.** Separate with 1px hairlines. Fill a surface only to set apart the one element that needs it.
5. **A reading column, with room to breathe.** Text stays at about 70 characters. Wide content grows into the margin instead of widening the text. Apps, dashboards and trackers may take the wide layout (5.7), where prose still keeps to the measure.
6. **State lives in form.** Fill, hatching, dashes and glyphs carry state, and colour reinforces it.
7. **Inversion is the interaction colour.** Hovered links, pressed toggles and primary buttons flip to ground-on-ink.
8. **Complete at rest.** Everything meant to be read is visible on first paint. Motion is brief and never hides content.
9. **Both themes, equal care.** Light and dark are both first-class and share every token.
10. **Honest pages.** Controls say what they do. Demo actions say they did nothing.

---

## 3. Colour

### 3.1 Neutral tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#f6f6f4` | `#161616` | Page ground. Also the text colour on ink-filled elements. |
| `--surface` | `#ececea` | `#212120` | Raised fills: code, callouts, selected states, panels, placeholders, row hover. |
| `--ink` | `#2a2a2a` | `#e4e4e1` | Headings, strong text, active states, focus rings, primary buttons, chart marks. |
| `--muted` | `#6a6a6a` | `#a3a3a0` | Secondary text: lede, links, quotes, spaced labels, table headings. |
| `--faint` | `#9b9b9b` | `#72726f` | Tertiary text: meta lines, tag labels, eyebrows, captions, markers, placeholders. |
| `--rule` | `#dededb` | `#2c2c2b` | Hairlines between rows and sections. |
| `--text` | ink 92% into bg | same | Body copy, a hair softer than headings. |
| `--rule-strong` | ink 24% into bg | same | Input borders, table header rules, blockquote bar, kbd and secondary button borders. |

The derived tokens are defined once in the bare `:root` block with `color-mix()`, so they recompute when a theme block redefines `--ink` and `--bg`.

### 3.2 Shades of ink

Five steps of ink mixed into the ground, for heatmaps, density, avatars and telling chart series apart. They invert naturally in dark mode, where more ink means lighter.

| Token | Mix |
|---|---|
| `--shade-1` | 8% |
| `--shade-2` | 22% |
| `--shade-3` | 40% |
| `--shade-4` | 62% |
| `--shade-5` | 88% |

### 3.3 Signal colours

| Token | Light | Dark | Means |
|---|---|---|---|
| `--danger` | `#a33a2f` | `#e5877d` | Errors, failures, destructive actions, bad changes |
| `--warning` | `#8a5d0f` | `#d9ad5b` | Needs care, borderline values |
| `--success` | `#2f6f45` | `#7cc293` | Saved, passing, good changes |

Rules:

- **Status only.** Use them for errors, destructive actions, warnings, success, and pass or fail. Never for links, headings, decoration or brand.
- **Always paired** with a glyph (✓ ✕ ▲ ▼ ⚠) or a word, so the state still reads in greyscale.
- **Small areas only:** text, an icon, a 3px bar, a border, or a 9% tint (`color-mix(in srgb, var(--danger) 9%, var(--bg))`). Never a large solid fill. The one exception is the solid danger button for confirming a destructive action.
- **Information** (neutral notices) stays in ink, with no colour.
- **Deltas** take green when the change is good and red when it is bad, whichever way the arrow points.

### 3.4 Translucent tints

| Use | Value |
|---|---|
| `<mark>` highlight | `color-mix(in srgb, var(--ink) 13%, transparent)` |
| Footnote `:target` | `color-mix(in srgb, var(--ink) 10%, transparent)` |
| Input focus halo | `0 0 0 3px color-mix(in srgb, var(--ink) 12%, transparent)` |
| Invalid input halo | `0 0 0 3px color-mix(in srgb, var(--danger) 14%, transparent)` |
| Divider on a surface | `color-mix(in srgb, var(--ink) 10%, transparent)` |
| Chart area fill | `color-mix(in srgb, var(--ink) 6–7%, transparent)` |
| Primary button hover | `color-mix(in srgb, var(--ink) 84%, var(--bg))` |

### 3.5 Themes

- The full light palette lives in the bare `:root` block, first.
- Dark redefines the six neutrals and three signals in two places: under `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`. Set `color-scheme` alongside.
- **Auto is the default.** The page follows `data-theme` if the host (Claude) sets it on `<html>`, and the system preference otherwise.
- **The theme toggle** (`build.py snippet theme-toggle`) sets `data-theme` to `light` or `dark` to override, and restores the host's value when set back to Auto. It keeps tracking the host's changes. Its choice is stored in `localStorage`, inside try/catch.
- Elements only ever reference tokens. Never style an element inside a theme block.
- `body` always has `background: var(--bg)`.
- Dark is not an inversion. The ground is a soft near-black and the ink a warm off-white, never `#000` or `#fff`.
- Print is always black on white (`build.py snippet print`).

### 3.6 Categorical colours

The one exception to greyscale data. Eight ink-toned colours tell groups apart when greyscale cannot: network graphs, scatter plots, maps, and charts with more groups than the five greyscale treatments in section 9.

| Token | Light | Dark | Name |
|---|---|---|---|
| `--cat-1` | `#2e69b2` | `#5d94da` | Blue-black |
| `--cat-2` | `#c96b7e` | `#cd677d` | Rose |
| `--cat-3` | `#ac8924` | `#b4902e` | Mustard |
| `--cat-4` | `#009390` | `#0ca4a0` | Verdigris |
| `--cat-5` | `#c35f36` | `#d3754f` | Sienna |
| `--cat-6` | `#7766b4` | `#8e7ecf` | Violet |
| `--cat-7` | `#67863a` | `#79994d` | Moss |
| `--cat-8` | `#884783` | `#b570af` | Plum |

Rules:

- **Identity only.** They say which group a mark belongs to. Never use them for status, emphasis, links, headings or decoration.
- **Only when greyscale fails.** If shades, dashes and hatching can separate the groups, use those.
- **Fixed order, never cycled.** Give out slots from `--cat-1` up. Past the eighth group, fold the rest into "Other" in `--shade-4`.
- **Inactive values stay grey.** Values that mean gone or nothing (archived, none) take `--shade-3` and do not use up a slot.
- **Colour follows the entity.** Work out the assignment from the whole data set, not the filtered rows, so a filter never repaints the groups that remain.
- **Never colour alone.** Always add a legend, plus direct labels or a tooltip. When any two groups can sit side by side (scatter plots, maps, networks), only the first three are safe on colour alone.
- **Text stays in ink.** Set labels and values in the text tokens, with a coloured mark beside them.
- **Signal colours are not series.** Keep them for status, paired with a glyph or word, even in a coloured chart.
- **Validated as a set.** In both themes, every colour sits in a set lightness band, has enough chroma to read as a colour, and has at least 3:1 contrast on the ground. Neighbouring slots stay apart under protanopia and deuteranopia (OKLab ΔE ≥ 8) and under normal vision (ΔE ≥ 15). The first three also stay apart in every pairing. Re-validate before changing or reordering them.

---

## 4. Typography

### 4.1 Typefaces

| Voice | Family | Weights | Fallback stack |
|---|---|---|---|
| Body | **Lora** | 400–700 variable, roman and italic | `Georgia, 'Times New Roman', serif` |
| Display | **Outfit** | 400, 500, 600 | `system-ui, -apple-system, 'Segoe UI', sans-serif` |
| Mono | **DM Mono** | 400, 500 | `ui-monospace, 'SF Mono', Menlo, Consolas, monospace` |

Each family loads with its own `<link>`, so one failed request cannot block the others. The builder writes these links. DM Mono has no 600 weight, so use 500 wherever mono needs weight.

### 4.2 The four voices

| Voice | Face | Colour | Used for |
|---|---|---|---|
| **Content** | Lora roman 400 | `--text` | Paragraphs, list items, table cells, form values, dialog body, task titles |
| **Commentary** | Lora italic 400 | `--muted` or `--faint` | Lede, captions, blockquotes, sidenotes, form status, empty-state hints |
| **Structure** | Outfit 600 headings, 500 UI, 400 table headings | `--ink` or `--muted` | Headings, labels, buttons, tabs, summaries, legends, contents, toasts, chips, alert titles |
| **Metadata** | DM Mono 400 | `--faint` or `--muted` | Dates, tag names, counters, readouts, section numbers, code, kbd, file names, axis labels |

Emphasis inside content: `<strong>` is Lora 600 in `--ink`, and `<em>` is Lora italic. Never set body copy in the sans, and never set headings in the serif.

### 4.3 Type scale

The root size is **18px**, and 16px below 600px. Everything is in `rem`, so the whole scale steps down together.

| Style | Size | px at 18 | Phone | Face | Notes |
|---|---|---|---|---|---|
| `h1` | 2.8rem | 50.4 | 2.2rem | Outfit 600 | `letter-spacing: -0.02em` |
| `h2` | 2rem | 36 | 1.7rem | Outfit 600 | Section titles |
| `h3` | 1.5rem | 27 | 1.3rem | Outfit 600 | `margin-top: 2.4rem` inside sections |
| `h4` | 1.25rem | 22.5 | | Outfit 600 | |
| `h5` | 1.05rem | 18.9 | | Outfit 600 | |
| `h6` | 0.85rem | 15.3 | | Outfit 600, uppercase | `letter-spacing: 0.08em`, `--muted` |
| Lede | 1.12rem | 20.2 | | Lora italic | `--muted` |
| Body | 1rem | 18 | | Lora 400 | `line-height: 1.65` |
| Pull quote | 1.7rem | 30.6 | 1.4rem | Outfit 600 | `line-height: 1.3` |
| Big number | 2–2.6rem | 36–47 | | Outfit 600 | Tabular figures |
| Table text | 0.95rem | 17.1 | | Lora 400 | Compact tables 0.85rem |
| UI label | 0.85rem | 15.3 | | Outfit 400 | Form labels, toasts |
| Small print | 0.85em | | | Lora 400 | `<small>`, `--muted` |
| Caption | 0.82rem | 14.8 | | Lora italic | `--faint` |
| Sidenote | 0.82rem | 14.8 | | Lora italic | `--muted` |
| Code block | 0.78rem | 14 | | DM Mono | `line-height: 1.6` |
| Spaced label | 0.72rem | 13 | | Outfit 600, uppercase | `letter-spacing: 0.08em`, `--muted` |
| Meta, tag, value | 0.72rem | 13 | | DM Mono 400 | `--faint` |
| Eyebrow number | 0.7rem | 12.6 | | DM Mono 400 | `--faint` |

### 4.4 Details

- **Line height:** 1.65 body, 1.2 headings, 1.3 pull quotes, 1.5 sidenotes, 1.55–1.6 code and textareas.
- **Tracking:** headings −0.01em (h1 −0.02em). Uppercase labels +0.06 to +0.08em. Never track lowercase body text.
- **Wrapping:** `text-wrap: balance` on headings and pull quotes.
- **Numerals:** `font-variant-numeric: tabular-nums` wherever digits align.
- **Measure:** the text column is `36rem`, about 70 characters of Lora.
- **Paragraphs:** separated by 1em of space, never by indents. Never a drop cap.
- **Quotes and dashes:** real curly quotes and real dashes in copy.

### 4.5 Micro-styles

Two micro-styles recur everywhere. **Spaced label** (`.spaced-label`) is used for the contents title, legends, table headings, callout labels, group titles and stat labels:

```css
font-family: var(--font-display); font-weight: 600; font-size: 0.72rem;
text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted);
```

**Mono meta** (`.meta`, `.hint`, `.mono`) is used for dates, tags, counters, readouts and section numbers:

```css
font-family: var(--font-mono); font-size: 0.72rem; color: var(--faint);
```

---

## 5. Layout and spacing

### 5.1 Page structure

- **Column:** `--measure` (36rem), centred, with a 1.5rem side gutter (1.25rem on phones).
- **Padding:** 4rem top and 6rem bottom; 2rem and 4rem on phones.
- **Wide screens (≥1100px):** the grid becomes `1fr | 36rem | 1fr` with a 4rem gap. A sticky **rail** (11rem, right-aligned in the left column, `top: 4rem`) holds the contents and nothing else. It scrolls on its own if it is taller than the window.
- **Below 1100px:** the contents flow inline between the masthead and `main`, between two hairlines, in two columns.

```
≥1100px                                   <1100px
┌──────────┬──────────────┬───────────┐   ┌──────────────┐
│          │ masthead     │           │   │ masthead     │
│  rail    ├──────────────┤  margin   │   ├──────────────┤
│ (sticky) │ main ────────┼─ wide ──► │   │ contents     │
│          │              │ sidenotes │   ├──────────────┤
│          ├──────────────┤           │   │ main         │
│          │ footer       │           │   │ footer       │
└──────────┴──────────────┴───────────┘   └──────────────┘
```

### 5.2 Widths

| Width | Class | Behaviour |
|---|---|---|
| Text | (default) | 36rem. All prose. |
| Wide | `.wide` | From 760px up: keeps its left edge on the column and grows right, up to 54rem or the window's right gutter. Use for tables, charts, tools, stat rows, app shells and diagrams. |
| Full | `.full` | The whole window width. For a band with a surface background (a heatmap, a gallery). Content inside a band uses `.band-inner`, which aligns it with the text column. |

The maths uses `--vw`, which is `100vw` minus the scrollbar width measured by the core script, so nothing overflows sideways. `body` has `overflow-x: clip` as a safety net.

### 5.3 Breakpoints

| Name | Query | Changes |
|---|---|---|
| Phone | `max-width: 600px` | Root 16px; smaller h1–h3 and pull quote; grids stack; card rows scroll horizontally |
| Narrow | `max-width: 760px` | Wide blocks fall back to the column; split views and app shells stack; calendars stack |
| Wide | `min-width: 1100px` | Rail appears; masthead gains `margin-bottom: 4.5rem` |
| Margin | `min-width: 1200px` | Sidenotes move into the right margin |

### 5.4 Section rhythm

- `main` is a flex column with `gap: 4rem`. Every section after the first adds a hairline above and `padding-top: 4rem`.
- A section opens with an optional mono eyebrow (`01`), the `h2` with no top margin, then an introductory paragraph. Use eyebrows only when the numbering is real.
- `h3` subsections get `margin-top: 2.4rem`.

### 5.5 Tool layouts

- **Split view** (`.split`): controls in a left column (15rem) and live output on the right, inside a hairline frame. It stacks below 760px. Use it for calculators, converters, generators and checkers.
- **App shell** (`.shell`): for tools that fill the window. A slim header bar (breadcrumbs left, view switch right), a side panel (11rem) for filters or navigation, and a scrolling work area. As a whole page, give it `height: 100%` on `html` and `body` (never `100vh`) and drop the masthead to a one-line header, or use the wide layout with the shell in a `fill` section (5.7). Inside a document, frame it at a fixed height (25rem).
- **Compact density:** app shells, compact tables and boards use smaller type (0.8–0.85rem), tighter padding and mono metadata at 0.64–0.7rem.

### 5.6 Spacing scale

| rem | Typical use |
|---|---|
| 0.25 | Gap inside chips and pressed groups |
| 0.4–0.5 | Label to field; eyebrow to heading; tight groups |
| 0.6–0.75 | Between buttons; table cell padding; caption gap |
| 1–1.25 | Between form fields; padding in callouts, alerts, code and panels |
| 1.5 | Default block margin (figures, tables, code, quotes, lists of cards) |
| 2–2.5 | Between form groups; masthead blocks |
| 3–3.5 | Contents block margins |
| 4 | Section gap and section padding; page top padding |
| 6 | Page bottom padding |

Lay out sibling groups with flex or grid and `gap`, not per-element margins.

### 5.7 Wide layout

`layout: wide` in the front matter replaces the centred reading column with a left-aligned work surface. Use it for apps, dashboards, trackers and other tools that people work in rather than read. Keep documents in the column.

- **Frame:** the page fills the window up to 120rem, with a `clamp(1rem, 2.5vw, 2.5rem)` side gutter and 1.5rem top and bottom.
- **Density:** root type is 16px at every width.
- **Masthead:** one row, with the title on the left and the meta line and toggle on the right. The lede sits underneath, up to 64rem, and a hairline closes the masthead.
- **Sections:** separated by a 2rem gap alone, with no hairline. Headings drop to 1.25rem. A `.section-note`, an italic muted line, sits beside the heading, and wraps under it below 760px.
- **Prose:** paragraphs, lists, quotes and description lists inside a section still stop at the 36rem measure.
- **Widths:** `.wide` fills the width and `.full` spans the frame, so neither is needed.
- **Fill:** give a section `fill` and it takes the rest of the window height. Its block, usually an app shell, stretches to fit and scrolls inside, so the page itself does not scroll. Give a fill section a heading, an optional note and one block. Below 760px it falls back to a fixed 40rem shell.
- **Contents:** the rail is off by default. If it is turned on, it sits inline under the masthead.

---

## 6. Lines, surfaces and shape

| Element | Treatment |
|---|---|
| **Hairline** | `1px solid var(--rule)`. Between rows, items and sections. |
| **Strong hairline** | `1px solid var(--rule-strong)`. Table header and footer rules, inputs, secondary buttons, app-shell frame. |
| **Quote bar** | `2px solid var(--rule-strong)` on the left of blockquotes. |
| **Status bar** | `box-shadow: inset 3px 0 0` in ink or a signal colour, on alerts and warning callouts. |
| **Surface** | `var(--surface)`. Code, callouts, alerts, selected cards, panels, bands, placeholders. Never nest one surface in another. |
| **Radius** | 2–4px on surfaces, inputs and buttons (3px default, 4px for panels and cards, 6px for dialogs and app shells). `999px` only for chips and toasts. 50% for dots, avatars and step numbers. |
| **Shadow** | Dialogs only: `0 24px 60px -24px rgba(0,0,0,.4)`. Nothing else casts a shadow. |
| **Rule** | `<hr>`: `height: 1px; border: 0; background: var(--rule);` |

---

## 7. Icons

- **Style:** line icons on a 24-unit grid, 1.5 stroke, round caps and joins, drawn in `currentColor`. A few use a filled half (contrast).
- **Delivery:** one inline SVG sprite (`assets/icons.svg`). In a page source, write `{{icon:name}}` and the builder expands it and includes only the icons the page uses. No icon library.
- **Set (27):** search, plus, check, x, alert, info, arrow-right, arrow-up-right, chevron-left, chevron-right, chevron-down, copy, link, download, trash, file, calendar, clock, inbox, user, sliders, board, list, swap, contrast, sun, moon.
- **Sizes:** 16px inline with text (`1.1em` by default), 20px in buttons (`1rem`), 24px in navigation.
- **Use:** to help people scan buttons, navigation, alerts and status. Never decorative, never emoji in their place.
- **Labels:** an icon-only button (`.icon-btn`) needs an `aria-label`. Decorative icons get `aria-hidden="true"`. An icon that carries meaning on its own, such as a ✓ in a comparison table, gets `role="img"` and an `aria-label`.
- **External links** may end with a small `arrow-up-right` (`.icon.ext`).
- **New icons** follow the same grid, stroke and caps. Add them to `assets/icons.svg`.

---

## 8. Components

Notes and markup for every component live in `components/`, one file per module. Read them through the builder rather than opening the files: `build.py list` names them, and `build.py snippet NAME` prints one.

| Module | Components |
|---|---|
| **Core** | Sections, inline text, blockquote, lists, task list, description list, specimen rows, steps, tables, sortable table, comparison table, code, code tabs, diff, disclosure, forms, field errors, buttons, progress, meter, chips, signal chips, dialog, toast, alerts, callouts, figures, footnotes, widths, icons; plus the masthead, theme toggle, contents rail, progress line, footer and print styles that the builder adds |
| **Long-form** | Pull quote, sidenotes, timeline |
| **Tools** | Split view, app shell, board, avatars, segmented control, breadcrumbs, pagination, step indicator, selectable cards, search with compact table and empty state, loading placeholders |
| **Data** | Stat tiles, sparklines, line chart, chart libraries, bar rows, heatmap band, calendar, big number |
| **Diagrams** | Mermaid |

Core CSS is on every page. The builder adds a module only when the page uses one of its classes, and leaves out core blocks the page does not use.

## 9. Charts and data

- **Draw in greyscale.** Marks are `--ink`; tracks and grids `--rule`; labels mono meta. When greyscale cannot tell the groups apart, use the categorical colours (3.6).
- **One scale per chart.** Label only values the chart reaches.
- **Distinguishing series without colour:**
  1. `--ink` solid;
  2. `--muted` dashed `4 3`;
  3. `--ink` hatched at 135°;
  4. `--shade-3` solid;
  5. `--faint` solid.
- **Density:** shades 1–5.
- **Good and bad:** signal colours only, with ▲ ▼ ✓ ✕ glyphs.
- **Big numbers** only when the figure is the point of the page.
- **Chart libraries:** hand them the tokens instead of their defaults. See `build.py snippet chart-library`. Pages that are mostly charts from data are better made with the Data artifact type where one is available, using these tokens.
- **Example data** is always labelled on the page, in the caption or the section intro.

---

## 10. Interaction and motion

| Interaction | Behaviour |
|---|---|
| Link hover | Inverts to ink background with ground text |
| Button hover | Border or fill shift, 0.15s |
| Input focus | Ink border plus a 12% halo |
| Invalid input | Danger border plus a 14% halo, with a message below |
| Focus ring | `outline: 2px solid var(--ink); outline-offset: 3px` on `:focus-visible` |
| Pressed controls | Ink fill with ground text (segmented, toggle, current page, selected day) |
| Accordion | The `+` rotates 45°, 0.2s |
| Toast | Fades and rises 0.75rem, 0.2s |
| Bars | Width eases 0.4s when data changes |
| Loading | Shimmer, 1.2s |
| Smooth scroll | `scroll-behavior: smooth`, `scroll-padding-top: 2rem` |

- Nothing animates in from invisible.
- `prefers-reduced-motion: reduce` switches off all transitions, animations and smooth scrolling.
- No keyboard shortcuts on reading pages. A tool may add one only if the page documents it, and must ignore keystrokes typed into fields, open dialogs, and keys held with a modifier.

---

## 11. Accessibility

**Contrast (WCAG ratios):**

| Pair | Light | Dark |
|---|---|---|
| `--ink` on `--bg` | 13.3 | 14.2 |
| `--text` on `--bg` | 10.5 | 12.2 |
| `--muted` on `--bg` | 5.0 | 7.2 |
| `--muted` on `--surface` | 4.6 | 6.4 |
| `--danger` on `--bg` / on its 9% tint | 6.1 / 5.3 | 7.0 / 6.1 |
| `--warning` on `--bg` / on its 9% tint | 5.3 / 4.7 | 8.7 / 7.4 |
| `--success` on `--bg` / on its 9% tint | 5.6 / 4.9 | 8.6 / 7.4 |
| `--faint` on `--bg` | **2.6** | **3.8** |
| `--faint` on `--surface` | **2.3** | **3.3** |

`--faint` fails AA for body text by design. Use it only for decorative or repeated metadata: section numbers, list markers, tag labels beside content that says the same thing, placeholders, axis labels, and captions that repeat the figure. Anything a reader needs must be `--muted` or darker.

**Other rules:**

- **Labels:** every control has a visible label and a stable `id`. Radios sit in a `fieldset` with a `legend`.
- **ARIA:** pressed groups use `aria-pressed`; tabs full ARIA tab semantics; sortable headers `aria-sort`; switches `role="switch"`; the current page or step `aria-current`.
- **Live regions** (`role="status"` or `aria-live="polite"`) for toasts, form status, counters and readouts. `role="alert"` only for danger alerts.
- **Field errors** are linked with `aria-describedby` and announced by `aria-invalid`.
- **Charts and heatmaps** get `role="img"` and an `aria-label` that states the main finding. Their SVG internals are `aria-hidden`.
- **Specimen headings** shown as examples use `.h1`–`.h6` classes on non-heading elements.
- **State** never depends on colour alone.

---

## 12. Writing

- **British spelling** (colour, favourite, organise).
- **Plain, short, active sentences,** written from the reader's side of the screen.
- **Ledes and captions** are full italic sentences: factual and brief.
- **Labels say what happens:** "Check form", "Keep editing" and "Discard", never "Submit", "OK" or "Click here".
- **Errors** say what went wrong and how to fix it.
- **Honest UI:** "Delete pressed. Nothing was deleted." "This page has no server, so nothing was sent."
- **Numbers:** mono when they are readouts, the body face when they are part of prose.
- **Dates:** DD/MM/YYYY in meta lines and tables; written out in prose ("22 November 2026").
- **Section numbers and eyebrows** only when they encode real order.
- **Example data** is labelled as example data.
- **Avoid:**
  - emoji as markers;
  - exclamation marks;
  - stock phrases;
  - em-dash asides;
  - "not X but Y";
  - scare quotes around invented labels.

---

## 13. Environment and checks

How to build a page is in `DESIGN.md`. These constraints apply when a page is published as a claude.ai artifact, and are good practice in any standalone file:

- **Fonts and scripts:** only fonts from `fonts.googleapis.com` load, and only scripts from approved CDNs (cdnjs, jsDelivr, unpkg). The builder pins `prism/1.29.0` and `mermaid@10.9.1`.
- **Images:** remote images do not load. Use inline SVG, canvas or `data:` URIs.
- **Blocked browser features:** `alert`, `confirm`, `prompt` and `window.print` are blocked, so use the dialog and toast. Forms have nowhere to submit, so handle them in script.
- **Storage:** `localStorage` may be missing or throw. Wrap every access in try/catch.
- **Theme attribute:** the host may set `data-theme` on `<html>` at any time. The theme script handles it; page scripts never touch the attribute.
- **Clipboard:** `navigator.clipboard.writeText` works only inside a click handler, so always provide a fallback.
- **Anchors:** in-page anchors use plain `#name` ids of ASCII letters, digits and hyphens.

**Before delivering a page:**
1. The build prints no warnings.
2. Prose stays in the column, and wide content uses `.wide` (or the page uses `layout: wide`).
3. Every signal colour sits beside a glyph or a word.
4. No raw colours in page CSS; tokens only. Any rule the page bends has a comment saying why.
5. Example data is labelled.
6. If you can render the page, check it at 390px and 1400px, in both themes, by keyboard, and with reduced motion.

## 14. Do and don't

| Do | Don't |
|---|---|
| Use one ink at varying strengths | Add an accent colour, gradients or brand hues |
| Use the categorical colours when greyscale cannot tell groups apart | Colour groups that greyscale already separates, or use a signal colour as a series |
| Use signal colours for status, with a glyph or word | Colour links, headings, icons or decoration |
| Separate with hairlines and whitespace | Wrap everything in cards with shadows |
| Keep prose in the 36rem column | Stretch text to fill wide screens |
| Let wide content grow into the right margin | Centre wide blocks over the contents rail |
| Give apps, dashboards and trackers `layout: wide` | Squeeze a tool into the reading column, or centre a narrow heading over a wide block |
| Use Outfit 600 for every heading | Mix heading weights or set headings in the serif |
| Use italic Lora for commentary | Set whole passages of content in italic |
| Put metadata in mono | Use mono for prose or headings |
| Invert on link hover; fill pressed controls with ink | Use coloured hovers |
| Show state with fill, hatching, dashes and glyphs | Rely on red and green alone |
| Default to Auto and offer the small toggle beside the date | Add other controls or bars to the page frame |
| Give dark mode the same care as light | Invert colours, or use pure `#000` and `#fff` |
| Keep motion small and optional | Animate content in from opacity 0 |
| Write labels that say what happens | Use "Submit", "OK" or "Click here" |
| Let `--faint` carry only redundant detail | Put essential information in `--faint` |
| End long pages with "Back to top" alone | Add colophons, credits or "made with" lines |
| Start the first paragraph plainly | Add drop caps or other ornaments |
| Label example data | Present invented figures as real |

---

## 15. Bending the rules

These rules serve reading. A page that is a tool rather than a document may bend some of them where that makes it work better.

**May bend:**

- **Width and density.** `layout: wide` (5.7) for apps, dashboards and trackers.
- **Colour for identity.** The categorical colours (3.6), only when greyscale cannot tell the groups apart.
- **Component sizes.** A page `<style>` may change the size, spacing and layout of components to fit its content: wrap a column, shorten a tile, widen a side sheet.

**Never bends:**

- Tokens only. No raw colours in page CSS or inline styles.
- The three typefaces, and the four voices with one job each.
- Signal colours are for status only, beside a glyph or a word.
- Light and dark get equal care.
- No ornament, gradients or brand colour, and no shadows except on dialogs.
- Accessibility (section 11) and the writing rules (section 12).

**How to bend:**

1. Bend the fewest rules that solve the problem, and keep everything else as written.
2. Say why in a comment beside the change, for example `/* Graph: categorical colours, because six sections overlap in a network */`.
3. Check the result in both themes and at phone width, as for any page.
4. If the same bend turns up in more than one page, make it part of the system here, as `layout: wide` and the categorical colours were.


---

# Core components

On every page. Use these class names exactly.

### masthead
The title, meta line, theme toggle and lede at the top of every page; the builder writes it from the front matter. Nothing goes above the title. The meta line gives the date, then `meta` facts separated by ` · `. The lede is one to three italic sentences. Do not write a masthead in the source.

### theme-toggle
A three-icon control beside the date (Auto, Light, Dark); the builder adds it to every page. Auto follows `data-theme` when Claude sets it on `<html>`, and the system preference otherwise. Light and Dark override it, the choice is stored in `localStorage`, and it keeps tracking the host's changes. Page scripts never set `data-theme`. To redraw a graphic when the theme changes, push its draw function onto `redrawers`.

### contents
The contents rail, progress line, section numbers and footer, all generated by the builder. They turn on automatically at four or more sections, or with `rail: on`. The rail lists each section's `h2`. On wide screens it sits sticky in the left margin; below 1100px it sits inline under the masthead. The footer holds only "Back to top".

### section
Wrap each part of the page in a section with an `h2`; the builder adds the id, number and `aria-labelledby`. Use `h3` for subsections. Keep prose in the column; give tables, charts and tools that need room the `wide` class. A `.section-note` straight after the heading is a short italic line about how to use the section; in the wide layout it sits beside the heading.

```html
<section class="section" id="costs">
  <h2>Costs</h2>
  <p class="section-note">Figures are monthly, in pounds.</p>
  <p>Opening paragraph.</p>
  <h3>Subsection</h3>
  <p>…</p>
</section>
```

### inline-text
Inline elements, each styled in one voice.
- `strong`: Lora 600 in ink.
- `em`: italic.
- `mark`: a 13% ink tint.
- `del` and `ins`: a faint strike, and ink with an underline.
- `small`: muted.
- `abbr`: a dotted underline.
- `dfn`: italic 600.
- `code`: mono on the surface.
- `kbd`: mono key caps.
- `samp`: mono.
- `var`: italic serif.

Links are muted and underlined, and invert to ground-on-ink on hover.

```html
<p>Press <kbd>Esc</kbd> to close. Call <code>init()</code> once. The <mark>key phrase</mark> is marked.
Written in <abbr title="HyperText Markup Language">HTML</abbr>. Now <del>£24.99</del> <ins>£19.99</ins>.</p>
```

### blockquote
A quotation from another source, with a 2px bar on the left, in muted italic. Attribution goes in a `footer`, with the work in `cite`.

```html
<blockquote>
  <p>Have nothing in your houses that you do not know to be useful, or believe to be beautiful.</p>
  <footer>William Morris, <cite>The Beauty of Life</cite>, 1880</footer>
</blockquote>
```

### lists
Bulleted, numbered and description lists. Markers are faint, and nested numbered lists use letters. In a description list, terms are Outfit 600 and definitions muted.

```html
<ul><li>Item<ul><li>Nested item</li></ul></li></ul>
<ol><li>Step<ol><li>Sub-step</li></ol></li></ol>
<dl class="terms"><dt>Leading</dt><dd>The vertical space between lines.</dd></dl>
```

### task-list
A checklist of native checkboxes with a live "2 of 5 done" counter. Checked items turn faint with a strike.

```html
<p class="tasks-count"><span>2</span> of 3 done</p>
<ul class="task-list">
  <li><label for="t1"><input type="checkbox" id="t1" checked><span>Choose a body face</span></label></li>
  <li><label for="t2"><input type="checkbox" id="t2" checked><span>Pair it with a display face</span></label></li>
  <li><label for="t3"><input type="checkbox" id="t3"><span>Check focus states</span></label></li>
</ul>
```

### specimen-rows
Key and value rows with a mono label column and hairlines between rows. Use them for summaries, spec sheets, settings and review steps. They stack on phones.

```html
<dl class="specimens">
  <div class="specimen"><dt>Owner</dt><dd>Platform team</dd></div>
  <div class="specimen"><dt>Due</dt><dd>12 December 2026</dd></div>
</dl>
```

### steps
A numbered procedure with circled mono numbers joined by a rule. Each step has an Outfit title and a muted body.

```html
<ol class="steps">
  <li><span class="step-title">Install</span><span class="step-body">Copy the folder to your home directory.</span></li>
  <li><span class="step-title">Build</span><span class="step-body">Run the builder on your page.</span></li>
</ol>
```

### table
A data table with rules only between rows and uppercase muted headings over a strong rule. It is 0.95rem, inside `.table-wrap` so it can scroll sideways.
- `.num` cells align right with tabular figures; put the class on the heading too.
- Totals go in a `tfoot`.
- The caption sits below, italic and faint.
- Add `wide` to the wrap when the table needs room.

```html
<div class="table-wrap">
  <table>
    <caption>Costs for November. Example data.</caption>
    <thead><tr><th scope="col">Item</th><th scope="col" class="num">Cost</th></tr></thead>
    <tbody><tr><td>Hosting</td><td class="num">£120.00</td></tr></tbody>
    <tfoot><tr><th scope="row">Total</th><td class="num">£120.00</td></tr></tfoot>
  </table>
</div>
```

### sortable-table
A table whose column headings sort it when pressed, with ↕ ↑ ↓ indicators and `aria-sort`. Add `data-sortable` to the table, and put a button in each heading. Use `data-type="num"` on numeric columns.

```html
<div class="table-wrap">
  <table data-sortable>
    <thead><tr>
      <th scope="col"><button type="button" data-type="text">Item</button></th>
      <th scope="col" class="num"><button type="button" data-type="num">Price</button></th>
    </tr></thead>
    <tbody>
      <tr><td>Desk lamp</td><td class="num">£24.99</td></tr>
      <tr><td>Notebook</td><td class="num">£3.50</td></tr>
    </tbody>
  </table>
</div>
```

### comparison-table
A feature comparison with centred cells. A ✓ icon labelled "Yes" or a faint dash labelled "No" carries the answer, and a short italic note covers a partial one. Row headings use the body face.

```html
<div class="table-wrap">
  <table class="compare">
    <thead><tr><th scope="col">Need</th><th scope="col" class="c">Option A</th><th scope="col" class="c">Option B</th></tr></thead>
    <tbody>
      <tr><th scope="row">Prints well</th>
        <td class="c"><svg class="icon" role="img" aria-label="Yes"><use href="#i-check"></use></svg></td>
        <td class="c note">Partly</td></tr>
      <tr><th scope="row">Fills the window</th>
        <td class="c"><span class="no" role="img" aria-label="No">—</span></td>
        <td class="c"><svg class="icon" role="img" aria-label="Yes"><use href="#i-check"></use></svg></td></tr>
    </tbody>
  </table>
</div>
```

### code
A code block on the surface, with mono 0.78rem text and greyscale syntax highlighting. Add a `language-*` class (markup, css or javascript) and the builder adds Prism. Escape `<` and `&` inside code.

```html
<pre><code class="language-css">a:hover { color: var(--bg); background: var(--ink); }</code></pre>
```

### code-tabs
Several code files in one block, with mono tabs and a Copy button. Use the arrow keys to move between tabs. The Copy button copies the open panel.

```html
<div class="code-tabs">
  <div class="code-bar">
    <div role="tablist" aria-label="Code samples">
      <button type="button" role="tab" id="tab-a" aria-controls="panel-a" aria-selected="true">index.html</button>
      <button type="button" role="tab" id="tab-b" aria-controls="panel-b" aria-selected="false" tabindex="-1">styles.css</button>
    </div>
    <button type="button" class="btn btn-text btn-sm" data-copy>Copy</button>
  </div>
  <div role="tabpanel" id="panel-a" aria-labelledby="tab-a" tabindex="0"><pre><code class="language-markup">&lt;p&gt;Hello&lt;/p&gt;</code></pre></div>
  <div role="tabpanel" id="panel-b" aria-labelledby="tab-b" tabindex="0" hidden><pre><code class="language-css">p { margin: 0; }</code></pre></div>
</div>
```

### diff
A code change with `+` and `−` gutters. Added lines are success on a tint, removed lines danger on a tint, and the header gives the file name and counts. Put no line breaks between the line spans.

```html
<div class="diff">
  <div class="diff-head"><span>styles.css</span><span><span class="add-n">+1</span> <span class="del-n">−1</span></span></div>
  <pre><code><span class="dl"> .footer {</span><span class="dl del">-  gap: 1rem;</span><span class="dl add">+  justify-content: flex-end;</span><span class="dl"> }</span></code></pre>
</div>
```

### disclosure
An accordion of native `details` elements that share a `name`, so opening one closes the others. The summary is Outfit 500 with a rotating `+`. Open the first item.

```html
<div class="faq">
  <details name="faq" open><summary>Does it need a framework?</summary><p>No. One HTML file.</p></details>
  <details name="faq"><summary>Is anything saved?</summary><p>Only the theme choice.</p></details>
</div>
```

### form
Form layout and controls: fieldsets with spaced-label legends, rows that pair on desktop and stack on phones, and Outfit labels.
- **Inputs** have a strong border and an ink focus halo.
- **Controls:** a chevron select, native radios and checkboxes, a pill switch, and a range paired with an `output`.
- **Submit:** always handled in script, and never claims anything was sent. Add `data-validate` and `novalidate` for inline errors (see field-errors).

```html
<form class="form" novalidate data-validate>
  <fieldset>
    <legend>Your details</legend>
    <div class="field-row">
      <div class="field"><label for="name">Name</label><input type="text" id="name" autocomplete="name"></div>
      <div class="field"><label for="topic">Topic</label><div class="select"><select id="topic"><option>General</option></select></div></div>
    </div>
    <div class="field"><div class="label-row"><label for="msg">Message</label><span class="hint">0 / 280</span></div><textarea id="msg" maxlength="280"></textarea></div>
    <fieldset>
      <legend>How often?</legend>
      <div class="choices">
        <label class="choice" for="w"><input type="radio" id="w" name="freq" checked>Weekly</label>
        <label class="choice" for="m"><input type="radio" id="m" name="freq">Monthly</label>
      </div>
    </fieldset>
    <label class="switch" for="copy"><input type="checkbox" role="switch" id="copy"><span>Send me a copy</span></label>
  </fieldset>
  <div class="btn-row">
    <button type="submit" class="btn btn-primary">Check form</button>
    <button type="reset" class="btn btn-secondary">Reset</button>
    <p class="form-status" role="status" aria-live="polite"></p>
  </div>
</form>
```

### field-errors
Inline error messages in danger red with an ✕, shown on submit and cleared as soon as the field is valid. Give each required control `aria-describedby="err-<id>"` and add a hidden `.field-error` with that id. The message says how to fix it. Focus moves to the first invalid field, and the status line reads "Some fields need attention."

```html
<div class="field">
  <label for="email">Email</label>
  <input type="email" id="email" required aria-describedby="err-email" placeholder="ada@example.com">
  <p class="field-error" id="err-email" hidden>{{icon:x}}Enter an email address, like ada@example.com.</p>
</div>
<label class="choice" for="agree"><input type="checkbox" id="agree" required aria-describedby="err-agree"><span>I understand nothing is sent</span></label>
<p class="field-error" id="err-agree" hidden>{{icon:x}}Tick this box to continue.</p>
```

### buttons
Buttons in Outfit 500 with a 3px radius. Labels say exactly what happens, and an icon sits before the label.
- **Primary:** ink fill, for the main action.
- **Secondary:** a strong border.
- **Text:** underlined.
- **Danger outline:** to start a destructive action.
- **Danger (solid):** only to confirm one, in a dialog.
- **Icon button:** a square that needs an `aria-label`.
- **Small:** `btn-sm`.

`data-toast="message"` on any button shows a toast when pressed.

```html
<div class="btn-row">
  <button type="button" class="btn btn-primary">Save draft</button>
  <button type="button" class="btn btn-secondary">{{icon:link}}Copy link</button>
  <button type="button" class="btn btn-text">Cancel</button>
  <button type="button" class="btn btn-danger-outline" data-toast="Delete pressed. Nothing was deleted.">{{icon:trash}}Delete draft</button>
  <button type="button" class="icon-btn" aria-label="Search">{{icon:search}}</button>
  <button type="button" class="btn btn-secondary btn-sm">Small</button>
</div>
```

### progress
A thin progress bar with a label row: an Outfit label on the left and a mono value on the right. Leave out `value` for an indeterminate bar.

```html
<div class="gauges">
  <div class="gauge">
    <div class="top"><label for="up">Uploading draft.pdf</label><span class="val">62%</span></div>
    <progress id="up" max="100" value="62">62%</progress>
  </div>
</div>
```

### meter
A measurement within a known range, where colour and pattern carry the state: solid ink is good, warning is borderline, and danger hatching is bad. Set `low`, `high` and `optimum`.

```html
<div class="gauges">
  <div class="gauge">
    <div class="top"><label for="disk">Storage used</label><span class="val">48 of 64 GB</span></div>
    <meter id="disk" min="0" max="64" low="40" high="56" optimum="10" value="48">48 GB</meter>
  </div>
</div>
```

### chips
Lifecycle status pills whose dot fill shows progress. Draft is an empty ring, In review half-filled, Published an inked chip with a filled dot, and Archived dashed. Add `sm` for a small chip inside text.

```html
<div class="chips">
  <span class="chip">Draft</span><span class="chip is-review">In review</span>
  <span class="chip is-live">Published</span><span class="chip is-archived">Archived</span>
</div>
```

### signal-chips
Status chips and inline results in a signal colour, always with a glyph. Passing is success, Flaky warning, Failing danger. `.sig` is the inline form: just the glyph and word in colour.

```html
<div class="chips">
  <span class="chip is-pass">{{icon:check}}Passing</span>
  <span class="chip is-flaky">{{icon:alert}}Flaky</span>
  <span class="chip is-fail">{{icon:x}}Failing</span>
</div>
<p><span class="sig is-success">{{icon:check}}Saved</span> <span class="sig is-danger">{{icon:x}}Couldn’t publish</span></p>
```

### dialog
A modal dialog opened by any button with `data-dialog="id"`. Clicking the backdrop or pressing Esc closes it, and the dialog is the only element with a shadow. Actions sit on the right, secondary first. A destructive confirm uses the solid danger button. Read the choice in the dialog's `close` event.

```html
<button type="button" class="btn btn-secondary" data-dialog="discard">Discard draft</button>
<dialog id="discard" aria-labelledby="discard-h">
  <form method="dialog">
    <h3 id="discard-h">Discard changes?</h3>
    <p>Your edits have not been saved. Discarding them cannot be undone.</p>
    <div class="btn-row">
      <button type="submit" class="btn btn-secondary" value="cancel">Keep editing</button>
      <button type="submit" class="btn btn-danger" value="confirm">Discard</button>
    </div>
  </form>
</dialog>
```

```js
$('#discard').addEventListener('close', e => toast(e.target.returnValue === 'confirm' ? 'Discarded. Nothing was saved.' : 'Still editing'));
```

### toast
A short confirmation in an ink pill at the bottom of the screen that fades after 2.4 seconds. The builder adds the element. Call `toast('Saved')` from page script, or put `data-toast` on a button.

```js
toast('Copied to clipboard');
```

### alerts
Inline messages on a surface panel with a 3px status bar, an icon, an Outfit title and ink body text. Info stays in ink. Success, warning and danger tint the panel and colour the bar, icon and title. Danger uses `role="alert"` and the others `role="status"`. A ghost dismiss button is optional.

```html
<div class="alerts">
  <div class="alert" role="status">{{icon:info}}<div><p class="alert-title">New version available</p><p>Reload to get it.</p></div>
    <button type="button" class="icon-btn ghost" data-dismiss aria-label="Dismiss">{{icon:x}}</button></div>
  <div class="alert is-success" role="status">{{icon:check}}<div><p class="alert-title">Changes saved</p><p>Your draft was saved a moment ago.</p></div></div>
  <div class="alert is-warning" role="status">{{icon:alert}}<div><p class="alert-title">Storage almost full</p><p>48 of 64 GB used.</p></div></div>
  <div class="alert is-danger" role="alert">{{icon:x}}<div><p class="alert-title">Couldn’t publish</p><p>The page has no title. Add one, then try again.</p></div></div>
</div>
```

### callouts
Asides that need more weight than a paragraph, on a surface panel with a spaced-label column. Note and Tip are plain; Warning uses the warning tint and bar. Use them sparingly.

```html
<div class="callouts">
  <div class="callout"><span class="callout-label">Note</span><p>Every colour comes from six tokens.</p></div>
  <div class="callout is-warning"><span class="callout-label">Warning</span><p>Nothing in this form is sent anywhere.</p></div>
</div>
```

### figure
An image, canvas or inline SVG with a caption: an italic, faint full sentence. A text button or legend can sit on the right of the caption. Remote images do not load in artifacts, so use inline SVG or `data:` URIs, and always give `alt`. Two-up rows share one aspect ratio and stack on phones.

```html
<figure>
  <svg viewBox="0 0 300 200" role="img" aria-label="Placeholder, 3 by 2">
    <rect class="ph-bg" width="300" height="200"></rect>
    <line class="ph-line" x1="0" y1="0" x2="300" y2="200"></line>
    <text class="ph-text" x="150" y="105" text-anchor="middle">3 : 2</text>
  </svg>
  <figcaption><span>Caption as a full sentence.</span></figcaption>
</figure>
<div class="figure-row"><figure>…</figure><figure>…</figure></div>
```

### footnotes
Mono `[1]` references with notes at the end after a rule, each with a ↩ back-link. The note highlights when jumped to. Use footnotes for citations people look up; use sidenotes for asides people read.

```html
<p>Claim.<sup class="fn-ref"><a href="#fn1" id="fnref1" aria-label="Footnote 1">[1]</a></sup></p>
<hr>
<div class="footnotes" role="doc-endnotes"><ol>
  <li id="fn1">Source of the claim. <a href="#fnref1" class="back" aria-label="Back to reference 1">↩</a></li>
</ol></div>
```

### widths
Three widths: text (the default 36rem column), `.wide` and `.full`. `.wide` keeps its left edge on the column and grows right up to 54rem; use it for tables, charts, tools and diagrams. `.band.full` spans the window on a surface, and `.band-inner` lines its content up with the text. Below 760px everything sits in the column. In the wide layout, `.wide` and `.full` simply fill the frame.

```html
<div class="table-wrap wide">…</div>
<figure class="wide">…</figure>
<div class="band full"><div class="band-inner">…</div></div>
```

### wide-layout
`layout: wide` in the front matter swaps the centred reading column for a left-aligned work surface up to 120rem wide. Use it for apps, dashboards and trackers, not documents. The root type is 16px, the masthead is one row with a hairline under it, section headings are smaller and the rail is off by default. Prose in a section still stops at the 36rem measure, and `.wide` simply fills the width. Give a section `fill` and its app shell takes the rest of the window, so the work area scrolls inside it and the page does not; below 760px the shell falls back to a fixed height. A fill section holds a heading, an optional `.section-note` and one block.

```html
<!--
title: Repo tracker
lede: Every repo, how it ships and where it goes.
layout: wide
-->

<section class="section" id="overview">
  <h2>Overview</h2>
  <p class="section-note">Press a figure to show only those repos.</p>
  <div class="stats">…</div>
</section>

<section class="section fill" id="repos">
  <h2>Repos</h2>
  <div class="shell">…</div>
</section>
```

### icons
27 line icons drawn at a 1.5 stroke in the current text colour, for scanning only and never decoration. Write `{{icon:name}}`; the builder expands it and includes only the icons used. `{{icon:arrow-up-right ext}}` adds the small external-link class. Icon-only buttons need an `aria-label`. An icon that carries meaning on its own takes `role="img"` and an `aria-label` (write the `svg` out in full). List them with `build.py list icons`.

```html
<a href="https://example.com">Read the source{{icon:arrow-up-right ext}}</a>
<button type="button" class="icon-btn" aria-label="Download">{{icon:download}}</button>
```

### print
Print styles that the builder includes on every page.
- Black ink on white, with signal colours kept.
- Contents, progress line, toggle, toasts and buttons hidden.
- External links print their URL.
- Figures, tables, code, alerts and panels never split across pages, and headings stay with their text.
- Wide and full blocks fall back into the column, and sidenotes drop inline.
- 11pt text with 18mm margins.

Nothing to write.


---

# Data components

Added when a page uses one of these classes, or calls `lineChart`, `heatmap` or `calendar`. Charts are greyscale with mono labels; the categorical colours come in only when greyscale cannot tell the groups apart. Signal colours appear only where a change is good or bad. Label example data on the page.

### stat-tiles
A row of key figures separated by hairlines. Each tile has a spaced label, a big number, a mono change line and a sparkline. The change is green when it is good and red when it is bad, whichever way the arrow points; add `is-good` or `is-bad`, or neither for neutral. Tiles go two-up on phones.

```html
<div class="stats wide">
  <div class="stat">
    <p class="spaced-label">Readers</p>
    <p class="stat-value">18,240</p>
    <p class="stat-delta is-good"><span aria-hidden="true">▲</span> 8.3% <span class="vs">vs October</span></p>
    <svg class="spark" data-spark="10.4,11.2,12,12.9,13.6,14.8,14.1,13.9,15.6,16.8,18.2" aria-hidden="true"></svg>
  </div>
  <div class="stat">
    <p class="spaced-label">Bounce rate</p>
    <p class="stat-value">41%</p>
    <p class="stat-delta is-bad"><span aria-hidden="true">▲</span> 3 pts <span class="vs">vs October</span></p>
    <svg class="spark" data-spark="44,43,43,42,40,39,39,38,38,38,41" aria-hidden="true"></svg>
  </div>
</div>
```

### sparklines
A small line of values with no axes: an ink line, a light area fill and an end dot, drawn to fit its box. Write the values in `data-spark`; it redraws on resize.

```html
<svg class="spark" data-spark="3,5,4,8,7,9" aria-hidden="true"></svg>
```

### line-chart
A responsive SVG line chart.
- **Series:** the main series is ink with an area fill and an end label. A comparison series is muted and dashed. A series may stop early (a year in progress).
- **Axes:** faint gridlines and mono axis labels.
- **Hover:** a crosshair and a tooltip.
- **Legend:** in the figcaption.

Give the container `role="img"` and an `aria-label` that states the finding. Draw it from page script and push the returned function onto `redrawers`.

```html
<figure class="wide">
  <div class="chart" id="readersChart" role="img" aria-label="Line chart: readers per month rose from 10.4k to 18.2k this year. Example data."></div>
  <figcaption><span>Readers per month, in thousands. Example data.</span><span class="legend"><span class="key"></span>This year<span class="key prev"></span>Last year</span></figcaption>
</figure>
```

```js
redrawers.push(lineChart($('#readersChart'), {
  labels: MONTHS,
  max: 20,
  ticks: [0, 5, 10, 15, 20],
  format: v => (v ? `${v}k` : '0'),
  series: [
    { name: 'This year', cls: 'now', values: [10.4, 11.2, 12.0, 12.9, 13.6, 14.8, 14.1, 13.9, 15.6, 16.8, 18.2] },
    { name: 'Last year', cls: 'prev', values: [9.2, 9.8, 10.5, 11.0, 11.8, 12.1, 11.4, 11.0, 12.6, 13.4, 14.0, 13.1] }
  ]
}));
```

### chart-library
How to hand the tokens to a charting library instead of keeping its defaults. Load the library from cdnjs with a pinned version. `token()` reads a token from page script; add `scripts: +tokens` to the front matter if the builder does not pick it up.

```js
// Chart.js
Chart.defaults.font.family = token('--font-mono');
Chart.defaults.font.size = 11;
Chart.defaults.color = token('--faint');
Chart.defaults.borderColor = token('--rule');
Chart.defaults.elements.line.borderColor = token('--ink');
Chart.defaults.elements.line.borderWidth = 1.5;
Chart.defaults.elements.point.radius = 0;
Chart.defaults.plugins.legend.display = false;
// Several groups that greyscale cannot separate: categorical colours, in order
const series = [1, 2, 3, 4, 5, 6, 7, 8].map(i => token(`--cat-${i}`));
```

### categorical-colours
Eight colours, `--cat-1` to `--cat-8`, for telling groups apart when greyscale cannot: network graphs, scatter plots, maps and charts with more groups than the greyscale treatments. Each has its own dark value. Rules 3.6 has the full rules. In short:
- Give out slots in token order and never cycle. Past the eighth group, fold the rest into "Other" in `--shade-4`.
- Values that mean gone or nothing (archived, none) take `--shade-3` and do not use up a slot.
- Work out the assignment from the whole data set, not the filtered rows, so a filter never repaints the groups that remain.
- Always add a legend, plus direct labels or a tooltip. Where any two groups can sit side by side, only the first three are safe on colour alone.
- Labels and values stay in ink, with a coloured mark beside them. Signal colours never stand in for a group.
- In SVG, set colours with `style` rather than attributes, so `var()` resolves.

```js
const SLOTS = [1, 2, 3, 4, 5, 6, 7, 8].map(i => `var(--cat-${i})`);
const NEUTRAL = new Set(['archived', 'none']);
// One colour per group, decided from every row (not the filtered ones), largest group first
function groupColours(rows, groupOf) {
  const counts = new Map();
  rows.forEach(r => counts.set(groupOf(r), (counts.get(groupOf(r)) || 0) + 1));
  const groups = [...counts.keys()].filter(g => !NEUTRAL.has(g)).sort((a, b) => counts.get(b) - counts.get(a));
  const fits = groups.length <= SLOTS.length;
  const slot = new Map(groups.map((g, i) => [g, i < SLOTS.length - (fits ? 0 : 1) ? SLOTS[i] : 'var(--shade-4)']));
  return g => NEUTRAL.has(g) ? 'var(--shade-3)' : slot.get(g) || 'var(--shade-4)';
}
const colourOf = groupColours(ALL_ROWS, r => r.team);
circle.style.fill = colourOf(row.team);
```

### bar-rows
The simplest chart: one row per item with a mono label, a thin track, an ink fill with an end dot, and a mono value. Set each fill's width with `--w`.

```html
<div class="bars">
  <div class="bar-row"><span class="tag">Lora</span><span class="track"><span style="--w: 100%"></span></span><span class="val">412</span></div>
  <div class="bar-row"><span class="tag">Outfit</span><span class="track"><span style="--w: 64%"></span></span><span class="val">264</span></div>
</div>
```

### heatmap
A year of daily values as a week-by-day grid, on a full-width band.
- **Levels:** 0 to 4, in five shades of ink.
- **Labels:** mono month and weekday labels, and a title on every cell.
- **Legend:** an italic caption, then Less to More.

Draw it from page script: one value per day, oldest first, ending on `end`. `thresholds` are the minimum values for levels 1 to 4.

```html
<div class="band full"><div class="band-inner">
  <div class="heatmap" id="heatmap" role="img" aria-label="Heatmap of daily sessions over a year. Example data."></div>
  <div class="heat-foot"><span>Daily sessions over the past year. Example data.</span>
    <span class="heat-legend">Less <span class="hm-cell"></span><span class="hm-cell l1"></span><span class="hm-cell l2"></span><span class="hm-cell l3"></span><span class="hm-cell l4"></span> More</span></div>
</div></div>
```

```js
const days = Array.from({ length: 364 }, (_, i) => Math.round(Math.abs(Math.sin(i * 1.7)) * 10));   // example data
heatmap($('#heatmap'), { values: days, end: new Date(), thresholds: [1, 3, 6, 9], unit: ' sessions' });
```

### calendar
A Monday-first month grid with an agenda beside it. Today is ringed, days with events get a dot, and the selected day is ink-filled. Previous and next buttons change the month, and selecting a day lists its events. It stacks on narrow screens. Draw it from page script.

```html
<div class="cal-wrap" id="calendar">
  <div>
    <div class="cal-head">
      <p class="cal-title"></p>
      <div class="cal-nav">
        <button type="button" class="icon-btn" data-cal-prev aria-label="Previous month">{{icon:chevron-left}}</button>
        <button type="button" class="icon-btn" data-cal-next aria-label="Next month">{{icon:chevron-right}}</button>
      </div>
    </div>
    <div class="cal-grid"></div>
  </div>
  <div class="agenda" aria-live="polite"><p class="spaced-label"></p><ul></ul></div>
</div>
```

```js
calendar($('#calendar'), {
  month: new Date(2026, 10, 1),
  selected: '2026-11-22',
  events: { '2026-11-21': ['Specimen first published'], '2026-11-22': ['Draft additions'] }
});
```

### big-number
The one figure a tool or tile exists to produce, in Outfit 600 at 2.6rem with tabular figures, plus a mono unit. Put a spaced label above it.

```html
<p class="spaced-label">Contrast ratio</p>
<p class="big-number"><span id="ratio">13.31</span><span class="unit"> : 1</span></p>
```


---

# Diagram components

Added when a page uses `.mermaid-box`.

### mermaid
A flowchart or other Mermaid diagram drawn in the house font and greys, which redraws when the theme changes. Write the Mermaid source in a `pre` inside `.mermaid-box`. The source stays on show until Mermaid 10.9.1 loads, from jsDelivr, as the diagram comes near the viewport. Put it in a wide figure with an italic caption that says what the diagram shows. Keep labels short: one idea per node, and Yes or No on decision edges.

```html
<figure class="wide">
  <div class="mermaid-box"><pre>flowchart LR
  A[Copy the skeleton] --> B[Write the content]
  B --> C{Four or more sections?}
  C -- Yes --> D[Contents rail]
  C -- No --> E[No rail]
  D --> F([Build])
  E --> F</pre></div>
  <figcaption>How a page gets built.</figcaption>
</figure>
```


---

# Long-form components

Added when a page uses one of these classes.

### pull-quote
One line lifted from the text and set large in Outfit 600 between two hairlines. Use at most one per section, and only for a line that is in the text or sums it up.

```html
<p class="pullquote">Good typography goes unnoticed until it is missing.</p>
```

### sidenotes
Asides set beside the line that mentions them: in the right margin from 1200px, and as indented asides in the text below that. They are italic, 0.82rem and muted. Put the reference and the note straight after the words they belong to. Use sidenotes for asides people read and footnotes for citations people look up.

```html
<p>Long reads can keep their asides beside the text.<span class="sn-ref" aria-hidden="true">1</span><span class="sidenote" role="note"><span class="sn-num">1</span>On wide screens this sits in the right margin.</span> The text carries on.</p>
```

### timeline
A dated sequence of events on a hairline spine, with a mono date column and a dot per entry; the newest dot is filled. Each entry has an Outfit title, an optional chip and a muted body. Put the newest entry first. It stacks on phones.

```html
<ol class="timeline">
  <li><time datetime="2026-11-22">22/11/2026</time><div><p class="tl-title">Launched <span class="chip sm is-live">Live</span></p><p class="tl-body">What happened.</p></div></li>
  <li><time datetime="2026-10-01">01/10/2026</time><div><p class="tl-title">Started</p><p class="tl-body">What happened.</p></div></li>
</ol>
```


---

# Tool components

Added when a page uses one of these classes.

### split-view
Controls on the left and live output on the right, in a hairline frame; it stacks below 760px. Use it for calculators, converters, generators and checkers. The output pairs a spaced label with a big number, then any preview or pass and fail lines. Recalculate on `input` events in page script.

```html
<div class="split wide">
  <div class="split-controls">
    <div class="field"><label for="amount">Amount</label><input type="text" id="amount" value="1200" inputmode="decimal"></div>
    <div class="field"><label for="months">Months</label><input type="text" id="months" value="12" inputmode="numeric"></div>
  </div>
  <div class="split-output" aria-live="polite">
    <p class="spaced-label">Monthly cost</p>
    <p class="big-number"><span id="result">£100.00</span><span class="unit"> per month</span></p>
  </div>
</div>
```

```js
const calc = () => {
  const total = Number($('#amount').value) / Math.max(1, Number($('#months').value));
  $('#result').textContent = Number.isFinite(total) ? `£${total.toFixed(2)}` : '—';
};
$$('#amount, #months').forEach(el => el.addEventListener('input', calc));
calc();
```

### app-shell
A framed tool layout: a header bar with breadcrumbs and a view switch, a side panel of filters, and a scrolling work area, all in compact density. Inside a document it is framed at a fixed height. Render the board or list from data in page script, and listen for the switches' `change` events.
- **Board:** three columns of task cards. Each card has a title, a mono tag, a due date with a calendar icon, and an avatar. Done cards are faint with a strike.
- **List view:** a compact table of the same items.

```html
<div class="shell wide">
  <header class="shell-bar">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="#">Studio</a></li><li aria-current="page">Project</li></ol></nav>
    <div class="segmented" role="group" aria-label="View" data-pressed-group id="viewSwitch">
      <button type="button" aria-pressed="true" data-value="board">{{icon:board}}Board</button>
      <button type="button" aria-pressed="false" data-value="list">{{icon:list}}List</button>
    </div>
  </header>
  <div class="shell-body">
    <aside class="shell-side" aria-label="Filter tasks">
      <p class="spaced-label">Tasks</p>
      <ul class="side-nav" data-pressed-group id="whoFilter">
        <li><button type="button" aria-pressed="true" data-value="all">{{icon:inbox}}All tasks<span class="count">3</span></button></li>
        <li><button type="button" aria-pressed="false" data-value="AL">{{icon:user}}Ada’s<span class="count">2</span></button></li>
      </ul>
    </aside>
    <div class="shell-main" id="shellMain"></div>
  </div>
</div>
<p class="caption">An example board. Switch views, or filter by person.</p>
```

```js
const TASKS = [
  { t: 'Write the brief', s: 'todo', who: 'AL', tag: 'Docs', due: '24/11' },
  { t: 'Review the draft', s: 'doing', who: 'GH', tag: 'Review', due: '23/11' },
  { t: 'Set up the repo', s: 'done', who: 'AL', tag: 'Core', due: '21/11' }
];
const COLS = [['todo', 'To do'], ['doing', 'Doing'], ['done', 'Done']];
let view = 'board', who = 'all';
const avatar = w => `<span class="avatar" title="${w}">${w}</span>`;
function renderShell() {
  const list = TASKS.filter(t => who === 'all' || t.who === who);
  $('#shellMain').innerHTML = view === 'board'
    ? '<div class="board">' + COLS.map(([k, label]) => {
        const items = list.filter(t => t.s === k);
        return `<div class="board-col"><p class="board-head"><span>${label}</span><span>${items.length}</span></p>` +
          items.map(t => `<article class="task${k === 'done' ? ' is-done' : ''}"><p class="task-title">${t.t}</p>` +
            `<p class="task-meta"><span>${t.tag}</span><span class="due">${icon('calendar')}${t.due}</span>${avatar(t.who)}</p></article>`).join('') + '</div>';
      }).join('') + '</div>'
    : '<table class="table-compact"><thead><tr><th scope="col">Task</th><th scope="col">Tag</th><th scope="col" class="num">Due</th><th scope="col">Who</th></tr></thead><tbody>' +
      list.map(t => `<tr><td>${t.t}</td><td class="mono">${t.tag}</td><td class="num mono">${t.due}</td><td>${avatar(t.who)}</td></tr>`).join('') + '</tbody></table>';
}
$('#viewSwitch').addEventListener('change', e => { view = e.detail; renderShell(); });
$('#whoFilter').addEventListener('change', e => { who = e.detail; renderShell(); });
renderShell();
```

### avatars
Initials in 1.5rem circles, ink-filled by default, with `is-alt` on a light shade. A group overlaps them with a ground ring. Always give a `title` with the full name.

```html
<div class="avatar-group"><span class="avatar" title="Ada Lovelace">AL</span><span class="avatar is-alt" title="Grace Hopper">GH</span></div>
```

### segmented
A segmented control for switching between views of the same content; the pressed option fills with ink. An optional mono readout states the result. The group fires a `change` event with the pressed button's `data-value`.

```html
<div class="segmented" role="group" aria-label="Period" data-pressed-group data-readout="periodOut" id="period">
  <button type="button" aria-pressed="false" data-value="week" data-label="Showing the past week">Week</button>
  <button type="button" aria-pressed="true" data-value="month" data-label="Showing the past month">Month</button>
  <button type="button" aria-pressed="false" data-value="year" data-label="Showing the past year">Year</button>
</div>
<p class="hint seg-readout" id="periodOut" aria-live="polite">Showing the past month</p>
```

### breadcrumbs
The path to the current page, in muted Outfit links separated by faint slashes. The current page is plain ink with `aria-current`.

```html
<nav class="crumbs" aria-label="Breadcrumb"><ol>
  <li><a href="#">Home</a></li><li><a href="#">Guides</a></li><li aria-current="page">Setup</li>
</ol></nav>
```

### pagination
Page buttons in mono with ellipses for gaps; the current page is ink-filled, and Previous and Next are words with chevrons. A mono readout says "Page 3 of 8". The builder's script draws the buttons from `data-pages`. Listen for `pagechange` to load a page.

```html
<nav class="pager" aria-label="Pagination" data-pages="8" data-page="2" data-readout="pageOut" id="pager"></nav>
<p class="hint seg-readout" id="pageOut" aria-live="polite">Page 2 of 8</p>
```

```js
$('#pager').addEventListener('pagechange', e => loadPage(e.detail));
```

### step-indicator
A task broken into steps, with numbered rules for current, finished and upcoming steps. Panels below hold the fields. Required fields in a panel must be valid before Next moves on, and Next becomes Finish on the last step. Listen for `stepchange` (to fill a review panel) and `finish`.

```html
<div class="wizard" id="wizard">
  <ol class="stepper">
    <li aria-current="step"><span class="n">01</span>Details</li>
    <li><span class="n">02</span>Layout</li>
    <li><span class="n">03</span>Review</li>
  </ol>
  <div class="wizard-panel" data-panel="1">
    <div class="field">
      <label for="wz-title">Page title</label>
      <input type="text" id="wz-title" required aria-describedby="err-wz-title">
      <p class="field-error" id="err-wz-title" hidden>{{icon:x}}Give the page a title.</p>
    </div>
  </div>
  <div class="wizard-panel" data-panel="2" hidden>
    <fieldset><legend>Layout</legend><div class="radio-cards">
      <label class="choice" for="l1"><input type="radio" id="l1" name="layout" value="Reading column" checked><span>Reading column<span class="choice-hint">For documents.</span></span></label>
      <label class="choice" for="l2"><input type="radio" id="l2" name="layout" value="Split view"><span>Split view<span class="choice-hint">For calculators.</span></span></label>
    </div></fieldset>
  </div>
  <div class="wizard-panel" data-panel="3" hidden>
    <dl class="specimens"><div class="specimen"><dt>Title</dt><dd id="r-title"></dd></div><div class="specimen"><dt>Layout</dt><dd id="r-layout"></dd></div></dl>
  </div>
  <div class="btn-row wizard-actions">
    <button type="button" class="btn btn-secondary" data-step-back>Back</button>
    <button type="button" class="btn btn-primary" data-step-next data-finish="Finish">Next</button>
  </div>
</div>
```

```js
$('#wizard').addEventListener('stepchange', e => {
  if (e.detail !== 3) return;
  $('#r-title').textContent = $('#wz-title').value;
  $('#r-layout').textContent = $('input[name="layout"]:checked').value;
});
$('#wizard').addEventListener('finish', () => toast('Done. Nothing was sent.'));
```

### selectable-cards
A row of cards for choosing between a few visual options, with one pressed at a time; the pressed card gets a surface fill and ink border. Each card has a large specimen, a name and a mono sub-label. On phones the row scrolls sideways. An optional readout echoes the choice.

```html
<div class="cards" role="group" aria-label="Paper size" data-pressed-group data-readout="paperOut">
  <button type="button" class="card-option" aria-pressed="true" data-value="a4" data-label="A4 · 210 × 297 mm">
    <span class="card-specimen" aria-hidden="true">A4</span>
    <span class="card-names"><span>International standard</span><span class="card-sub">210 × 297 mm</span></span>
  </button>
  <button type="button" class="card-option" aria-pressed="false" data-value="letter" data-label="Letter · 8.5 × 11 in">
    <span class="card-specimen" aria-hidden="true">Letter</span>
    <span class="card-names"><span>US and Canada</span><span class="card-sub">8.5 × 11 in</span></span>
  </button>
</div>
<p class="hint cards-readout" id="paperOut" aria-live="polite">A4 · 210 × 297 mm</p>
```

### search-table
A search box that filters a compact, sticky-headed table, with a live count and an empty state. The table scrolls inside a 19rem frame. The empty state echoes the query and offers one button to clear it. Add `data-noun-one` when the singular is not just the plural minus an s.

```html
<div class="table-tools">
  <div class="search">{{icon:search}}<label for="q" class="vh">Search components</label>
    <input type="search" id="q" placeholder="Search components" autocomplete="off"
           data-filter="compTable" data-count="compCount" data-empty="compEmpty" data-noun="components"></div>
  <span class="hint" id="compCount"></span>
</div>
<div class="table-scroll wide">
  <table class="table-compact" id="compTable">
    <thead><tr><th scope="col">Component</th><th scope="col">Module</th><th scope="col" class="num">Added</th></tr></thead>
    <tbody>
      <tr><td>Alerts</td><td class="mono">Core</td><td class="num mono">22/11/2026</td></tr>
      <tr><td>Heatmap</td><td class="mono">Data</td><td class="num mono">22/11/2026</td></tr>
    </tbody>
  </table>
  <div class="empty" id="compEmpty" hidden>
    <span class="empty-icon">{{icon:search}}</span>
    <p class="empty-title">No components match “<span data-query></span>”</p>
    <p>Try a shorter word, or clear the search.</p>
    <button type="button" class="btn btn-secondary btn-sm" data-clear>Clear search</button>
  </div>
</div>
```

### loading
Grey placeholder bars in the shape of the content while it loads, with a slow shimmer that stops under reduced motion. Toggle it with `setLoading(element, true or false)`, which also sets `aria-busy`.

```html
<div class="file-card" id="card" aria-busy="false">
  <div class="fc-real">
    <span class="file-icon">{{icon:file}}</span>
    <div><p class="file-name">design.md</p><p class="file-meta">Markdown · updated 22/11/2026</p></div>
  </div>
  <div class="sk-row" aria-hidden="true">
    <span class="sk sk-box"></span>
    <span class="sk-lines"><span class="sk" style="width: 35%"></span><span class="sk" style="width: 60%"></span></span>
  </div>
</div>
```

```js
setLoading($('#card'), true);
setTimeout(() => setLoading($('#card'), false), 1500);
```


---

# Assets


---

## assets/css/core.css

```css
/* ==========================================================
   Inkwell: core stylesheet (every page)
   ========================================================== */

:root {
  /* Layout: one quiet reading column; contents sit in the left margin on wide screens. */
  --bg: #f6f6f4;
  --surface: #ececea;
  --ink: #2a2a2a;
  --muted: #6a6a6a;
  --faint: #9b9b9b;
  --rule: #dededb;

  --text: color-mix(in srgb, var(--ink) 92%, var(--bg));
  --rule-strong: color-mix(in srgb, var(--ink) 24%, var(--bg));

  /* Signals: status only, always beside a glyph or a word */
  --danger: #a33a2f;
  --warning: #8a5d0f;
  --success: #2f6f45;

  /* Shades of ink for data */
  --shade-1: color-mix(in srgb, var(--ink) 8%, var(--bg));
  --shade-2: color-mix(in srgb, var(--ink) 22%, var(--bg));
  --shade-3: color-mix(in srgb, var(--ink) 40%, var(--bg));
  --shade-4: color-mix(in srgb, var(--ink) 62%, var(--bg));
  --shade-5: color-mix(in srgb, var(--ink) 88%, var(--bg));

  /* Categorical colours: identity for groups when greyscale cannot tell them apart (rules 3.6).
     Assign them in this order. The set was validated as a whole, so re-validate before changing or reordering it. */
  --cat-1: #2e69b2;   /* blue-black */
  --cat-2: #c96b7e;   /* rose */
  --cat-3: #ac8924;   /* mustard */
  --cat-4: #009390;   /* verdigris */
  --cat-5: #c35f36;   /* sienna */
  --cat-6: #7766b4;   /* violet */
  --cat-7: #67863a;   /* moss */
  --cat-8: #884783;   /* plum */

  --font-display: 'Outfit', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-body: 'Lora', Georgia, 'Times New Roman', serif;
  --font-mono: 'DM Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;

  --measure: 36rem;
  --wide: 54rem;
  --vw: calc(100vw - var(--sbw, 0px));   /* --sbw is set by script E.3 */
  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #161616;
    --surface: #212120;
    --ink: #e4e4e1;
    --muted: #a3a3a0;
    --faint: #72726f;
    --rule: #2c2c2b;
    --danger: #e5877d;
    --warning: #d9ad5b;
    --success: #7cc293;
    --cat-1: #5d94da;
    --cat-2: #cd677d;
    --cat-3: #b4902e;
    --cat-4: #0ca4a0;
    --cat-5: #d3754f;
    --cat-6: #8e7ecf;
    --cat-7: #79994d;
    --cat-8: #b570af;
    color-scheme: dark;
  }
}

:root[data-theme="dark"] {
  --bg: #161616;
  --surface: #212120;
  --ink: #e4e4e1;
  --muted: #a3a3a0;
  --faint: #72726f;
  --rule: #2c2c2b;
  --danger: #e5877d;
  --warning: #d9ad5b;
  --success: #7cc293;
  --cat-1: #5d94da;
  --cat-2: #cd677d;
  --cat-3: #b4902e;
  --cat-4: #0ca4a0;
  --cat-5: #d3754f;
  --cat-6: #8e7ecf;
  --cat-7: #79994d;
  --cat-8: #b570af;
  color-scheme: dark;
}

/* ---------- Base ---------- */
*, *::before, *::after { box-sizing: border-box; }

html {
  font-size: 18px;
  scroll-behavior: smooth;
  scroll-padding-top: 2rem;
}

body {
  margin: 0;
  overflow-x: clip;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

::selection { background: var(--ink); color: var(--bg); }

:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 3px;
  border-radius: 2px;
}

.vh {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* ---------- Utilities ---------- */
[hidden] { display: none !important; }

.mono { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); }
.caption { margin: 0.6rem 0 0; font-size: 0.82rem; font-style: italic; color: var(--faint); }
.spaced-label {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

/* ---------- Layout ---------- */
.layout {
  display: grid;
  grid-template-columns: minmax(0, var(--measure));
  justify-content: center;
  padding: 4rem 1.5rem 6rem;
}

.masthead { margin-bottom: 3.5rem; }

@media (min-width: 1100px) {
  .layout {
    grid-template-columns: 1fr minmax(0, var(--measure)) 1fr;
    column-gap: 4rem;
  }
  .masthead { grid-column: 2; grid-row: 1; margin-bottom: 4.5rem; }
  main { grid-column: 2; grid-row: 2; }
  .site-footer { grid-column: 2; grid-row: 3; }
}

.progress-line {
  position: fixed;
  inset: 0 0 auto 0;
  height: 2px;
  background: var(--ink);
  transform-origin: 0 50%;
  transform: scaleX(0);
  z-index: 50;
}

/* ---------- Headings ---------- */
h1, h2, h3, h4, h5, h6,
.h1, .h2, .h3, .h4, .h5, .h6 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--ink);
  text-wrap: balance;
  margin: 2em 0 0.6em;
}
h1, .h1 { font-size: 2.8rem; letter-spacing: -0.02em; }
h2, .h2 { font-size: 2rem; }
h3, .h3 { font-size: 1.5rem; }
h4, .h4 { font-size: 1.25rem; }
h5, .h5 { font-size: 1.05rem; }
h6, .h6 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

/* ---------- Masthead ---------- */
.masthead h1 { margin: 0 0 0.3rem; }
.meta {
  margin: 0 0 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--faint);
}
.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 0 1.5rem;
}
.meta-row .meta { margin: 0; }

/* Theme toggle */
.theme-toggle {
  display: inline-flex;
  flex: none;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--rule);
  border-radius: 4px;
}
.theme-toggle button {
  appearance: none;
  display: grid;
  place-items: center;
  width: 1.6rem;
  height: 1.45rem;
  padding: 0;
  color: var(--faint);
  background: none;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
}
.theme-toggle button:hover { color: var(--ink); }
.theme-toggle button[aria-pressed="true"] { color: var(--bg); background: var(--ink); }
.theme-toggle .icon { width: 0.9rem; height: 0.9rem; }

.lede {
  margin: 0;
  font-size: 1.12rem;
  font-style: italic;
  color: var(--muted);
}

/* ---------- Contents & rail ---------- */
.toc {
  margin: 0 0 3.5rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.toc-title {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.toc ol { list-style: none; margin: 0; padding: 0; columns: 2; column-gap: 2rem; }
.toc li { margin: 0; padding: 0.18rem 0; break-inside: avoid; }
.toc a {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  font-family: var(--font-display);
  font-size: 0.88rem;
  color: var(--muted);
  text-decoration: none;
}
.toc a .n { font-family: var(--font-mono); font-size: 0.66rem; color: var(--faint); }
.toc a:hover { color: var(--ink); background: none; }
.toc a[aria-current="true"],
.toc a[aria-current="true"] .n { color: var(--ink); }

@media (min-width: 1100px) {
  .rail {
    grid-column: 1;
    grid-row: 1 / span 3;
    justify-self: end;
    align-self: start;
    position: sticky;
    top: 4rem;
    width: 11rem;
    margin: 3.7rem 0 0;   /* lines up with the meta line under the h1 */
    max-height: calc(100vh - 5rem);
    overflow-y: auto;
  }
  .toc { margin: 0; padding: 0; border: 0; }
  .toc ol { columns: 1; }
}

/* ---------- Sections ---------- */
main { display: flex; flex-direction: column; gap: 4rem; }
.section + .section { padding-top: 4rem; border-top: 1px solid var(--rule); }
.eyebrow {
  margin: 0 0 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  color: var(--faint);
}
.section > h2 { margin-top: 0; display: flex; align-items: baseline; gap: 0.6rem; }
.section h3 { margin-top: 2.4rem; }
.section-note {
  margin: -0.2rem 0 1.25rem;
  font-size: 0.95rem;
  font-style: italic;
  color: var(--muted);
}

.anchor {
  font-family: var(--font-mono);
  font-size: 0.5em;
  font-weight: 400;
  color: var(--faint);
  text-decoration: none;
  opacity: 0;
  transition: opacity 0.15s;
}
.section > h2:hover .anchor,
.anchor:focus-visible { opacity: 1; }

.tag { font-family: var(--font-mono); font-size: 0.72rem; color: var(--faint); white-space: nowrap; }
.hint { font-family: var(--font-mono); font-size: 0.7rem; color: var(--faint); }

/* ---------- Body text & inline ---------- */
p { margin: 0 0 1em; }

a {
  color: var(--muted);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}
a:hover { color: var(--bg); background: var(--ink); text-decoration: none; }

strong, b { font-weight: 600; color: var(--ink); }
em, i, cite, q { font-style: italic; }
mark {
  background: color-mix(in srgb, var(--ink) 13%, transparent);
  color: inherit;
  padding: 0.05em 0.25em;
  border-radius: 2px;
}
del { color: var(--faint); }
ins { text-decoration: none; border-bottom: 1px solid var(--ink); color: var(--ink); }
small { font-size: 0.85em; color: var(--muted); }
abbr[title] { text-decoration: underline dotted; text-underline-offset: 0.2em; cursor: help; }
dfn { font-style: italic; font-weight: 600; color: var(--ink); }
sub, sup { font-size: 0.72em; line-height: 0; }
var { font-family: var(--font-body); font-style: italic; }

code, kbd, samp { font-family: var(--font-mono); }
code {
  font-size: 0.85em;
  background: var(--surface);
  padding: 0.12em 0.38em;
  border-radius: 3px;
}
kbd {
  font-size: 0.75em;
  padding: 0.1em 0.45em;
  color: var(--ink);
  background: var(--bg);
  border: 1px solid var(--rule-strong);
  border-bottom-width: 2px;
  border-radius: 4px;
  white-space: nowrap;
}
samp { font-size: 0.85em; }
ruby rt { font-family: var(--font-mono); font-size: 0.5em; color: var(--muted); }

/* Specimen / definition rows */
.specimens { margin: 1.5rem 0 0; border-top: 1px solid var(--rule); }
.specimen {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1.25rem;
  align-items: baseline;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--rule);
}
.specimen dt { font-family: var(--font-mono); font-size: 0.72rem; color: var(--faint); }
.specimen dd { margin: 0; }

/* ---------- Quotes ---------- */
blockquote {
  margin: 1.5rem 0;
  padding: 0.25rem 0 0.25rem 1.4rem;
  border-left: 2px solid var(--rule-strong);
  font-style: italic;
  color: var(--muted);
}
blockquote p { margin: 0 0 0.6em; font-size: 1.08rem; }
blockquote footer { font-style: normal; font-size: 0.85rem; color: var(--faint); }

/* ---------- Lists ---------- */
ul, ol { margin: 0 0 1em; padding-left: 1.4em; }
li { margin: 0.35em 0; padding-left: 0.2em; }
li > ul, li > ol { margin: 0.35em 0 0; }
li::marker { color: var(--faint); }
ol ol { list-style-type: lower-alpha; }

.tasks-count { margin: 0 0 0.6rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--faint); }
.task-list { list-style: none; padding: 0; }
.task-list li { padding: 0; }
.task-list label { display: flex; align-items: center; gap: 0.7rem; cursor: pointer; }
.task-list input:checked + span { color: var(--faint); text-decoration: line-through; }

.terms { margin: 0; }
.terms dt { margin-top: 1.1rem; font-family: var(--font-display); font-weight: 600; color: var(--ink); }
.terms dd { margin: 0.15rem 0 0; color: var(--muted); }

/* ---------- Tables ---------- */
.table-wrap { overflow-x: auto; margin: 1.5rem 0; }
table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
caption {
  caption-side: bottom;
  padding-top: 0.8rem;
  text-align: left;
  font-size: 0.82rem;
  font-style: italic;
  color: var(--faint);
}
th, td {
  padding: 0.65rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--rule);
  white-space: nowrap;
}
th:first-child, td:first-child { padding-left: 0; }
th:last-child, td:last-child { padding-right: 0; }
thead th {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--muted);
  border-bottom-color: var(--rule-strong);
}
thead th button { all: unset; display: inline-flex; align-items: center; gap: 0.35em; cursor: pointer; }
thead th button:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
thead th button::after { content: "↕"; font-size: 0.95em; color: var(--faint); }
thead th[aria-sort] { color: var(--ink); }
thead th[aria-sort="ascending"] button::after { content: "↑"; color: var(--ink); }
thead th[aria-sort="descending"] button::after { content: "↓"; color: var(--ink); }
tbody tr:hover { background: color-mix(in srgb, var(--surface) 70%, transparent); }
tfoot th, tfoot td {
  border-bottom: 0;
  border-top: 1px solid var(--rule-strong);
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--ink);
}
.num { text-align: right; font-variant-numeric: tabular-nums; }

/* ---------- Code ---------- */
pre {
  margin: 1.5rem 0;
  padding: 1.1rem 1.25rem;
  background: var(--surface);
  border-radius: 4px;
  overflow-x: auto;
  line-height: 1.6;
  tab-size: 2;
}
pre code { padding: 0; background: none; font-size: 0.78rem; }

.code-tabs { margin: 1.5rem 0; background: var(--surface); border-radius: 4px; }
.code-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.3rem 0.6rem 0 0.75rem;
  border-bottom: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
}
[role="tablist"] { display: flex; gap: 0.25rem; overflow-x: auto; }
[role="tab"] {
  appearance: none;
  background: none;
  border: 0;
  border-bottom: 2px solid transparent;
  padding: 0.5rem 0.5rem 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  color: var(--faint);
  cursor: pointer;
  white-space: nowrap;
}
[role="tab"]:hover { color: var(--muted); }
[role="tab"][aria-selected="true"] { color: var(--ink); border-bottom-color: var(--ink); }
.code-tabs pre { margin: 0; background: none; border-radius: 0; }

/* Greyscale syntax colours (Prism) */
.token.comment, .token.prolog, .token.doctype, .token.cdata { color: var(--faint); font-style: italic; }
.token.punctuation, .token.operator { color: var(--muted); }
.token.tag, .token.keyword, .token.selector, .token.atrule, .token.important { color: var(--ink); font-weight: 500; }
.token.tag .token.punctuation { font-weight: 400; color: var(--muted); }
.token.attr-name, .token.property, .token.function, .token.class-name { color: var(--ink); }
.token.string, .token.attr-value, .token.url, .token.number, .token.boolean { color: var(--muted); }
.token.attr-value .token.punctuation { color: var(--muted); }

/* ---------- Disclosure ---------- */
.faq { margin: 1.5rem 0; border-top: 1px solid var(--rule); }
details { border-bottom: 1px solid var(--rule); }
summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding: 1rem 0;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.02rem;
  color: var(--ink);
  cursor: pointer;
}
summary::-webkit-details-marker { display: none; }
summary::after { content: "+"; font-family: var(--font-mono); color: var(--faint); transition: transform 0.2s; }
details[open] > summary::after { transform: rotate(45deg); }
details > p { margin: 0 0 1.1rem; color: var(--muted); }

/* ---------- Forms ---------- */
.form { display: grid; gap: 2rem; margin-top: 1.5rem; }
fieldset { display: grid; gap: 1.1rem; min-width: 0; margin: 0; padding: 0; border: 0; }
legend {
  padding: 0 0 1rem;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}
fieldset fieldset legend {
  padding: 0 0 0.5rem;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--ink);
}
.field { display: grid; gap: 0.4rem; align-content: start; }
.field-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: 1.1rem; }
.label-row { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
label, .label { font-family: var(--font-display); font-size: 0.85rem; color: var(--ink); }

input[type="text"], input[type="email"], input[type="search"], input[type="number"],
input[type="date"], select, textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  font: inherit;
  font-size: 0.95rem;
  color: var(--ink);
  background: color-mix(in srgb, var(--surface) 45%, var(--bg));
  border: 1px solid var(--rule-strong);
  border-radius: 3px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
input[type="text"]:focus, input[type="email"]:focus, input[type="search"]:focus, input[type="number"]:focus,
input[type="date"]:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--ink);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ink) 12%, transparent);
}
input:user-invalid, textarea:user-invalid { border-color: var(--danger); }
::placeholder { color: var(--faint); opacity: 1; }
textarea { min-height: 7rem; resize: vertical; line-height: 1.55; }

.select { position: relative; }
.select select { appearance: none; padding-right: 2.2rem; cursor: pointer; }
.select::after {
  content: "";
  position: absolute;
  right: 0.9rem;
  top: 50%;
  width: 0.42rem;
  height: 0.42rem;
  border-right: 1.5px solid var(--muted);
  border-bottom: 1.5px solid var(--muted);
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}

.choices { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; }
.choice {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text);
  cursor: pointer;
}
input[type="checkbox"], input[type="radio"] {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: var(--ink);
  flex: none;
}

.switch {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text);
  cursor: pointer;
}
.switch input[type="checkbox"] {
  appearance: none;
  position: relative;
  width: 2.2rem;
  height: 1.25rem;
  border-radius: 999px;
  background: var(--rule-strong);
  cursor: pointer;
  transition: background 0.2s;
}
.switch input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(1.25rem - 4px);
  height: calc(1.25rem - 4px);
  border-radius: 50%;
  background: var(--bg);
  transition: transform 0.2s;
}
.switch input[type="checkbox"]:checked { background: var(--ink); }
.switch input[type="checkbox"]:checked::before { transform: translateX(0.95rem); }

.file { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; }
.file input:focus-visible + label { outline: 2px solid var(--ink); outline-offset: 3px; }

.form-status { margin: 0; flex: 1 1 14rem; font-size: 0.88rem; font-style: italic; color: var(--muted); }

/* Field errors */
.field-error {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-family: var(--font-display);
  font-size: 0.78rem;
  color: var(--danger);
}
.field-error .icon { width: 0.9rem; height: 0.9rem; stroke-width: 2; }
input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"] {
  border-color: var(--danger) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--danger) 14%, transparent) !important;
}
input[type="checkbox"][aria-invalid="true"] { outline: 2px solid var(--danger); outline-offset: 2px; box-shadow: none !important; }
.form-status.is-error { color: var(--danger); }

input[type="range"] {
  appearance: none;
  width: 100%;
  height: 1.2rem;
  margin: 0;
  background: transparent;
  cursor: pointer;
}
input[type="range"]::-webkit-slider-runnable-track { height: 2px; background: var(--rule-strong); border-radius: 2px; }
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  margin-top: -6px;
  border-radius: 50%;
  background: var(--ink);
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 1px var(--ink);
}
input[type="range"]::-moz-range-track { height: 2px; background: var(--rule-strong); }
input[type="range"]::-moz-range-progress { height: 2px; background: var(--ink); }
input[type="range"]::-moz-range-thumb {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--ink);
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 1px var(--ink);
}
input[type="range"]:focus-visible { outline: none; }
input[type="range"]:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px var(--ink), 0 0 0 5px color-mix(in srgb, var(--ink) 18%, transparent);
}
input[type="range"]:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 1px var(--ink), 0 0 0 5px color-mix(in srgb, var(--ink) 18%, transparent);
}

output { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); font-variant-numeric: tabular-nums; }

/* ---------- Buttons ---------- */
.btn-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; }
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.1rem;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 0.86rem;
  line-height: 1;
  text-decoration: none;
  border: 1px solid var(--ink);
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.btn-primary { background: var(--ink); color: var(--bg); }
.btn-primary:hover { background: color-mix(in srgb, var(--ink) 84%, var(--bg)); }
.btn-secondary { background: transparent; color: var(--ink); border-color: var(--rule-strong); }
.btn-secondary:hover { border-color: var(--ink); }
.btn-text {
  padding-inline: 0.2rem;
  background: none;
  border-color: transparent;
  color: var(--muted);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.btn-text:hover { color: var(--ink); }
.btn-sm { padding: 0.5rem 0.8rem; font-size: 0.76rem; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-danger { color: var(--bg); background: var(--danger); border-color: var(--danger); }
.btn-danger:hover { background: color-mix(in srgb, var(--danger) 85%, var(--ink)); }
.btn-danger-outline { color: var(--danger); background: transparent; border-color: color-mix(in srgb, var(--danger) 45%, var(--bg)); }
.btn-danger-outline:hover { border-color: var(--danger); background: color-mix(in srgb, var(--danger) 8%, transparent); }

/* ---------- Feedback ---------- */
.gauges { display: grid; gap: 1.1rem; margin: 1.25rem 0; }
.gauge { display: grid; gap: 0.45rem; }
.gauge .top { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; }
.gauge .val { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); font-variant-numeric: tabular-nums; }

progress {
  appearance: none;
  width: 100%;
  height: 4px;
  border: 0;
  border-radius: 2px;
  background: var(--rule);
  color: var(--ink);
  overflow: hidden;
}
progress::-webkit-progress-bar { background: var(--rule); border-radius: 2px; }
progress::-webkit-progress-value { background: var(--ink); border-radius: 2px; }
progress::-moz-progress-bar { background: var(--ink); border-radius: 2px; }
progress:indeterminate {
  background: var(--rule) linear-gradient(90deg, transparent, var(--ink), transparent) no-repeat;
  background-size: 35% 100%;
  animation: slide 1.4s ease-in-out infinite;
}
progress:indeterminate::-webkit-progress-bar { background: transparent; }
progress:indeterminate::-moz-progress-bar { background: transparent; }
@keyframes slide { from { background-position: -50% 0; } to { background-position: 150% 0; } }

meter { width: 100%; height: 6px; border-radius: 3px; }
meter::-webkit-meter-bar { height: 6px; background: var(--rule); border: 0; border-radius: 3px; }
meter::-webkit-meter-optimum-value { background: var(--ink); border-radius: 3px; }
meter::-webkit-meter-suboptimum-value { background: var(--warning); border-radius: 3px; }
meter::-webkit-meter-even-less-good-value {
  background: repeating-linear-gradient(135deg, var(--danger) 0 3px, transparent 3px 6px);
  border-radius: 3px;
}
meter::-moz-meter-bar { background: var(--ink); border-radius: 3px; }
meter:-moz-meter-sub-optimum::-moz-meter-bar { background: var(--warning); }
meter:-moz-meter-sub-sub-optimum::-moz-meter-bar {
  background: repeating-linear-gradient(135deg, var(--danger) 0 3px, transparent 3px 6px);
}

.chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.25rem 0; }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.28rem 0.7rem;
  font-family: var(--font-display);
  font-size: 0.75rem;
  color: var(--muted);
  border: 1px solid var(--rule-strong);
  border-radius: 999px;
}
.chip::before { content: ""; width: 0.5rem; height: 0.5rem; border: 1px solid currentColor; border-radius: 50%; }
.chip.is-review::before { background: linear-gradient(90deg, currentColor 50%, transparent 50%); }
.chip.is-live { color: var(--bg); background: var(--ink); border-color: var(--ink); }
.chip.is-live::before { background: currentColor; }
.chip.is-archived { color: var(--faint); border-style: dashed; }
.chip.is-archived::before { border-style: dashed; }

/* Signal chips and inline signals */
.sig {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 0.8rem;
  white-space: nowrap;
}
.sig .icon { width: 0.95rem; height: 0.95rem; stroke-width: 2; }
.sig.is-success { color: var(--success); }
.sig.is-danger { color: var(--danger); }
.sig.is-warning { color: var(--warning); }

.chip .icon { width: 0.85rem; height: 0.85rem; stroke-width: 2; }
.chip.is-pass::before, .chip.is-fail::before, .chip.is-flaky::before { display: none; }
.chip.is-pass { color: var(--success); border-color: color-mix(in srgb, var(--success) 40%, var(--bg)); background: color-mix(in srgb, var(--success) 8%, var(--bg)); }
.chip.is-fail { color: var(--danger); border-color: color-mix(in srgb, var(--danger) 40%, var(--bg)); background: color-mix(in srgb, var(--danger) 8%, var(--bg)); }
.chip.is-flaky { color: var(--warning); border-color: color-mix(in srgb, var(--warning) 40%, var(--bg)); background: color-mix(in srgb, var(--warning) 8%, var(--bg)); }
.chip.sm { padding: 0.1rem 0.5rem; font-size: 0.66rem; }
.chip.sm::before { width: 0.4rem; height: 0.4rem; }

dialog {
  width: min(28rem, calc(100vw - 2rem));
  padding: 0;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--rule);
  border-radius: 6px;
  box-shadow: 0 24px 60px -24px rgba(0, 0, 0, 0.4);
}
dialog::backdrop { background: rgba(20, 20, 20, 0.35); backdrop-filter: blur(2px); }
dialog form { padding: 1.75rem; }
dialog h3 { margin: 0 0 0.6rem; font-size: 1.25rem; }
dialog p { color: var(--muted); }
dialog .btn-row { justify-content: flex-end; margin-top: 1.5rem; }

.toast {
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  z-index: 60;
  padding: 0.65rem 1.1rem;
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--bg);
  background: var(--ink);
  border-radius: 999px;
  opacity: 0;
  transform: translate(-50%, 0.75rem);
  transition: opacity 0.2s, transform 0.2s;
  pointer-events: none;
}
.toast.show { opacity: 1; transform: translate(-50%, 0); }

/* ---------- Media ---------- */
figure { margin: 1.5rem 0; }
img, svg, canvas { max-width: 100%; }
img { display: block; height: auto; border-radius: 2px; }
figcaption {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-top: 0.6rem;
  font-size: 0.82rem;
  font-style: italic;
  color: var(--faint);
}
figcaption .btn-text { font-style: normal; font-size: 0.76rem; padding: 0; flex: none; }
.figure-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; }
.figure-row figure { margin: 0; }
.figure-row svg { display: block; width: 100%; height: auto; border-radius: 3px; }
.ph-bg { fill: var(--surface); }
.ph-line { stroke: var(--rule-strong); stroke-width: 1; }
.ph-text { fill: var(--faint); font-family: var(--font-mono); font-size: 14px; }

/* ---------- Notes ---------- */
.callouts { display: grid; gap: 0.75rem; margin: 1.5rem 0; }
.callout {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--surface);
  border-radius: 4px;
}
.callout p { margin: 0; }
.callout-label {
  padding-top: 0.2rem;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.callout.is-warning { background: color-mix(in srgb, var(--warning) 9%, var(--bg)); box-shadow: inset 3px 0 0 var(--warning); }
.callout.is-warning .callout-label { color: var(--warning); }

.fn-ref a { padding: 0 0.15em; font-family: var(--font-mono); font-size: 0.95em; color: var(--muted); text-decoration: none; }
.footnotes { font-size: 0.88rem; color: var(--muted); }
.footnotes ol { padding-left: 1.4em; }
.footnotes li { padding: 0.1rem 0.3rem; border-radius: 3px; }
.footnotes li:target { background: color-mix(in srgb, var(--ink) 10%, transparent); }
.footnotes .back { margin-left: 0.3rem; text-decoration: none; }

hr { height: 1px; margin: 2.5rem 0 1.5rem; border: 0; background: var(--rule); }

/* ---------- Widths ---------- */
@media (min-width: 760px) {
  .wide { width: max(100%, min(var(--wide), calc(var(--vw) / 2 + 18rem - 2.5rem))); }
}
.full { width: var(--vw); margin-left: calc(50% - var(--vw) / 2); }

/* ---------- Icons ---------- */
.sprite { position: absolute; width: 0; height: 0; overflow: hidden; }
.icon {
  width: 1.1em;
  height: 1.1em;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  vertical-align: -0.18em;
}
.icon.ext { width: 0.85em; height: 0.85em; margin-left: 0.15em; }
.btn .icon { width: 1rem; height: 1rem; }
.icon-btn {
  appearance: none;
  display: inline-grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  color: var(--ink);
  background: none;
  border: 1px solid var(--rule-strong);
  border-radius: 3px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.icon-btn:hover { border-color: var(--ink); }
.icon-btn .icon { width: 1rem; height: 1rem; }
.icon-btn.ghost { width: 1.75rem; height: 1.75rem; border-color: transparent; color: var(--muted); }
.icon-btn.ghost:hover { color: var(--ink); border-color: var(--rule-strong); }

/* ---------- Steps ---------- */
.steps { list-style: none; margin: 1.25rem 0; padding: 0; counter-reset: step; }
.steps li {
  position: relative;
  display: grid;
  grid-template-columns: 2.25rem 1fr;
  column-gap: 0.9rem;
  margin: 0;
  padding: 0 0 1.2rem;
  counter-increment: step;
}
.steps li::before {
  content: counter(step, decimal-leading-zero);
  grid-row: span 2;
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ink);
  background: var(--bg);
  border: 1px solid var(--rule-strong);
  border-radius: 50%;
}
.steps li:not(:last-child)::after {
  content: "";
  position: absolute;
  left: calc(1.125rem - 0.5px);
  top: 2.25rem;
  bottom: 0;
  width: 1px;
  background: var(--rule);
}
.step-title { padding-top: 0.3rem; font-family: var(--font-display); font-weight: 600; color: var(--ink); }
.step-body { font-size: 0.95rem; color: var(--muted); }

/* ---------- Comparison table ---------- */
.compare tbody th { font-family: var(--font-body); font-weight: 400; color: var(--text); }
.compare .c { text-align: center; }
.compare .icon { width: 1.1em; height: 1.1em; color: var(--ink); stroke-width: 1.75; }
.compare .no { color: var(--faint); }
.compare .note { font-size: 0.85rem; font-style: italic; color: var(--muted); }

/* ---------- Code diff ---------- */
.diff { margin: 1.5rem 0; overflow: hidden; border: 1px solid var(--rule); border-radius: 4px; }
.diff-head {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.9rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--muted);
  background: var(--surface);
  border-bottom: 1px solid var(--rule);
}
.diff pre { margin: 0; padding: 0.6rem 0; background: var(--bg); border-radius: 0; }
.diff .dl { display: block; padding: 0 1rem; }
.diff .add { color: var(--success); background: color-mix(in srgb, var(--success) 10%, transparent); }
.diff .del { color: var(--danger); background: color-mix(in srgb, var(--danger) 10%, transparent); }
.add-n { color: var(--success); }
.del-n { color: var(--danger); }

/* ---------- Alerts ---------- */
.alerts { display: grid; gap: 0.6rem; margin: 1.25rem 0 0.75rem; }
.alert {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 0.75rem;
  padding: 0.85rem 0.9rem 0.85rem 1rem;
  background: var(--surface);
  border-radius: 4px;
  box-shadow: inset 3px 0 0 var(--ink);
}
.alert > .icon { width: 1.1rem; height: 1.1rem; margin-top: 0.22rem; color: var(--ink); }
.alert p { margin: 0; font-size: 0.92rem; }
.alert-title { font-family: var(--font-display); font-weight: 600; color: var(--ink); }
.alert.is-success { background: color-mix(in srgb, var(--success) 9%, var(--bg)); box-shadow: inset 3px 0 0 var(--success); }
.alert.is-warning { background: color-mix(in srgb, var(--warning) 9%, var(--bg)); box-shadow: inset 3px 0 0 var(--warning); }
.alert.is-danger { background: color-mix(in srgb, var(--danger) 9%, var(--bg)); box-shadow: inset 3px 0 0 var(--danger); }
.alert.is-success > .icon, .alert.is-success .alert-title { color: var(--success); }
.alert.is-warning > .icon, .alert.is-warning .alert-title { color: var(--warning); }
.alert.is-danger > .icon, .alert.is-danger .alert-title { color: var(--danger); }

/* ---------- Footer ---------- */
.site-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--rule);
  font-size: 0.85rem;
  color: var(--faint);
}
.site-footer p { margin: 0; }

/* ---------- Wide layout ---------- */
/* `layout: wide` in the front matter: a left-aligned work surface for apps, dashboards and trackers,
   instead of the centred reading column. Denser type, a one-row masthead and quieter section heads.
   Prose inside still keeps to the measure. */
:root[data-layout="wide"] { font-size: 16px; }
[data-layout="wide"] .layout {
  display: flex;
  flex-direction: column;
  max-width: 120rem;
  min-height: 100dvh;
  margin: 0 auto;
  padding: 1.5rem clamp(1rem, 2.5vw, 2.5rem);
}
[data-layout="wide"] .masthead {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.35rem 2rem;
  margin: 0 0 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--rule);
}
[data-layout="wide"] .masthead h1 { font-size: 1.9rem; }
[data-layout="wide"] .meta-row { grid-column: 2; grid-row: 1; margin: 0; }
[data-layout="wide"] .lede { grid-column: 1 / -1; max-width: 64rem; font-size: 1rem; }
[data-layout="wide"] .rail { position: static; align-self: stretch; width: auto; max-height: none; margin: 0 0 1.5rem; }
[data-layout="wide"] .toc { padding: 0.9rem 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
[data-layout="wide"] .toc ol { columns: 3; }
[data-layout="wide"] main { flex: 1 0 auto; gap: 2rem; }
[data-layout="wide"] .section + .section { padding-top: 0; border-top: 0; }
[data-layout="wide"] .section { display: grid; grid-template-columns: auto minmax(0, 1fr); align-content: start; column-gap: 1.25rem; }
[data-layout="wide"] .section > * { grid-column: 1 / -1; }
[data-layout="wide"] .section > h2 { grid-column: 1; margin-bottom: 0.7rem; font-size: 1.25rem; }
[data-layout="wide"] .section > .section-note { grid-column: 2; align-self: baseline; margin: 0; font-size: 0.9rem; }
[data-layout="wide"] .section > :is(h2, .section-note) + * { margin-top: 0; }
[data-layout="wide"] .section > :last-child { margin-bottom: 0; }
[data-layout="wide"] .section > :is(p, ul, ol, blockquote, dl):not(.section-note) { max-width: var(--measure); }
[data-layout="wide"] .wide { width: 100%; }
[data-layout="wide"] .full { width: auto; margin-left: 0; }
[data-layout="wide"] .band-inner { padding: 0 1.25rem; }

/* A fill section takes the rest of the window, and its block (usually an app shell) stretches to fit */
[data-layout="wide"] .section.fill { flex: 1 0 26rem; min-height: 0; grid-template-rows: auto minmax(0, 1fr); }
[data-layout="wide"] .section.fill > .shell { height: auto; min-height: 0; margin: 0; }

@media (max-width: 760px) {
  [data-layout="wide"] .layout { min-height: 0; }
  [data-layout="wide"] .section.fill { flex: none; }
  [data-layout="wide"] .section.fill > .shell { height: 40rem; }
  [data-layout="wide"] .section > .section-note { grid-column: 1 / -1; margin-bottom: 0.8rem; }
  [data-layout="wide"] .toc ol { columns: 2; }
}
@media (max-width: 600px) {
  [data-layout="wide"] .masthead { grid-template-columns: minmax(0, 1fr); }
  [data-layout="wide"] .meta-row { grid-column: 1; grid-row: auto; }
  [data-layout="wide"] .masthead h1 { font-size: 1.6rem; }
}
@media print {
  :root[data-layout="wide"] { font-size: 11pt; }
  [data-layout="wide"] .layout { display: block; min-height: 0; max-width: none; padding: 0; }
}

/* ---------- Small screens & motion ---------- */
@media (max-width: 600px) {
  html { font-size: 16px; }
  .layout { padding: 2rem 1.25rem 4rem; }
  h1, .h1 { font-size: 2.2rem; }
  h2, .h2 { font-size: 1.7rem; }
  h3, .h3 { font-size: 1.3rem; }
  .specimen { grid-template-columns: 1fr; gap: 0.15rem; }
  .figure-row { grid-template-columns: 1fr; }
  .callout { grid-template-columns: 1fr; gap: 0.3rem; }
}

/* ---------- Print ---------- */
@media print {
  @page { margin: 18mm; }
  :root, :root:not([data-theme="light"]), :root[data-theme="dark"] {
    --bg: #ffffff;
    --surface: #f1f1f1;
    --ink: #000000;
    --muted: #444444;
    --faint: #767676;
    --rule: #d0d0d0;
    --danger: #a33a2f;
    --warning: #8a5d0f;
    --success: #2f6f45;
    --cat-1: #2e69b2;
    --cat-2: #c96b7e;
    --cat-3: #ac8924;
    --cat-4: #009390;
    --cat-5: #c35f36;
    --cat-6: #7766b4;
    --cat-7: #67863a;
    --cat-8: #884783;
    color-scheme: light;
  }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html { font-size: 11pt; scroll-behavior: auto; }
  .layout { display: block; padding: 0; }
  .rail, .progress-line, .toast, .anchor, .theme-toggle, .btn, .btn-row, .icon-btn, .search, .segmented, .pager,
  .wizard-actions, .table-tools .hint, figcaption .btn-text { display: none !important; }
  .wide, .full { width: auto !important; margin-left: 0 !important; }
  .band-inner { padding-left: 0 !important; overflow: visible; }
  .table-scroll { max-height: none; overflow: visible; }
  .shell { height: auto; }
  main { gap: 1.5rem; }
  .section + .section { padding-top: 1.5rem; }
  .masthead { margin-bottom: 1.5rem; }
  a { color: var(--ink); }
  a:hover { color: var(--ink); background: none; }
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.8em; color: var(--muted); }
  h2, h3 { break-after: avoid; }
  figure, table, pre, blockquote, .callout, .alert, .stats, .split, .shell, .diff, .wizard, .band, .cal-wrap { break-inside: avoid; }
  .sidenote { float: none; width: auto; margin: 0.5rem 0 0.8rem 1rem; padding-left: 0.8rem; border-left: 1px solid var(--rule); }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition: none !important; animation: none !important; }
}
```


---

## assets/css/longform.css

```css
/* ==========================================================
   Module: Long-form (pull quote, sidenotes, timeline)
   ========================================================== */

.pullquote {
  margin: 2.5rem 0;
  padding: 1.25rem 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.7rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--ink);
  text-wrap: balance;
}

/* ---------- Sidenotes ---------- */
.sn-ref {
  padding: 0 0.1em;
  font-family: var(--font-mono);
  font-size: 0.68em;
  line-height: 0;
  vertical-align: super;
  color: var(--muted);
}
.sidenote {
  display: block;
  margin: 0.6rem 0 0.8rem 1rem;
  padding-left: 0.8rem;
  border-left: 1px solid var(--rule-strong);
  font-size: 0.82rem;
  font-style: italic;
  line-height: 1.5;
  color: var(--muted);
}
.sn-num { margin-right: 0.3rem; font-family: var(--font-mono); font-size: 0.7rem; font-style: normal; color: var(--ink); }
@media (min-width: 1200px) {
  .sidenote {
    --sn-w: min(13rem, calc((var(--vw) - 36rem) / 2 - 4rem));
    float: right;
    clear: right;
    width: var(--sn-w);
    margin: 0.25rem calc(-1 * (var(--sn-w) + 2.5rem)) 0 0;
    padding-left: 0;
    border-left: 0;
  }
}

/* ---------- Timeline ---------- */
.timeline { list-style: none; margin: 1.25rem 0; padding: 0; }
.timeline li { display: grid; grid-template-columns: 6rem 1fr; gap: 1.25rem; margin: 0; padding: 0; }
.timeline time {
  padding-top: 0.28rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--faint);
  text-align: right;
}
.timeline li > div { position: relative; padding: 0 0 1.4rem 1.25rem; border-left: 1px solid var(--rule); }
.timeline li:last-child > div { padding-bottom: 0.2rem; }
.timeline li > div::before {
  content: "";
  position: absolute;
  left: -4.5px;
  top: 0.55rem;
  width: 8px;
  height: 8px;
  background: var(--bg);
  border: 1px solid var(--ink);
  border-radius: 50%;
}
.timeline li:first-child > div::before { background: var(--ink); }
.tl-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--ink);
}
.tl-body { margin: 0.2rem 0 0; font-size: 0.95rem; color: var(--muted); }

@media (max-width: 600px) {
  .pullquote { font-size: 1.4rem; }
  .timeline li { grid-template-columns: 1fr; gap: 0.15rem; }
  .timeline time { padding: 0 0 0 1.25rem; text-align: left; }
}
```


---

## assets/css/tools.css

```css
/* ==========================================================
   Module: Tools (split view, app shell, navigation, search, cards, loading)
   ========================================================== */

/* ---------- Split view ---------- */
.split {
  display: grid;
  grid-template-columns: minmax(0, 15rem) minmax(0, 1fr);
  margin: 1.25rem 0;
  border: 1px solid var(--rule);
  border-radius: 4px;
}
.split-controls { display: grid; align-content: start; gap: 1.1rem; padding: 1.25rem; border-right: 1px solid var(--rule); }
.split-output { padding: 1.25rem 1.5rem; min-width: 0; }
.colour-field { display: flex; gap: 0.5rem; }
.colour-field input[type="text"] { font-family: var(--font-mono); font-size: 0.82rem; }
input[type="color"] {
  flex: none;
  width: 2.6rem;
  padding: 0;
  background: none;
  border: 1px solid var(--rule-strong);
  border-radius: 3px;
  cursor: pointer;
}
input[type="color"]::-webkit-color-swatch-wrapper { padding: 3px; }
input[type="color"]::-webkit-color-swatch { border: 0; border-radius: 2px; }
input[type="color"]::-moz-color-swatch { border: 0; border-radius: 2px; }

/* ---------- App shell ---------- */
.shell {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 25rem;
  margin: 1.25rem 0 0;
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--rule-strong);
  border-radius: 6px;
}
.shell-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.55rem 0.9rem;
  border-bottom: 1px solid var(--rule);
}
.shell-body { display: grid; grid-template-columns: 11rem 1fr; min-height: 0; }
.shell-side {
  padding: 0.9rem 0.7rem;
  overflow-y: auto;
  background: color-mix(in srgb, var(--surface) 50%, var(--bg));
  border-right: 1px solid var(--rule);
}
.shell-main { min-width: 0; padding: 0.9rem; overflow: auto; }
.side-nav { list-style: none; display: grid; gap: 2px; margin: 0.55rem 0 0; padding: 0; }
.side-nav li { margin: 0; padding: 0; }
.side-nav button {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.4rem 0.5rem;
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--muted);
  text-align: left;
  background: none;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
}
.side-nav button:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 5%, transparent); }
.side-nav button[aria-pressed="true"] { color: var(--ink); background: var(--surface); }
.side-nav .count { margin-left: auto; font-family: var(--font-mono); font-size: 0.66rem; color: var(--faint); }
.board { display: grid; grid-template-columns: repeat(3, minmax(10.5rem, 1fr)); gap: 0.75rem; min-width: 33rem; }
.board-col { display: grid; align-content: start; gap: 0.5rem; }
.board-head {
  display: flex;
  justify-content: space-between;
  margin: 0 0 0.15rem;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}
.board-head span:last-child { font-family: var(--font-mono); font-weight: 400; letter-spacing: 0; color: var(--faint); }
.task { display: grid; gap: 0.5rem; padding: 0.6rem 0.7rem; background: var(--bg); border: 1px solid var(--rule); border-radius: 4px; }
.task-title { margin: 0; font-size: 0.85rem; line-height: 1.35; color: var(--ink); }
.task-meta { display: flex; align-items: center; gap: 0.6rem; margin: 0; font-family: var(--font-mono); font-size: 0.64rem; color: var(--faint); }
.task-meta .due { display: inline-flex; align-items: center; gap: 0.25rem; }
.task-meta .avatar { margin-left: auto; }
.task.is-done .task-title { color: var(--faint); text-decoration: line-through; }

.avatar {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 1.5rem;
  height: 1.5rem;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.62rem;
  color: var(--bg);
  background: var(--ink);
  border-radius: 50%;
}
.avatar.is-alt { color: var(--ink); background: var(--shade-2); }
.avatar-group { display: flex; }
.avatar-group .avatar { margin-left: -0.35rem; box-shadow: 0 0 0 2px var(--bg); }
.avatar-group .avatar:first-child { margin-left: 0; }

/* ---------- Navigation ---------- */
.segmented {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--rule-strong);
  border-radius: 4px;
}
.segmented button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  font-family: var(--font-display);
  font-size: 0.76rem;
  color: var(--muted);
  background: none;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
}
.segmented button:hover { color: var(--ink); }
.segmented button[aria-pressed="true"] { color: var(--bg); background: var(--ink); }
.segmented .icon { width: 0.95rem; height: 0.95rem; }
.seg-readout { margin: 0.6rem 0 0; }

.crumbs ol {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  font-family: var(--font-display);
  font-size: 0.8rem;
}
.crumbs li { display: flex; align-items: center; gap: 0.35rem; margin: 0; padding: 0; color: var(--muted); }
.crumbs li + li::before { content: "/"; color: var(--faint); }
.crumbs a { color: var(--muted); text-decoration: none; }
.crumbs [aria-current="page"] { color: var(--ink); }

.pager { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem; }
.pager button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--muted);
  background: none;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
}
.pager button.word { font-family: var(--font-display); font-size: 0.8rem; }
.pager button:hover:not(:disabled) { color: var(--ink); border-color: var(--rule-strong); }
.pager button[aria-current="page"] { color: var(--bg); background: var(--ink); }
.pager button:disabled { opacity: 0.35; cursor: default; }
.pager .gap { padding: 0 0.3rem; font-family: var(--font-mono); color: var(--faint); }

.wizard { margin: 1.25rem 0; padding: 1.25rem; border: 1px solid var(--rule); border-radius: 4px; }
.stepper { list-style: none; display: flex; gap: 0.5rem; margin: 0 0 1.4rem; padding: 0; }
.stepper li {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0;
  padding: 0.5rem 0 0;
  font-family: var(--font-display);
  font-size: 0.82rem;
  color: var(--faint);
  border-top: 2px solid var(--rule);
}
.stepper .n { font-family: var(--font-mono); font-size: 0.68rem; }
.stepper li.is-done { color: var(--muted); border-top-color: var(--ink); }
.stepper li[aria-current="step"] { color: var(--ink); border-top-color: var(--ink); }
.wizard-panel { display: grid; gap: 1.1rem; }
.wizard-actions { justify-content: space-between; margin-top: 1.4rem; }
.choice-hint { display: block; font-size: 0.82rem; color: var(--faint); font-style: italic; }
.radio-cards { display: grid; gap: 0.5rem; }
.radio-cards .choice { align-items: flex-start; padding: 0.6rem 0.75rem; border: 1px solid var(--rule); border-radius: 4px; }
.radio-cards .choice:has(input:checked) { border-color: var(--ink); background: var(--surface); }
.radio-cards input { margin-top: 0.3rem; }

/* ---------- Search, compact table, empty state ---------- */
.table-tools { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem 1rem; margin-top: 1.25rem; }
.search { position: relative; flex: 1 1 14rem; max-width: 20rem; }
.search .icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  width: 1rem;
  height: 1rem;
  color: var(--faint);
  transform: translateY(-50%);
  pointer-events: none;
}
.search input { padding-left: 2.2rem; }
.table-scroll {
  max-height: 19rem;
  margin: 0.9rem 0 1.5rem;
  overflow: auto;
  border-bottom: 1px solid var(--rule);
}
.table-compact { font-size: 0.85rem; }
.table-compact th, .table-compact td { padding: 0.42rem 0.6rem; }
.table-compact thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--bg);
  border-bottom: 0;
  box-shadow: inset 0 -1px 0 var(--rule-strong);
}
.table-compact .mono { font-size: 0.7rem; }

.empty { display: grid; justify-items: center; gap: 0.5rem; padding: 2.5rem 1rem; text-align: center; }
.empty-icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  color: var(--muted);
  border: 1px solid var(--rule-strong);
  border-radius: 50%;
}
.empty-icon .icon { width: 1.2rem; height: 1.2rem; }
.empty-title { margin: 0; font-family: var(--font-display); font-weight: 600; color: var(--ink); }
.empty p { margin: 0; font-size: 0.92rem; color: var(--muted); }

/* ---------- Loading placeholders ---------- */
.file-card {
  display: flex;
  align-items: center;
  min-height: 4.6rem;
  margin: 1.25rem 0 0.75rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--rule);
  border-radius: 4px;
}
.fc-real, .sk-row { display: flex; align-items: center; gap: 0.9rem; width: 100%; }
.sk-row { display: none; }
.file-card.is-loading .fc-real { display: none; }
.file-card.is-loading .sk-row { display: flex; }
.file-icon { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; color: var(--ink); background: var(--surface); border-radius: 4px; }
.file-icon .icon { width: 1.2rem; height: 1.2rem; }
.file-name { margin: 0; font-family: var(--font-display); font-weight: 500; color: var(--ink); }
.file-meta { margin: 0; font-family: var(--font-mono); font-size: 0.68rem; color: var(--faint); }
.fc-real .avatar-group { margin-left: auto; }
.sk-lines { display: grid; flex: 1; gap: 0.5rem; }
.sk {
  display: block;
  height: 0.7rem;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--surface) 0%, color-mix(in srgb, var(--ink) 11%, var(--bg)) 50%, var(--surface) 100%);
  background-size: 200% 100%;
  animation: sk 1.2s ease-in-out infinite;
}
.sk-box { width: 2.5rem; height: 2.5rem; border-radius: 4px; }
@keyframes sk { from { background-position: 100% 0; } to { background-position: -100% 0; } }

/* ---------- Selectable cards ---------- */
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr)); gap: 0.5rem; }
.card-option {
  appearance: none;
  display: grid;
  align-content: start;
  gap: 0.55rem;
  padding: 0.75rem 0.7rem 0.7rem;
  font: inherit;
  text-align: left;
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--rule);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.card-option:hover { border-color: var(--rule-strong); color: var(--ink); }
.card-option[aria-pressed="true"] { color: var(--ink); background: var(--surface); border-color: var(--ink); }
.card-specimen {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 1;
  color: var(--ink);
}
.card-names { display: grid; font-family: var(--font-display); font-size: 0.74rem; line-height: 1.35; }
.card-sub { margin-top: 0.2rem; font-family: var(--font-mono); font-size: 0.64rem; color: var(--faint); }
.cards-readout { margin: 0.7rem 0 0; }

@media (max-width: 760px) {
  .split { grid-template-columns: 1fr; }
  .split-controls { border-right: 0; border-bottom: 1px solid var(--rule); }
  .shell { height: 28rem; }
  .shell-body { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
  .shell-side { padding: 0.5rem 0.6rem; border-right: 0; border-bottom: 1px solid var(--rule); }
  .shell-side .spaced-label { display: none; }
  .side-nav { display: flex; margin: 0; overflow-x: auto; }
  .side-nav button { white-space: nowrap; }
}
@media (max-width: 600px) {
  .shell-bar { flex-wrap: wrap; }
  .cards {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: 7.75rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 0.4rem;
  }
  .card-option { scroll-snap-align: start; }
}
```


---

## assets/css/data.css

```css
/* ==========================================================
   Module: Data (stat tiles, charts, heatmap, calendar)
   ========================================================== */

/* ---------- Data ---------- */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1px;
  margin: 1.25rem 0;
  background: var(--rule);
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.stat { display: grid; align-content: start; gap: 0.3rem; padding: 1rem 1rem 0.8rem; background: var(--bg); }
.stat-value {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 2rem;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.stat-delta { margin: 0; font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); }
.stat-delta.is-good { color: var(--success); }
.stat-delta.is-bad { color: var(--danger); }
.stat-delta .vs { color: var(--faint); }
.spark { display: block; width: 100%; height: 2rem; margin-top: 0.4rem; overflow: visible; }
.spark-area { fill: color-mix(in srgb, var(--ink) 7%, transparent); }
.spark-line { fill: none; stroke: var(--ink); stroke-width: 1.5; stroke-linejoin: round; stroke-linecap: round; }
.spark-dot { fill: var(--ink); }

.chart { position: relative; }
.chart-svg { display: block; overflow: visible; }
.chart-svg .grid { stroke: var(--rule); stroke-width: 1; }
.chart-svg .axis { fill: var(--faint); font-family: var(--font-mono); font-size: 11px; }
.chart-svg .line { fill: none; stroke-width: 1.75; stroke-linejoin: round; stroke-linecap: round; }
.chart-svg .line.now { stroke: var(--ink); }
.chart-svg .line.prev { stroke: var(--muted); stroke-dasharray: 4 3; }
.chart-svg .area { fill: color-mix(in srgb, var(--ink) 6%, transparent); }
.chart-svg .end { fill: var(--ink); }
.chart-svg .end-label { fill: var(--ink); font-family: var(--font-mono); font-size: 11px; }
.chart-svg .cross { stroke: var(--rule-strong); }
.chart-svg .hdot.now { fill: var(--ink); }
.chart-svg .hdot.prev { fill: var(--bg); stroke: var(--muted); stroke-width: 1.5; }
.chart-tip {
  position: absolute;
  display: grid;
  gap: 0.1rem;
  min-width: 8.5rem;
  padding: 0.45rem 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--muted);
  background: var(--bg);
  border: 1px solid var(--rule-strong);
  border-radius: 3px;
  pointer-events: none;
}
.chart-tip strong { font-family: var(--font-display); font-weight: 600; font-size: 0.78rem; color: var(--ink); }
.legend {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  font-style: normal;
  color: var(--muted);
}
.key { display: inline-block; width: 1.25rem; border-top: 2px solid var(--ink); }
.key.prev { border-top: 2px dashed var(--muted); margin-left: 0.4rem; }

.band { margin-top: 1.25rem; margin-bottom: 1.25rem; padding: 1.5rem 0 1.25rem; background: var(--surface); }
.band-inner { padding: 0 1.25rem 0 max(1.25rem, calc(var(--vw) / 2 - 18rem)); overflow-x: auto; }
.heatmap {
  --cell: 12px;
  --gap: 3px;
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 0.5rem;
  row-gap: 0.35rem;
  width: max-content;
}
.hm-months {
  grid-column: 2;
  display: grid;
  grid-template-columns: repeat(var(--weeks, 52), var(--cell));
  column-gap: var(--gap);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: var(--faint);
  white-space: nowrap;
}
.hm-days {
  grid-row: 2;
  display: grid;
  grid-template-rows: repeat(7, var(--cell));
  row-gap: var(--gap);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  line-height: var(--cell);
  color: var(--faint);
}
.hm-grid {
  grid-row: 2;
  grid-column: 2;
  display: grid;
  grid-template-rows: repeat(7, var(--cell));
  grid-auto-flow: column;
  grid-auto-columns: var(--cell);
  gap: var(--gap);
}
.hm-cell { display: block; border-radius: 2px; background: var(--shade-1); }
.hm-cell.l1 { background: var(--shade-2); }
.hm-cell.l2 { background: var(--shade-3); }
.hm-cell.l3 { background: var(--shade-4); }
.hm-cell.l4 { background: var(--shade-5); }
.hm-cell.is-pad { visibility: hidden; }
.heat-foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  max-width: 50rem;
  margin-top: 0.9rem;
  font-size: 0.82rem;
  font-style: italic;
  color: var(--faint);
}
.heat-legend { display: inline-flex; align-items: center; gap: 3px; font-family: var(--font-mono); font-size: 0.64rem; font-style: normal; }
.heat-legend .hm-cell { width: 10px; height: 10px; }

.cal-wrap { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 1.75rem; margin: 1.25rem 0; }
.cal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; }
.cal-title { margin: 0; font-family: var(--font-display); font-weight: 600; color: var(--ink); }
.cal-nav { display: flex; gap: 0.35rem; }
.cal-nav .icon-btn { width: 2rem; height: 2rem; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-dow { padding-bottom: 0.3rem; font-family: var(--font-mono); font-size: 0.64rem; color: var(--faint); text-align: center; }
.cal-day {
  appearance: none;
  position: relative;
  aspect-ratio: 1;
  padding: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text);
  background: none;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
  font-variant-numeric: tabular-nums;
}
.cal-day:hover { background: var(--surface); }
.cal-day.is-today { box-shadow: inset 0 0 0 1px var(--ink); }
.cal-day[aria-pressed="true"] { color: var(--bg); background: var(--ink); }
.cal-day.has-event::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 16%;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  background: currentColor;
  border-radius: 50%;
}
.agenda { padding-top: 0.3rem; }
.agenda ul { list-style: none; margin: 0.6rem 0 0; padding: 0; border-top: 1px solid var(--rule); }
.agenda li { margin: 0; padding: 0.55rem 0; border-bottom: 1px solid var(--rule); font-size: 0.95rem; }
.agenda li.none { color: var(--faint); font-style: italic; }

/* Big number */
.big-number {
  margin: 0.25rem 0 1rem;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 2.6rem;
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.big-number .unit { font-family: var(--font-mono); font-weight: 400; font-size: 0.9rem; color: var(--muted); }

/* ---------- Bar rows (house chart) ---------- */
.bars { margin: 1.5rem 0; border-top: 1px solid var(--rule); }
.bar-row {
  display: grid;
  grid-template-columns: 3.5rem 1fr 4rem;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--rule);
}
.bar-row .track { position: relative; height: 2px; background: var(--rule); border-radius: 2px; }
.bar-row .track > span {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--w);
  background: var(--ink);
  border-radius: 2px;
  transition: width 0.4s ease;
}
.bar-row .track > span::after {
  content: "";
  position: absolute;
  right: -4px;
  top: 50%;
  width: 8px;
  height: 8px;
  margin-top: -4px;
  border-radius: 50%;
  background: var(--ink);
}
.bar-row .val {
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 760px) {
  .cal-wrap { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .stats { grid-template-columns: 1fr 1fr; }
}
```


---

## assets/css/diagrams.css

```css
/* ==========================================================
   Module: Diagrams (Mermaid)
   ========================================================== */

.mermaid-box {
  display: flex;
  justify-content: center;
  min-height: 8rem;
  padding: 1.25rem;
  overflow-x: auto;
  background: var(--surface);
  border-radius: 4px;
}
.mermaid-box svg { max-width: 100%; height: auto; }
.mermaid-box pre { margin: 0; padding: 0; background: none; }
```


---

## assets/icons.svg

```html
<svg class="sprite" id="sprite" aria-hidden="true" focusable="false">
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></symbol>
  <symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 4.5l8.5 15h-17z"/><path d="M12 10.5v4"/><path d="M12 17.25v.01"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><path d="M12 7.75v.01"/></symbol>
  <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-arrow-up-right" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></symbol>
  <symbol id="i-chevron-left" viewBox="0 0 24 24"><path d="M14.5 6l-6 6 6 6"/></symbol>
  <symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="M9.5 6l6 6-6 6"/></symbol>
  <symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="M6 9.5l6 6 6-6"/></symbol>
  <symbol id="i-copy" viewBox="0 0 24 24"><rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/><path d="M5 15.5V6.5A1.5 1.5 0 0 1 6.5 5h9"/></symbol>
  <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/></symbol>
  <symbol id="i-download" viewBox="0 0 24 24"><path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/></symbol>
  <symbol id="i-trash" viewBox="0 0 24 24"><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/></symbol>
  <symbol id="i-file" viewBox="0 0 24 24"><path d="M6.5 3.5h7l4 4v13h-11z"/><path d="M13.5 3.5v4h4"/></symbol>
  <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="14.5" rx="1.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>
  <symbol id="i-inbox" viewBox="0 0 24 24"><path d="M4 13.5l2.5-8h11l2.5 8v6H4z"/><path d="M4 13.5h5l1 2h4l1-2h5"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.8 3.6-5.5 7-5.5s6.2 1.7 7 5.5"/></symbol>
  <symbol id="i-sliders" viewBox="0 0 24 24"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></symbol>
  <symbol id="i-board" viewBox="0 0 24 24"><rect x="4" y="4.5" width="16" height="15" rx="1.5"/><path d="M9.5 4.5v15M14.5 4.5v15"/></symbol>
  <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 7h11M9 12h11M9 17h11"/><path d="M4.75 7h.01M4.75 12h.01M4.75 17h.01"/></symbol>
  <symbol id="i-swap" viewBox="0 0 24 24"><path d="M7 4.5l-3 3 3 3M4 7.5h13M17 13.5l3 3-3 3M20 16.5H7"/></symbol>
  <symbol id="i-contrast" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.75"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6L18 18M6 18l1.4-1.4M16.6 7.4L18 6"/></symbol>
  <symbol id="i-moon" viewBox="0 0 24 24"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/></symbol>
</svg>
```


---

## assets/skeleton.html

```html
<!DOCTYPE html>
<html lang="@@LANG@@"@@HTML_ATTRS@@>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>@@TITLE@@</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
@@CSS@@
</style>
</head>
<body>
@@SPRITE@@
@@PROGRESS@@
<div class="layout">

@@MASTHEAD@@

@@RAIL@@

<main>
@@MAIN@@
</main>

@@FOOTER@@

</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
@@PRISM@@
<script>
(() => {
@@JS@@
})();
</script>
</body>
</html>
```


---

## assets/js/core.js

```js
/* Helpers and toast */
const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const redrawers = [];       // called again on resize and on theme change
const themeListeners = [];  // called again on theme change only

const toastEl = $('#toast');
let toastTimer;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}
// Any button with data-toast="…" shows that message when pressed
$$('[data-toast]').forEach(b => b.addEventListener('click', () => toast(b.dataset.toast)));

/* Theme toggle */
const themeButtons = $$('[data-theme-choice]');
let hostTheme = root.getAttribute('data-theme');
let themeMode = 'auto';
let themeSetByPage = hostTheme;
try {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') themeMode = saved;
} catch (e) {}
function applyTheme() {
  const want = themeMode === 'auto' ? hostTheme : themeMode;
  themeSetByPage = want || null;
  if (want) root.setAttribute('data-theme', want);
  else root.removeAttribute('data-theme');
  themeButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === themeMode)));
}
themeButtons.forEach(b => b.addEventListener('click', () => {
  themeMode = b.dataset.themeChoice;
  try { localStorage.setItem('theme', themeMode); } catch (e) {}
  applyTheme();
}));
new MutationObserver(() => {
  const current = root.getAttribute('data-theme');
  if (current === themeSetByPage) return;   // our own change
  hostTheme = current;                       // the host changed its theme
  if (themeMode === 'auto') themeSetByPage = current;
  else applyTheme();
}).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
applyTheme();

/* Scrollbar width */
const setScrollbar = () => root.style.setProperty('--sbw', `${Math.max(0, innerWidth - root.clientWidth)}px`);
setScrollbar();

/* Reading progress line */
const line = $('.progress-line');
if (line) {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = root.scrollHeight - innerHeight;
      line.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Contents highlight and section anchors */
const tocLinks = new Map($$('.toc a').map(a => [a.getAttribute('href').slice(1), a]));
if (tocLinks.size && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      tocLinks.forEach(a => a.removeAttribute('aria-current'));
      const link = tocLinks.get(en.target.id);
      if (link) link.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-15% 0px -75% 0px' });
  $$('main .section[id]').forEach(s => io.observe(s));
}
$$('main .section[id]').forEach(s => {
  const h = $(':scope > h2', s);
  if (!h) return;
  const a = document.createElement('a');
  a.className = 'anchor';
  a.href = '#' + s.id;
  a.textContent = '#';
  a.setAttribute('aria-label', 'Link to ' + h.textContent);
  h.appendChild(a);
});
```


---

## assets/js/tokens.js

```js
/* Reading tokens */
const token = name => getComputedStyle(root).getPropertyValue(name).trim();   // as written, e.g. "#2a2a2a"
const probe = document.createElement('span');
probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
document.body.appendChild(probe);
function tokenHex(name) {                                                     // resolved, works for color-mix() tokens too
  probe.style.color = `var(${name})`;
  const c = getComputedStyle(probe).color;
  let rgb = (c.match(/[\d.]+/g) || []).map(Number).slice(0, 3);
  if (/^color\(/.test(c)) rgb = rgb.map(v => v * 255);
  return '#' + rgb.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}
```


---

## assets/js/tabs.js

```js
/* Tabs */
$$('[role="tablist"]').forEach(list => {
  const tabs = $$('[role="tab"]', list);
  const select = (tab, focus) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const j = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
      if (j !== undefined) { e.preventDefault(); select(tabs[j], true); }
    });
  });
});
```


---

## assets/js/copy.js

```js
/* Copy code */
$$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
  const code = btn.dataset.copy
    ? $(btn.dataset.copy)
    : $('[role="tabpanel"]:not([hidden]) code', btn.closest('.code-tabs'));
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code.textContent);
    btn.textContent = 'Copied';
    toast('Copied to clipboard');
  } catch (err) {
    const range = document.createRange();
    range.selectNodeContents(code);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    toast(`Selected. Press ${mac ? '⌘C' : 'Ctrl+C'} to copy.`);
  }
  setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
}));
```


---

## assets/js/sortable.js

```js
/* Sortable table */
$$('table[data-sortable]').forEach(table => {
  $$('thead button', table).forEach((btn, idx) => btn.addEventListener('click', () => {
    const th = btn.closest('th');
    const asc = th.getAttribute('aria-sort') !== 'ascending';
    $$('thead th', table).forEach(h => h.removeAttribute('aria-sort'));
    th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
    const isNum = btn.dataset.type === 'num';
    const val = tr => {
      const s = tr.cells[idx].textContent.trim();
      return isNum ? parseFloat(s.replace(/[^0-9.-]/g, '')) : s;
    };
    const tbody = table.tBodies[0];
    [...tbody.rows]
      .sort((a, b) => { const c = isNum ? val(a) - val(b) : val(a).localeCompare(val(b)); return asc ? c : -c; })
      .forEach(r => tbody.appendChild(r));
  }));
});
```


---

## assets/js/dialog.js

```js
/* Dialog */
$$('[data-dialog]').forEach(btn => btn.addEventListener('click', () => {
  const dlg = document.getElementById(btn.dataset.dialog);
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open', '');
}));
$$('dialog').forEach(dlg => dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close('cancel'); }));
```


---

## assets/js/forms.js

```js
/* Forms with inline errors */
$$('form[data-validate]').forEach(form => {
  const status = $('.form-status', form);
  const controls = $$('[required]', form);
  const setError = (el, on) => {
    el.setAttribute('aria-invalid', String(on));
    const msg = document.getElementById('err-' + el.id);
    if (msg) msg.hidden = !on;
  };
  controls.forEach(el => el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => {
    if (el.getAttribute('aria-invalid') === 'true' && el.checkValidity()) setError(el, false);
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = controls.filter(el => !el.checkValidity());
    controls.forEach(el => setError(el, bad.includes(el)));
    if (bad.length) {
      bad[0].focus();
      if (status) { status.classList.add('is-error'); status.textContent = 'Some fields need attention.'; }
      return;
    }
    if (status) {
      status.classList.remove('is-error');
      status.textContent = 'Everything checks out. This page has no server, so nothing was sent.';
    }
  });
  form.addEventListener('reset', () => {
    controls.forEach(el => setError(el, false));
    if (status) { status.textContent = ''; status.classList.remove('is-error'); }
  });
});
```


---

## assets/js/pressed.js

```js
/* Pressed groups */
$$('[data-pressed-group]').forEach(group => {
  const buttons = $$('button', group);
  const out = group.dataset.readout ? document.getElementById(group.dataset.readout) : null;
  buttons.forEach(b => b.addEventListener('click', () => {
    buttons.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    if (out && b.dataset.label) out.textContent = b.dataset.label;
    group.dispatchEvent(new CustomEvent('change', { detail: b.dataset.value }));
  }));
});
```


---

## assets/js/pager.js

```js
/* Pagination */
$$('.pager[data-pages]').forEach(nav => {
  const pages = Number(nav.dataset.pages);
  let page = Number(nav.dataset.page || 1);
  const out = nav.dataset.readout ? document.getElementById(nav.dataset.readout) : null;
  const render = () => {
    const want = [...new Set([1, page - 1, page, page + 1, pages])].filter(p => p >= 1 && p <= pages).sort((a, b) => a - b);
    let html = `<button type="button" class="word" data-go="prev"${page === 1 ? ' disabled' : ''}>${icon('chevron-left')}Previous</button>`;
    want.forEach((p, i) => {
      if (i && p - want[i - 1] > 1) html += '<span class="gap" aria-hidden="true">…</span>';
      html += `<button type="button" data-go="${p}"${p === page ? ' aria-current="page"' : ''} aria-label="Page ${p}">${p}</button>`;
    });
    html += `<button type="button" class="word" data-go="next"${page === pages ? ' disabled' : ''}>Next${icon('chevron-right')}</button>`;
    nav.innerHTML = html;
    if (out) out.textContent = `Page ${page} of ${pages}`;
  };
  nav.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || b.disabled) return;
    const go = b.dataset.go;
    page = go === 'prev' ? page - 1 : go === 'next' ? page + 1 : Number(go);
    render();
    nav.dispatchEvent(new CustomEvent('pagechange', { detail: page }));
    const again = $(`[data-go="${go}"]`, nav);
    if (again && !again.disabled) again.focus();
  });
  render();
});
```


---

## assets/js/wizard.js

```js
/* Step indicator */
$$('.wizard').forEach(wz => {
  const panels = $$('.wizard-panel', wz);
  const steps = $$('.stepper li', wz);
  const back = $('[data-step-back]', wz);
  const next = $('[data-step-next]', wz);
  let step = 1;
  const markError = (el, on) => {
    el.setAttribute('aria-invalid', String(on));
    const msg = document.getElementById('err-' + el.id);
    if (msg) msg.hidden = !on;
  };
  const show = () => {
    panels.forEach((p, i) => { p.hidden = i + 1 !== step; });
    steps.forEach((li, i) => {
      li.classList.toggle('is-done', i + 1 < step);
      if (i + 1 === step) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
    back.disabled = step === 1;
    next.innerHTML = step === panels.length ? (next.dataset.finish || 'Finish') : `Next${icon('arrow-right')}`;
    wz.dispatchEvent(new CustomEvent('stepchange', { detail: step }));
  };
  $$('[required]', wz).forEach(el => el.addEventListener('input', () => { if (el.checkValidity()) markError(el, false); }));
  next.addEventListener('click', () => {
    const bad = $$('[required]', panels[step - 1]).filter(el => !el.checkValidity());
    bad.forEach(el => markError(el, true));
    if (bad.length) { bad[0].focus(); return; }
    if (step < panels.length) { step++; show(); return; }
    wz.dispatchEvent(new CustomEvent('finish'));
    step = 1;
    show();
  });
  back.addEventListener('click', () => { if (step > 1) { step--; show(); } });
  show();
});
```


---

## assets/js/search.js

```js
/* Search with empty state */
$$('input[data-filter]').forEach(input => {
  const table = document.getElementById(input.dataset.filter);
  if (!table) return;
  const rows = [...table.tBodies[0].rows];
  const count = document.getElementById(input.dataset.count);
  const empty = document.getElementById(input.dataset.empty);
  const noun = input.dataset.noun || 'rows';
  const word = n => (n === 1 ? (input.dataset.nounOne || noun.replace(/s$/, '')) : noun);
  const run = () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach(r => { const hit = !q || r.textContent.toLowerCase().includes(q); r.hidden = !hit; if (hit) shown++; });
    if (count) count.textContent = q ? `${shown} of ${rows.length} ${word(rows.length)}` : `${rows.length} ${word(rows.length)}`;
    if (empty) {
      table.hidden = shown === 0;
      empty.hidden = shown > 0;
      const qEl = $('[data-query]', empty);
      if (qEl) qEl.textContent = input.value.trim();
    }
  };
  input.addEventListener('input', run);
  const clear = empty && $('[data-clear]', empty);
  if (clear) clear.addEventListener('click', () => { input.value = ''; run(); input.focus(); });
  run();
});
```


---

## assets/js/alerts.js

```js
/* Alerts */
$$('.alert [data-dismiss]').forEach(b => b.addEventListener('click', () => { b.closest('.alert').hidden = true; }));
```


---

## assets/js/loading.js

```js
/* Loading placeholders */
function setLoading(el, on) {
  el.classList.toggle('is-loading', on);
  el.setAttribute('aria-busy', String(on));
}
```


---

## assets/js/sparks.js

```js
/* Sparklines */
function drawSparks() {
  $$('.spark[data-spark]').forEach(svg => {
    const vals = svg.dataset.spark.split(',').map(Number);
    const w = svg.clientWidth || 160;
    const h = svg.clientHeight || 32;
    const pad = 3;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const x = i => pad + i * (w - pad * 2) / (vals.length - 1);
    const y = v => h - pad - (v - min) / (max - min || 1) * (h - pad * 2);
    const pts = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    const last = vals.length - 1;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = `<path class="spark-area" d="M${pts.join(' L')} L${x(last).toFixed(1)},${h} L${x(0).toFixed(1)},${h} Z"></path>` +
      `<path class="spark-line" d="M${pts.join(' L')}"></path>` +
      `<circle class="spark-dot" cx="${x(last).toFixed(1)}" cy="${y(vals[last]).toFixed(1)}" r="2.5"></circle>`;
  });
}
drawSparks();
redrawers.push(drawSparks);
```


---

## assets/js/linechart.js

```js
/* Line chart */
function lineChart(box, { labels, series, max, ticks, format = v => String(v) }) {
  const draw = () => {
    const w = box.clientWidth;
    if (!w) return;
    const h = 260;
    const m = { t: 14, r: 44, b: 28, l: 40 };
    const iw = w - m.l - m.r;
    const ih = h - m.t - m.b;
    const n = labels.length - 1;
    const x = i => m.l + i * iw / n;
    const y = v => m.t + ih - v / max * ih;
    const path = arr => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const main = series[0].values;
    const end = main.length - 1;
    let s = `<svg class="chart-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">`;
    s += ticks.map(t => `<line class="grid" x1="${m.l}" x2="${w - m.r}" y1="${y(t)}" y2="${y(t)}"></line>` +
      `<text class="axis" x="${m.l - 8}" y="${y(t) + 4}" text-anchor="end">${format(t)}</text>`).join('');
    s += labels.map((l, i) => (w < 520 && i % 2) ? '' : `<text class="axis" x="${x(i)}" y="${h - 8}" text-anchor="middle">${l}</text>`).join('');
    s += `<path class="area" d="${path(main)} L${x(end)},${y(0)} L${x(0)},${y(0)} Z"></path>`;
    s += series.slice().reverse().map(se => `<path class="line ${se.cls}" d="${path(se.values)}"></path>`).join('');
    s += `<circle class="end" cx="${x(end)}" cy="${y(main[end])}" r="3.5"></circle>`;
    s += `<text class="end-label" x="${x(end) + 8}" y="${y(main[end]) - 6}">${format(main[end])}</text>`;
    s += `<g class="hover" visibility="hidden"><line class="cross" y1="${m.t}" y2="${m.t + ih}"></line>` +
         series.map(se => `<circle class="hdot ${se.cls}" r="3.5"></circle>`).join('') + '</g>';
    s += `<rect class="hit" x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" fill="transparent"></rect></svg>`;
    s += '<div class="chart-tip" hidden></div>';
    box.innerHTML = s;
    const svg = $('svg', box);
    const g = $('.hover', svg);
    const tip = $('.chart-tip', box);
    const dots = $$('.hdot', g);
    $('.hit', svg).addEventListener('pointermove', e => {
      const r = svg.getBoundingClientRect();
      const i = Math.max(0, Math.min(n, Math.round((e.clientX - r.left - m.l) / iw * n)));
      g.setAttribute('visibility', 'visible');
      $('.cross', g).setAttribute('x1', x(i));
      $('.cross', g).setAttribute('x2', x(i));
      series.forEach((se, k) => {
        const has = i < se.values.length;
        dots[k].setAttribute('visibility', has ? 'visible' : 'hidden');
        if (has) { dots[k].setAttribute('cx', x(i)); dots[k].setAttribute('cy', y(se.values[i])); }
      });
      tip.hidden = false;
      tip.innerHTML = `<strong>${labels[i]}</strong>` +
        series.map(se => `<span>${se.name} · ${i < se.values.length ? format(se.values[i]) : 'not yet'}</span>`).join('');
      tip.style.left = `${Math.min(x(i) + 12, w - 150)}px`;
      tip.style.top = `${m.t}px`;
    });
    $('.hit', svg).addEventListener('pointerleave', () => { g.setAttribute('visibility', 'hidden'); tip.hidden = true; });
  };
  draw();
  return draw;
}
```


---

## assets/js/heatmap.js

```js
/* Heatmap */
function heatmap(box, { values, end, thresholds = [1, 3, 6, 9], unit = '' }) {
  const start = new Date(end);
  start.setDate(end.getDate() - values.length + 1);
  const pad = (start.getDay() + 6) % 7;                 // weeks start on Monday
  const weeks = Math.ceil((pad + values.length) / 7);
  let cells = '<span class="hm-cell is-pad"></span>'.repeat(pad);
  let months = '';
  values.forEach((v, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d.getDate() === 1) months += `<span style="grid-column: ${Math.floor((pad + i) / 7) + 1}">${MONTHS[d.getMonth()]}</span>`;
    const level = thresholds.filter(t => v >= t).length;
    const label = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    cells += `<span class="hm-cell${level ? ' l' + level : ''}" title="${label} · ${v}${unit}"></span>`;
  });
  box.style.setProperty('--weeks', weeks);
  box.innerHTML = `<div class="hm-months">${months}</div>` +
    '<div class="hm-days"><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span><span></span></div>' +
    `<div class="hm-grid">${cells}</div>`;
}
```


---

## assets/js/calendar.js

```js
/* Calendar */
function calendar(wrap, { month, selected, events = {} }) {
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const shown = new Date(month.getFullYear(), month.getMonth(), 1);
  let picked = selected || iso(new Date());
  const render = focus => {
    $('.cal-title', wrap).textContent = shown.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
    const offset = (shown.getDay() + 6) % 7;
    const days = new Date(shown.getFullYear(), shown.getMonth() + 1, 0).getDate();
    const today = iso(new Date());
    let html = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => `<span class="cal-dow" aria-hidden="true">${d}</span>`).join('');
    html += '<span></span>'.repeat(offset);
    for (let d = 1; d <= days; d++) {
      const date = new Date(shown.getFullYear(), shown.getMonth(), d);
      const key = iso(date);
      const ev = events[key];
      const name = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      html += `<button type="button" class="cal-day${key === today ? ' is-today' : ''}${ev ? ' has-event' : ''}" data-date="${key}" ` +
              `aria-pressed="${key === picked}" aria-label="${name}${ev ? `, ${ev.length} event${ev.length > 1 ? 's' : ''}` : ''}">${d}</button>`;
    }
    const grid = $('.cal-grid', wrap);
    grid.innerHTML = html;
    $$('.cal-day', grid).forEach(b => b.addEventListener('click', () => { picked = b.dataset.date; render(true); }));
    if (focus) { const sel = $(`[data-date="${picked}"]`, grid); if (sel) sel.focus(); }
    const [yy, mm, dd] = picked.split('-').map(Number);
    $('.agenda .spaced-label', wrap).textContent = new Date(yy, mm - 1, dd).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    const ev = events[picked] || [];
    $('.agenda ul', wrap).innerHTML = ev.length ? ev.map(e => `<li>${e}</li>`).join('') : '<li class="none">Nothing on this day.</li>';
  };
  $('[data-cal-prev]', wrap).addEventListener('click', () => { shown.setMonth(shown.getMonth() - 1); render(); });
  $('[data-cal-next]', wrap).addEventListener('click', () => { shown.setMonth(shown.getMonth() + 1); render(); });
  render();
}
```


---

## assets/js/mermaid.js

```js
/* Mermaid diagrams */
const diagrams = $$('.mermaid-box');
if (diagrams.length) {
  const sources = diagrams.map(box => box.textContent.trim());
  let state = 'idle';
  let count = 0;
  const renderDiagrams = async () => {
    if (state !== 'ready') return;
    const t = name => getComputedStyle(root).getPropertyValue(name).trim();   // base tokens only: Mermaid needs hex
    const font = "'Outfit', system-ui, sans-serif";
    window.mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'strict',
      fontFamily: font,
      flowchart: { curve: 'basis', padding: 14, nodeSpacing: 36, rankSpacing: 44 },
      themeVariables: {
        fontFamily: font, fontSize: '14px',
        background: t('--bg'), mainBkg: t('--bg'), primaryColor: t('--bg'),
        primaryTextColor: t('--ink'), primaryBorderColor: t('--ink'), nodeBorder: t('--ink'), textColor: t('--ink'),
        lineColor: t('--muted'),
        secondaryColor: t('--surface'), tertiaryColor: t('--surface'), edgeLabelBackground: t('--surface'),
        clusterBkg: t('--surface'), clusterBorder: t('--rule')
      }
    });
    for (let i = 0; i < diagrams.length; i++) {
      try {
        const { svg } = await window.mermaid.render(`mmd-${++count}`, sources[i]);
        diagrams[i].innerHTML = svg;
      } catch (err) { /* leave the source text on show */ }
    }
  };
  const load = () => {
    if (state !== 'idle') return;
    state = 'loading';
    const sc = document.createElement('script');
    sc.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
    sc.onload = () => { state = 'ready'; renderDiagrams(); };
    sc.onerror = () => { state = 'failed'; };
    document.head.appendChild(sc);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { load(); io.disconnect(); } }, { rootMargin: '800px 0px' });
    diagrams.forEach(d => io.observe(d));
  } else {
    load();
  }
  themeListeners.push(renderDiagrams);
}
```


---

## assets/js/tasks.js

```js
/* Task list counter */
$$('.task-list').forEach(list => {
  const boxes = $$('input[type="checkbox"]', list);
  const out = list.previousElementSibling && list.previousElementSibling.matches('.tasks-count')
    ? $('span', list.previousElementSibling) : null;
  const update = () => { if (out) out.textContent = boxes.filter(b => b.checked).length; };
  boxes.forEach(b => b.addEventListener('change', update));
  update();
});
```


---

## assets/js/core-end.js

```js
/* Redraw on resize and theme change */
let frame;
const refresh = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => { setScrollbar(); redrawers.forEach(fn => fn()); });
};
const onThemeChange = () => { refresh(); themeListeners.forEach(fn => fn()); };
new MutationObserver(onThemeChange).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', onThemeChange);
let lastWidth = innerWidth;
addEventListener('resize', () => { if (innerWidth !== lastWidth) { lastWidth = innerWidth; refresh(); } });
```
