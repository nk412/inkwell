#!/usr/bin/env python3
"""Inkwell page builder. Vanilla Python 3.8+, no dependencies.

    build.py new PAGE.src.html --type TYPE --title "Title"   scaffold a page source
    build.py PAGE.src.html [-o OUT.html] [--no-prune]        build one self-contained page
    build.py types                                           list page types for `new`
    build.py list [MODULE]                                   list components
    build.py snippet NAME [NAME ...]                         print notes and markup for components
    build.py export [-o FILE]                                write the whole system as one markdown file

The builder writes the masthead, theme toggle, contents rail, section numbering, footer,
stylesheet, icons and scripts. A page source holds only front matter and content.
"""
import datetime
import html
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ASSETS = HERE / "assets"
COMPONENTS = HERE / "components"
TEMPLATES = HERE / "templates"
PRISM = '<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>'

TYPES = {
    "note": "Note, memo or letter. One column, no rail, no footer.",
    "report": "Essay, article or report. Rail and numbering from four sections. Long-form extras.",
    "docs": "Documentation or guide. Steps, code tabs, callouts, comparison table.",
    "tool": "Calculator, converter or checker. A split view with live output.",
    "app": "Small app. An app shell with view switch, filters, board and list.",
    "dashboard": "Dashboard. Stat tiles, line chart, heatmap band, compact table.",
    "form": "Form or wizard. Step indicator, fields with inline errors, review.",
    "diagram": "Diagram or explainer. Mermaid flowchart with steps and notes.",
}

# Classes that pull in a CSS module
MODULE_CLASSES = {
    "longform": {"pullquote", "sidenote", "sn-ref", "timeline"},
    "tools": {"split", "shell", "board", "task", "avatar", "avatar-group", "segmented", "crumbs", "pager",
              "wizard", "stepper", "radio-cards", "cards", "card-option", "table-tools", "search",
              "table-scroll", "table-compact", "empty", "file-card", "sk-row"},
    "data": {"stats", "stat", "spark", "chart", "legend", "band", "heatmap", "cal-wrap", "big-number",
             "bars", "bar-row"},
    "diagrams": {"mermaid-box"},
}
MODULE_ORDER = ["longform", "tools", "data", "diagrams"]
JS_FUNCTIONS_MODULE = {"lineChart(": "data", "heatmap(": "data", "calendar(": "data"}

# Component scripts, in load order, with the test that includes each one
SCRIPT_RULES = [
    ("tokens", lambda b, c, j: re.search(r"\btoken(Hex)?\(", j)),
    ("tabs", lambda b, c, j: 'role="tablist"' in b),
    ("copy", lambda b, c, j: "data-copy" in b),
    ("sortable", lambda b, c, j: "data-sortable" in b),
    ("dialog", lambda b, c, j: "<dialog" in b or "data-dialog" in b),
    ("forms", lambda b, c, j: "data-validate" in b),
    ("pressed", lambda b, c, j: "data-pressed-group" in b),
    ("pager", lambda b, c, j: "data-pages=" in b),
    ("wizard", lambda b, c, j: "wizard" in c),
    ("search", lambda b, c, j: "data-filter=" in b),
    ("alerts", lambda b, c, j: "data-dismiss" in b),
    ("loading", lambda b, c, j: "setLoading(" in j),
    ("sparks", lambda b, c, j: "data-spark=" in b),
    ("linechart", lambda b, c, j: "lineChart(" in j),
    ("heatmap", lambda b, c, j: "heatmap(" in j),
    ("calendar", lambda b, c, j: "calendar(" in j),
    ("mermaid", lambda b, c, j: "mermaid-box" in c),
    ("tasks", lambda b, c, j: "task-list" in c),
]
SCRIPT_ICONS = {"pager": {"chevron-left", "chevron-right"}, "wizard": {"arrow-right"}}
TOGGLE_ICONS = {"contrast", "sun", "moon"}

