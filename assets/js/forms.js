/* Forms with inline errors */
$$('form[data-validate]').forEach(form => {
  const status = $('.form-status', form);
  const controls = $$('[required]', form);
  const setError = (el, on) => {
    el.setAttribute('aria-invalid', String(on));
    const msg = document.getElementById('err-' + el.id);
    if (msg) msg.hidden = !on;
  };
  controls.forEach(el => el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => {
    if (el.getAttribute('aria-invalid') === 'true' && el.checkValidity()) setError(el, false);
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = controls.filter(el => !el.checkValidity());
    controls.forEach(el => setError(el, bad.includes(el)));
    if (bad.length) {
      bad[0].focus();
      if (status) { status.classList.add('is-error'); status.textContent = 'Some fields need attention.'; }
      return;
    }
    if (status) {
      status.classList.remove('is-error');
      status.textContent = 'Everything checks out. This page has no server, so nothing was sent.';
    }
  });
  form.addEventListener('reset', () => {
    controls.forEach(el => setError(el, false));
    if (status) { status.textContent = ''; status.classList.remove('is-error'); }
  });
});
