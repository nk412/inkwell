/* Task list counter */
$$('.task-list').forEach(list => {
  const boxes = $$('input[type="checkbox"]', list);
  const out = list.previousElementSibling && list.previousElementSibling.matches('.tasks-count')
    ? $('span', list.previousElementSibling) : null;
  const update = () => { if (out) out.textContent = boxes.filter(b => b.checked).length; };
  boxes.forEach(b => b.addEventListener('change', update));
  update();
});
