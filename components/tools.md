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
