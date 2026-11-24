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
