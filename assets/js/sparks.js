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
