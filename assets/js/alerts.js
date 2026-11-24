/* Alerts */
$$('.alert [data-dismiss]').forEach(b => b.addEventListener('click', () => { b.closest('.alert').hidden = true; }));
