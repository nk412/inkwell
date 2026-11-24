/* Copy code */
$$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
  const code = btn.dataset.copy
    ? $(btn.dataset.copy)
    : $('[role="tabpanel"]:not([hidden]) code', btn.closest('.code-tabs'));
  if (!code) return;
  try {
    await navigator.clipboard.writeText(code.textContent);
    btn.textContent = 'Copied';
    toast('Copied to clipboard');
  } catch (err) {
    const range = document.createRange();
    range.selectNodeContents(code);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    toast(`Selected. Press ${mac ? '⌘C' : 'Ctrl+C'} to copy.`);
  }
  setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
}));
