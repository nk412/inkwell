/* Step indicator */
$$('.wizard').forEach(wz => {
  const panels = $$('.wizard-panel', wz);
  const steps = $$('.stepper li', wz);
  const back = $('[data-step-back]', wz);
  const next = $('[data-step-next]', wz);
  let step = 1;
  const markError = (el, on) => {
    el.setAttribute('aria-invalid', String(on));
    const msg = document.getElementById('err-' + el.id);
    if (msg) msg.hidden = !on;
  };
  const show = () => {
    panels.forEach((p, i) => { p.hidden = i + 1 !== step; });
    steps.forEach((li, i) => {
      li.classList.toggle('is-done', i + 1 < step);
      if (i + 1 === step) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
    back.disabled = step === 1;
    next.innerHTML = step === panels.length ? (next.dataset.finish || 'Finish') : `Next${icon('arrow-right')}`;
    wz.dispatchEvent(new CustomEvent('stepchange', { detail: step }));
  };
  $$('[required]', wz).forEach(el => el.addEventListener('input', () => { if (el.checkValidity()) markError(el, false); }));
  next.addEventListener('click', () => {
    const bad = $$('[required]', panels[step - 1]).filter(el => !el.checkValidity());
    bad.forEach(el => markError(el, true));
    if (bad.length) { bad[0].focus(); return; }
    if (step < panels.length) { step++; show(); return; }
    wz.dispatchEvent(new CustomEvent('finish'));
    step = 1;
    show();
  });
  back.addEventListener('click', () => { if (step > 1) { step--; show(); } });
  show();
});
