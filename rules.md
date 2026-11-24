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