RESERVED_IDS = {"settings", "sidebar", "customize", "upgrade", "downloads", "top"}


# ---------------------------------------------------------------- helpers

def read(path):
    return Path(path).read_text(encoding="utf-8")


def fail(msg):
    sys.stderr.write(f"error: {msg}\n")
    sys.exit(1)


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s).strip()


def slugify(text, taken):
    slug = re.sub(r"[^a-z0-9]+", "-", strip_tags(text).lower()).strip("-") or "section"
    if slug in RESERVED_IDS or slug.startswith("comment-"):
        slug += "-section"
    base, n = slug, 2
    while slug in taken:
        slug = f"{base}-{n}"
        n += 1
    taken.add(slug)
    return slug


def icon_svg(name, extra=""):
    cls = ("icon " + extra).strip()
    return f'<svg class="{cls}" aria-hidden="true"><use href="#i-{name}"></use></svg>'


# ---------------------------------------------------------------- source parsing

FRONT_RE = re.compile(r"\A\s*<!--(.*?)-->", re.S)


def parse_front(text):
    meta, key = {}, None
    m = FRONT_RE.match(text)
    if not m:
        return meta, text
    for line in m.group(1).splitlines():
        if not line.strip():
            continue
        km = re.match(r"([a-z][a-z-]*)\s*:\s*(.*)$", line)
        if km and not line[0].isspace():
            key = km.group(1)
            meta[key] = km.group(2).strip()
        elif key:
            meta[key] = (meta[key] + " " + line.strip()).strip()
    return meta, text[m.end():]


def format_date(value):
    value = (value or "today").strip()
    if value.lower() == "none":
        return ""
    if value.lower() == "today":
        d = datetime.date.today()
    else:
        try:
            d = datetime.date.fromisoformat(value)
        except ValueError:
            return html.escape(value)
    return f'<time datetime="{d.isoformat()}">{d.strftime("%d/%m/%Y")}</time>'


SECTION_RE = re.compile(r"<section\b([^>]*)>", re.I)
H2_RE = re.compile(r"<h2\b([^>]*)>(.*?)</h2>", re.I | re.S)


def process_sections(body, numbers, warnings):
    """Give each .section an id, aria-labelledby, an h2 id and (optionally) an eyebrow number."""
    matches = [m for m in SECTION_RE.finditer(body) if re.search(r'class="[^"]*\bsection\b', m.group(1))]
    taken = set(re.findall(r'\bid="([^"]+)"', body))
    out, pos, toc = [], 0, []
    for i, m in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        attrs, segment = m.group(1), body[m.end():end]
        h2 = H2_RE.search(segment)
        if not h2:
            warnings.append(f"section {i + 1} has no <h2>; it is left out of the contents")
            out.append(body[pos:end])
            pos = end
            continue
        title = strip_tags(h2.group(2))
        idm = re.search(r'\bid="([^"]+)"', attrs)
        sid = idm.group(1) if idm else slugify(title, taken)
        if not idm:
            attrs += f' id="{sid}"'
        h2_attrs = h2.group(1)
        hid_m = re.search(r'\bid="([^"]+)"', h2_attrs)
        hid = hid_m.group(1) if hid_m else f"{sid}-h"
        if not hid_m:
            h2_attrs += f' id="{hid}"'
        if "aria-labelledby" not in attrs:
            attrs += f' aria-labelledby="{hid}"'
        before = segment[:h2.start()]
        eyebrow = ""
        if numbers and 'class="eyebrow"' not in before:
            eyebrow = f'<p class="eyebrow">{len(toc) + 1:02d}</p>\n  '
        new_h2 = f"<h2{h2_attrs}>{h2.group(2)}</h2>"
        out.append(body[pos:m.start()] + f"<section{attrs}>" + before + eyebrow + new_h2 + segment[h2.end():])
        pos = end
        toc.append((sid, title))
    out.append(body[pos:])
    return "".join(out), toc


# ---------------------------------------------------------------- assembly

