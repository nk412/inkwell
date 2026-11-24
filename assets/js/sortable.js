/* Sortable table */
$$('table[data-sortable]').forEach(table => {
  $$('thead button', table).forEach((btn, idx) => btn.addEventListener('click', () => {
    const th = btn.closest('th');
    const asc = th.getAttribute('aria-sort') !== 'ascending';
    $$('thead th', table).forEach(h => h.removeAttribute('aria-sort'));
    th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
    const isNum = btn.dataset.type === 'num';
    const val = tr => {
      const s = tr.cells[idx].textContent.trim();
      return isNum ? parseFloat(s.replace(/[^0-9.-]/g, '')) : s;
    };
    const tbody = table.tBodies[0];
    [...tbody.rows]
      .sort((a, b) => { const c = isNum ? val(a) - val(b) : val(a).localeCompare(val(b)); return asc ? c : -c; })
      .forEach(r => tbody.appendChild(r));
  }));
});
