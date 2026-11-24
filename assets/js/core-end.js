/* Redraw on resize and theme change */
let frame;
const refresh = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => { setScrollbar(); redrawers.forEach(fn => fn()); });
};
const onThemeChange = () => { refresh(); themeListeners.forEach(fn => fn()); };
new MutationObserver(onThemeChange).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', onThemeChange);
let lastWidth = innerWidth;
addEventListener('resize', () => { if (innerWidth !== lastWidth) { lastWidth = innerWidth; refresh(); } });
