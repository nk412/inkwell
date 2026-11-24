/* Reading tokens */
const token = name => getComputedStyle(root).getPropertyValue(name).trim();   // as written, e.g. "#2a2a2a"
const probe = document.createElement('span');
probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
document.body.appendChild(probe);
function tokenHex(name) {                                                     // resolved, works for color-mix() tokens too
  probe.style.color = `var(${name})`;
  const c = getComputedStyle(probe).color;
  let rgb = (c.match(/[\d.]+/g) || []).map(Number).slice(0, 3);
  if (/^color\(/.test(c)) rgb = rgb.map(v => v * 255);
  return '#' + rgb.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}
