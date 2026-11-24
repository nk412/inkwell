/* Loading placeholders */
function setLoading(el, on) {
  el.classList.toggle('is-loading', on);
  el.setAttribute('aria-busy', String(on));
}
