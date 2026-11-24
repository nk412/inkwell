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
| `rail` | `auto` | Contents rail and progress line. `auto` turns on at four or more sections |
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

1. **Palette:** one ink on a pale ground, plus five shades of ink for data. Three signal colours (danger, warning, success) mark status only, always beside a glyph or a word.
2. **Typefaces:** Lora for reading, Outfit 600 for headings and UI, DM Mono for metadata. Nothing else.
3. **Four voices, one job each:** roman serif for content, italic serif for commentary, sans for structure, mono for metadata.
4. **Column:** prose sits in a 36rem column. Tables, charts, tools and diagrams that need room go in `.wide`, which grows into the right margin up to 54rem. A `.band.full` spans the window.
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
16. **Data:** greyscale charts with mono labels. Label example data as example data on the page.

---

## Page types

| `--type` | For | Typical components |
|---|---|---|
| `note` | Note, memo, letter | Sections, lists, callouts |
| `report` | Essay, article, report, plan | Pull quote, sidenotes, footnotes, figures, timeline, tables |
| `docs` | Documentation, guide | Steps, code tabs, diff, callouts, comparison table, disclosure |
| `tool` | Calculator, converter, checker | Split view, form controls, big number, signal results |
| `app` | Small app or tool | App shell, segmented control, side filters, board, compact table, dialog |
| `dashboard` | Metrics, tracking | Stat tiles, sparklines, line chart, heatmap band, calendar, compact table |
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
