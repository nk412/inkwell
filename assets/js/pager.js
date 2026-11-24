/* Pagination */
$$('.pager[data-pages]').forEach(nav => {
  const pages = Number(nav.dataset.pages);
  let page = Number(nav.dataset.page || 1);
  const out = nav.dataset.readout ? document.getElementById(nav.dataset.readout) : null;
  const render = () => {
    const want = [...new Set([1, page - 1, page, page + 1, pages])].filter(p => p >= 1 && p <= pages).sort((a, b) => a - b);
    let html = `<button type="button" class="word" data-go="prev"${page === 1 ? ' disabled' : ''}>${icon('chevron-left')}Previous</button>`;
    want.forEach((p, i) => {
      if (i && p - want[i - 1] > 1) html += '<span class="gap" aria-hidden="true">…</span>';
      html += `<button type="button" data-go="${p}"${p === page ? ' aria-current="page"' : ''} aria-label="Page ${p}">${p}</button>`;
    });
    html += `<button type="button" class="word" data-go="next"${page === pages ? ' disabled' : ''}>Next${icon('chevron-right')}</button>`;
    nav.innerHTML = html;
    if (out) out.textContent = `Page ${page} of ${pages}`;
  };
  nav.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b || b.disabled) return;
    const go = b.dataset.go;
    page = go === 'prev' ? page - 1 : go === 'next' ? page + 1 : Number(go);
    render();
    nav.dispatchEvent(new CustomEvent('pagechange', { detail: page }));
    const again = $(`[data-go="${go}"]`, nav);
    if (again && !again.disabled) again.focus();
  });
  render();
});
