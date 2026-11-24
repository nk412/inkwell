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
