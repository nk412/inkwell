/* Helpers and toast */
const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const redrawers = [];       // called again on resize and on theme change
const themeListeners = [];  // called again on theme change only

const toastEl = $('#toast');
let toastTimer;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}
// Any button with data-toast="…" shows that message when pressed
$$('[data-toast]').forEach(b => b.addEventListener('click', () => toast(b.dataset.toast)));

/* Theme toggle */
const themeButtons = $$('[data-theme-choice]');
let hostTheme = root.getAttribute('data-theme');
let themeMode = 'auto';
let themeSetByPage = hostTheme;
try {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') themeMode = saved;
} catch (e) {}
function applyTheme() {
  const want = themeMode === 'auto' ? hostTheme : themeMode;
  themeSetByPage = want || null;
  if (want) root.setAttribute('data-theme', want);
  else root.removeAttribute('data-theme');
  themeButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === themeMode)));
}
themeButtons.forEach(b => b.addEventListener('click', () => {
  themeMode = b.dataset.themeChoice;
  try { localStorage.setItem('theme', themeMode); } catch (e) {}
  applyTheme();
}));
new MutationObserver(() => {
  const current = root.getAttribute('data-theme');
  if (current === themeSetByPage) return;   // our own change
  hostTheme = current;                       // the host changed its theme
  if (themeMode === 'auto') themeSetByPage = current;
  else applyTheme();
}).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
applyTheme();

/* Scrollbar width */
const setScrollbar = () => root.style.setProperty('--sbw', `${Math.max(0, innerWidth - root.clientWidth)}px`);
setScrollbar();

/* Reading progress line */
const line = $('.progress-line');
if (line) {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = root.scrollHeight - innerHeight;
      line.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Contents highlight and section anchors */
const tocLinks = new Map($$('.toc a').map(a => [a.getAttribute('href').slice(1), a]));
if (tocLinks.size && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      tocLinks.forEach(a => a.removeAttribute('aria-current'));
      const link = tocLinks.get(en.target.id);
      if (link) link.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-15% 0px -75% 0px' });
  $$('main .section[id]').forEach(s => io.observe(s));
}
$$('main .section[id]').forEach(s => {
  const h = $(':scope > h2', s);
  if (!h) return;
  const a = document.createElement('a');
  a.className = 'anchor';
  a.href = '#' + s.id;
  a.textContent = '#';
  a.setAttribute('aria-label', 'Link to ' + h.textContent);
  h.appendChild(a);
});