def split_css_blocks(css):
    parts = re.split(r"(/\* -{10} .+? -{10} \*/)", css)
    head, blocks = parts[0], []
    for i in range(1, len(parts), 2):
        name = re.search(r"-{10} (.+?) -{10}", parts[i]).group(1)
        blocks.append((name, parts[i] + parts[i + 1]))
    return head, blocks


def core_css(body, classes, rail, footer, wide, prune):
    css = read(ASSETS / "css/core.css")
    if not prune:
        return css, []
    has = lambda *xs: any(x in body for x in xs)
    cls = lambda *xs: bool(classes.intersection(xs))
    keep = {
        "Contents & rail": rail,
        "Quotes": has("<blockquote"),
        "Tables": has("<table"),
        "Code": has("<pre") or cls("code-tabs"),
        "Disclosure": has("<details"),
        "Forms": has("<form", "<input", "<select", "<textarea"),
        "Buttons": cls("btn"),
        "Media": has("<figure", "<img", "<canvas"),
        "Notes": cls("callouts", "callout", "footnotes", "fn-ref") or has("<hr"),
        "Steps": cls("steps"),
        "Comparison table": cls("compare"),
        "Code diff": cls("diff"),
        "Alerts": cls("alert", "alerts"),
        "Footer": footer,
        "Wide layout": wide,
    }
    head, blocks = split_css_blocks(css)
    kept, dropped = [head], []
    for name, block in blocks:
        if keep.get(name, True):
            kept.append(block)
        else:
            dropped.append(name)
    return "".join(kept), dropped


def masthead(meta):
    title = html.escape(meta.get("title", "Untitled"))
    parts = [p for p in (format_date(meta.get("date")), meta.get("meta", "").strip()) if p]
    lede = meta.get("lede", "").strip()
    toggle = (
        '<div class="theme-toggle" role="group" aria-label="Colour theme">\n'
        '      <button type="button" data-theme-choice="auto" aria-pressed="true" aria-label="Auto: follow Claude or your system" title="Auto: follow Claude or your system">' + icon_svg("contrast") + "</button>\n"
        '      <button type="button" data-theme-choice="light" aria-pressed="false" aria-label="Light" title="Light">' + icon_svg("sun") + "</button>\n"
        '      <button type="button" data-theme-choice="dark" aria-pressed="false" aria-label="Dark" title="Dark">' + icon_svg("moon") + "</button>\n"
        "    </div>"
    )
    out = (f'<header class="masthead" id="top">\n  <h1>{title}</h1>\n  <div class="meta-row">\n'
           f'    <p class="meta">{" · ".join(parts)}</p>\n    {toggle}\n  </div>\n')
    if lede:
        out += f'  <p class="lede">{lede}</p>\n'
    return out + "</header>"


def rail_html(toc):
    items = "\n".join(f'      <li><a href="#{sid}"><span class="n">{i:02d}</span>{html.escape(t)}</a></li>'
                      for i, (sid, t) in enumerate(toc, 1))
    return ('<aside class="rail">\n  <nav class="toc" aria-label="Contents">\n    <p class="toc-title">Contents</p>\n'
            f"    <ol>\n{items}\n    </ol>\n  </nav>\n</aside>")


