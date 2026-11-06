(() => {
  const $ = id => document.getElementById(id);
  const t = text => window.STEADY.t(text);
  const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const FIELDS = { income: 850, expenses: 550, savings: 400, tax: 20 };
  const paintRange = range => {
    const min = Number(range.min), span = Number(range.max) - min;
    range.style.setProperty('--fill', `${((Number(range.value) - min) / span) * 100}%`);
  };
  function update() {
    const income = Math.max(0, +$('income').value || 0);
    const expenses = Math.max(0, +$('expenses').value || 0);
    const savings = Math.max(0, +$('savings').value || 0);
    const tax = Math.min(60, Math.max(0, +$('tax').value || 0));
    const change = +$('change').value;
    const scenario = income * (1 + change / 100);
    const reserve = (scenario * tax) / 100;
    const left = scenario - expenses - reserve;
    $('changeLabel').textContent = `${change > 0 ? '+' : ''}${change}%`;
    $('remaining').textContent = money(left);
    $('remaining').classList.toggle('is-short', left < 0);
    $('resultLabel').textContent = t(left < 0 ? 'Shortfall this week' : 'Remaining this week');
    $('scenario').textContent = money(scenario);
    $('reserve').textContent = money(reserve);
    $('runway').textContent = expenses ? t('{n} weeks').replace('{n}', (savings / expenses).toFixed(1)) : '—';
    window.STEADY.renderShare($('week-share'), [
      { label: 'Essentials', value: expenses, tone: 'tone-expense' },
      { label: 'Tax reserve', value: reserve, tone: 'tone-federal' },
      { label: 'Remaining', value: Math.max(0, left), tone: 'tone-left' },
      { label: 'Short', value: Math.max(0, -left), tone: 'tone-short' }
    ]);
    document.querySelectorAll('.weekly input[type="range"]').forEach(paintRange);
  }
  document.querySelectorAll('.weekly input[type="range"][data-for]').forEach(range => {
    const input = $(range.dataset.for);
    range.addEventListener('input', () => { input.value = range.value; update(); });
    input.addEventListener('input', () => { range.value = Math.min(Number(range.max), +input.value || 0); update(); });
  });
  $('change').addEventListener('input', update);
  $('reset').addEventListener('click', () => {
    Object.entries(FIELDS).forEach(([id, value]) => {
      $(id).value = value;
      document.querySelector(`[data-for="${id}"]`).value = value;
    });
    $('change').value = 0;
    update();
  });
  window.addEventListener('steady-language-change', update);
  update();
})();
