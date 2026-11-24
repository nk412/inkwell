/* Dialog */
$$('[data-dialog]').forEach(btn => btn.addEventListener('click', () => {
  const dlg = document.getElementById(btn.dataset.dialog);
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open', '');
}));
$$('dialog').forEach(dlg => dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close('cancel'); }));