def lint(body, page_css, warnings):
    for m in re.finditer(r"#[0-9a-fA-F]{3,8}\b", page_css):
        warnings.append(f"page <style> uses the colour {m.group(0)}; use tokens such as var(--ink)")
    for m in re.finditer(r'style="([^"]*)"', body):
        if re.search(r"#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(", m.group(1)):
            warnings.append(f'inline style sets a raw colour ("{m.group(1)[:40]}"); use tokens')
    for _ in re.finditer(r"<img\b(?![^>]*\balt=)[^>]*>", body):
        warnings.append("an <img> has no alt text")
    for m in re.finditer(r"<button\b([^>]*)>(.*?)</button>", body, re.S):
        inner = strip_tags(re.sub(r"<svg.*?</svg>", "", m.group(2), flags=re.S))
        if not inner and "aria-label" not in m.group(1):
            warnings.append("an icon-only <button> has no aria-label")
    for m in re.finditer(r"<(input|select|textarea)\b([^>]*\brequired\b[^>]*)>", body):
        if "aria-describedby" not in m.group(2):
            idm = re.search(r'\bid="([^"]+)"', m.group(2))
            warnings.append(f'required field {"#" + idm.group(1) if idm else ""} has no error message (aria-describedby="err-<id>")')
    ids = re.findall(r'\bid="([^"]+)"', body)
    for dup in sorted({i for i in ids if ids.count(i) > 1}):
        warnings.append(f'the id "{dup}" is used more than once')
    if re.search(r"lorem ipsum", body, re.I):
        warnings.append("placeholder text (lorem ipsum) left in the page")


