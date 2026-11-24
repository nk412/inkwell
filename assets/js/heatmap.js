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
