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
