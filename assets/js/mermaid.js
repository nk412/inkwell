/* Mermaid diagrams */
const diagrams = $$('.mermaid-box');
if (diagrams.length) {
  const sources = diagrams.map(box => box.textContent.trim());
  let state = 'idle';
  let count = 0;
  const renderDiagrams = async () => {
    if (state !== 'ready') return;
    const t = name => getComputedStyle(root).getPropertyValue(name).trim();   // base tokens only: Mermaid needs hex
    const font = "'Outfit', system-ui, sans-serif";
    window.mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'strict',
      fontFamily: font,
      flowchart: { curve: 'basis', padding: 14, nodeSpacing: 36, rankSpacing: 44 },
      themeVariables: {
        fontFamily: font, fontSize: '14px',
        background: t('--bg'), mainBkg: t('--bg'), primaryColor: t('--bg'),
        primaryTextColor: t('--ink'), primaryBorderColor: t('--ink'), nodeBorder: t('--ink'), textColor: t('--ink'),
        lineColor: t('--muted'),
        secondaryColor: t('--surface'), tertiaryColor: t('--surface'), edgeLabelBackground: t('--surface'),
        clusterBkg: t('--surface'), clusterBorder: t('--rule')
      }
    });
    for (let i = 0; i < diagrams.length; i++) {
      try {
        const { svg } = await window.mermaid.render(`mmd-${++count}`, sources[i]);
        diagrams[i].innerHTML = svg;
      } catch (err) { /* leave the source text on show */ }
    }
  };
  const load = () => {
    if (state !== 'idle') return;
    state = 'loading';
    const sc = document.createElement('script');
    sc.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
    sc.onload = () => { state = 'ready'; renderDiagrams(); };
    sc.onerror = () => { state = 'failed'; };
    document.head.appendChild(sc);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { load(); io.disconnect(); } }, { rootMargin: '800px 0px' });
    diagrams.forEach(d => io.observe(d));
  } else {
    load();
  }
  themeListeners.push(renderDiagrams);
}