def build(src, out=None, prune=True):
    src = Path(src)
    if not src.exists():
        fail(f"{src} not found")
    meta, body = parse_front(read(src))
    if "title" not in meta:
        fail("the front matter needs a title (see DESIGN.md)")
    warnings = []

    # Page-specific CSS and JS live in the source; lift them out
    page_css = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", body, re.S | re.I))
    body = re.sub(r"<style[^>]*>.*?</style>\s*", "", body, flags=re.S | re.I)
    page_js = "\n".join(re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", body, re.S | re.I))
    body = re.sub(r"<script(?![^>]*\bsrc=)[^>]*>.*?</script>\s*", "", body, flags=re.S | re.I)

    body = re.sub(r"\{\{icon:([\w-]+)((?:\s+[\w-]+)*)\s*\}\}", lambda m: icon_svg(m.group(1), m.group(2)), body)

    layout = meta.get("layout", "column").strip().lower()
    if layout not in ("column", "wide"):
        fail(f'unknown layout "{layout}" (use column or wide)')
    wide = layout == "wide"

    sections = [m for m in SECTION_RE.finditer(body) if re.search(r'class="[^"]*\bsection\b', m.group(1))]
    flag = lambda key, auto: {"on": True, "off": False}.get(meta.get(key, "auto").lower(), auto)
    rail = flag("rail", len(sections) >= 4 and not wide)
    numbers = flag("numbers", rail)
    footer = flag("footer", rail)
    body, toc = process_sections(body, numbers, warnings)
    if rail and not toc:
        rail = False

    classes = set()
    for m in re.finditer(r'class="([^"]*)"', body):
        classes.update(m.group(1).split())

    # CSS modules
    mods = set()
    spec = meta.get("modules", "auto").replace(" ", "")
    if spec in ("", "auto") or spec.startswith("+"):
        for mod, names in MODULE_CLASSES.items():
            if classes & names:
                mods.add(mod)
        for fn, mod in JS_FUNCTIONS_MODULE.items():
            if fn in page_js:
                mods.add(mod)
    for name in spec.lstrip("+").split(","):
        if name and name != "auto":
            if name not in MODULE_ORDER:
                fail(f'unknown module "{name}" (use {", ".join(MODULE_ORDER)})')
            mods.add(name)
    mods = [m for m in MODULE_ORDER if m in mods]

    # Scripts
    scripts = [name for name, test in SCRIPT_RULES if test(body, classes, page_js)]
    for extra in meta.get("scripts", "").replace("+", "").replace(" ", "").split(","):
        if extra and extra not in scripts:
            if not (ASSETS / f"js/{extra}.js").exists():
                fail(f'unknown script "{extra}"')
            scripts.append(extra)

    css, dropped = core_css(body, classes, rail, footer, wide, prune)
    css += "".join("\n" + read(ASSETS / f"css/{m}.css") for m in mods)
    if page_css.strip():
        css += "\n/* ---------- Page ---------- */\n" + page_css.strip() + "\n"

    js_parts = [read(ASSETS / "js/core.js")] + [read(ASSETS / f"js/{s}.js") for s in scripts]
    if page_js.strip():
        js_parts.append("/* Page */\n" + page_js.strip() + "\n")
    js_parts.append(read(ASSETS / "js/core-end.js"))

    # Icons: only the symbols the page uses
    used = set(re.findall(r"#i-([\w-]+)", body)) | set(re.findall(r"icon\(\s*'([\w-]+)'", page_js)) | TOGGLE_ICONS
    for s in scripts:
        used |= SCRIPT_ICONS.get(s, set())
    sprite_src = read(ASSETS / "icons.svg")
    symbols = re.findall(r'(\s*<symbol id="i-([\w-]+)".*?</symbol>)', sprite_src, re.S)
    known = {name for _, name in symbols}
    for name in sorted(used - known):
        warnings.append(f'unknown icon "{name}" (see build.py list icons)')
    sprite = re.sub(r"(<svg[^>]*>).*(</svg>)", lambda m: m.group(1) + "".join(s for s, n in symbols if n in used) + "\n" + m.group(2),
                    sprite_src, flags=re.S)

    lint(body, page_css, warnings)

    page = read(ASSETS / "skeleton.html")
    fills = {
        "@@LANG@@": meta.get("lang", "en"),
        "@@HTML_ATTRS@@": ' data-layout="wide"' if wide else "",
        "@@TITLE@@": html.escape(meta["title"]),
        "@@CSS@@": css.strip(),
        "@@SPRITE@@": sprite.strip(),
        "@@PROGRESS@@": '<div class="progress-line" aria-hidden="true"></div>' if rail else "",
        "@@MASTHEAD@@": masthead(meta),
        "@@RAIL@@": rail_html(toc) if rail else "",
        "@@MAIN@@": body.strip(),
        "@@FOOTER@@": '<footer class="site-footer"><p><a href="#top">Back to top ↑</a></p></footer>' if footer else "",
        "@@PRISM@@": PRISM if "language-" in body else "",
        "@@JS@@": "\n".join(p.strip() for p in js_parts),
    }
    for k, v in fills.items():
        page = page.replace(k, v)
    page = re.sub(r"\n{3,}", "\n\n", page)

    if out is None:
        name = src.name[:-len(".src.html")] + ".html" if src.name.endswith(".src.html") else src.stem + ".out.html"
        out = src.with_name(name)
    out = Path(out)
    if out.resolve() == src.resolve():
        fail("the output would overwrite the source; pass -o")
    out.write_text(page, encoding="utf-8")

    print(f"built {out} · {len(page.encode()) // 1024} KB · sections {len(toc)}"
          f" · layout {layout} · rail {'on' if rail else 'off'} · modules {', '.join(['core'] + mods)}"
          f" · scripts {', '.join(scripts) or 'none'} · icons {len(used & known)}")
    if dropped:
        print(f"  unused core CSS left out: {', '.join(dropped)}")
    for w in dict.fromkeys(warnings):
        print(f"  warning: {w}")


# ---------------------------------------------------------------- other commands

def new(path, kind, title, force):
    if kind not in TYPES:
        fail(f'unknown type "{kind}" (use: {", ".join(TYPES)})')
    path = Path(path)
    if not path.name.endswith(".src.html"):
        path = path.with_name(path.name.split(".")[0] + ".src.html")
    if path.exists() and not force:
        fail(f"{path} exists (pass --force to replace it)")
    text = read(TEMPLATES / f"{kind}.src.html").replace("@@TITLE@@", title or "Untitled page")
    path.write_text(text, encoding="utf-8")
    print(f"created {path} from the {kind} template. Edit the content, then run: build.py {path}")


def component_entries():
    entries = []
    for f in sorted(COMPONENTS.glob("*.md")):
        text = read(f)
        for m in re.finditer(r"^### ([\w-]+)\n(.*?)(?=^### |\Z)", text, re.S | re.M):
            body = m.group(2).strip()
            first = re.sub(r"\*\*[^*]+\*\*\s*", "", body.split("\n")[0]).strip()
            entries.append((m.group(1), f.stem, first.split(". ")[0].rstrip(".") + ".", body))
    return entries


def list_components(module=None):
    entries = component_entries()
    if module == "icons":
        print(" ".join(re.findall(r'<symbol id="i-([\w-]+)"', read(ASSETS / "icons.svg"))))
        return
    width = max(len(e[0]) for e in entries)
    current = None
    for key, mod, desc, _ in entries:
        if module and mod != module:
            continue
        if mod != current:
            print(f"\n{mod}")
            current = mod
        print(f"  {key.ljust(width)}  {desc}")
    print("\nPrint markup with: build.py snippet NAME [NAME ...]   Icons: build.py list icons")


def snippet(names):
    entries = component_entries()
    for name in names:
        exact = [e for e in entries if e[0] == name]
        found = exact or [e for e in entries if name in e[0]]
        if not found:
            fail(f'no component called "{name}" (see build.py list)')
        if len(found) > 1 and not exact:
            print(f'"{name}" matches: {", ".join(e[0] for e in found)}')
            continue
        key, mod, _, body = found[0]
        print(f"### {key} ({mod})\n\n{body}\n")


def types():
    for k, v in TYPES.items():
        print(f"  {k.ljust(10)} {v}")


def export(out):
    out = Path(out or HERE / "inkwell-full.md")
    parts = [read(HERE / "DESIGN.md"), read(HERE / "rules.md")]
    parts += [read(f) for f in sorted(COMPONENTS.glob("*.md"))]
    parts.append("# Assets\n")
    for f in ["css/core.css", "css/longform.css", "css/tools.css", "css/data.css", "css/diagrams.css"]:
        parts.append(f"## assets/{f}\n\n```css\n{read(ASSETS / f).strip()}\n```\n")
    parts.append(f"## assets/icons.svg\n\n```html\n{read(ASSETS / 'icons.svg').strip()}\n```\n")
    parts.append(f"## assets/skeleton.html\n\n```html\n{read(ASSETS / 'skeleton.html').strip()}\n```\n")
    for f in ["core"] + [n for n, _ in SCRIPT_RULES] + ["core-end"]:
        parts.append(f"## assets/js/{f}.js\n\n```js\n{read(ASSETS / f'js/{f}.js').strip()}\n```\n")
    out.write_text("\n\n---\n\n".join(parts), encoding="utf-8")
    print(f"wrote {out}")


# ---------------------------------------------------------------- entry point

def main(argv):
    if not argv or argv[0] in ("-h", "--help", "help"):
        print(__doc__.strip())
        return
    cmd, args = argv[0], argv[1:]

    def opt(name, default=None):
        if name in args:
            i = args.index(name)
            if i + 1 >= len(args):
                fail(f"{name} needs a value")
            value = args[i + 1]
            del args[i:i + 2]
            return value
        return default

    if cmd == "new":
        kind, title = opt("--type", "note"), opt("--title")
        force = "--force" in args
        args = [a for a in args if a != "--force"]
        if len(args) != 1:
            fail("usage: build.py new PAGE.src.html --type TYPE --title TITLE")
        new(args[0], kind, title, force)
    elif cmd == "types":
        types()
    elif cmd == "list":
        list_components(args[0] if args else None)
    elif cmd == "snippet":
        if not args:
            fail("usage: build.py snippet NAME [NAME ...]")
        snippet(args)
    elif cmd == "export":
        export(opt("-o"))
    else:
        out = opt("-o")
        prune = "--no-prune" not in args
        args = [a for a in [cmd] + args if a != "--no-prune"]
        if len(args) != 1:
            fail("usage: build.py PAGE.src.html [-o OUT.html] [--no-prune]")
        build(args[0], out, prune)


if __name__ == "__main__":
    main(sys.argv[1:])
