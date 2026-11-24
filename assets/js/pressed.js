/* Pressed groups */
$$('[data-pressed-group]').forEach(group => {
  const buttons = $$('button', group);
  const out = group.dataset.readout ? document.getElementById(group.dataset.readout) : null;
  buttons.forEach(b => b.addEventListener('click', () => {
    buttons.forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    if (out && b.dataset.label) out.textContent = b.dataset.label;
    group.dispatchEvent(new CustomEvent('change', { detail: b.dataset.value }));
  }));
});
