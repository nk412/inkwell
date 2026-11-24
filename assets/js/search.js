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
