'use strict';
function estimateTax(revenue, expenses, filing) {
  if (![revenue, expenses].every(n => Number.isFinite(n) && n >= 0 && n <= 10000000) || !['single', 'joint'].includes(filing)) throw new Error('Enter amounts between $0 and $10,000,000.');
  const profit = Math.max(0, revenue - expenses);
  const earnings = profit * .9235;
  const self = earnings >= 400 ? Math.min(earnings, 184500) * .124 + earnings * .029 : 0;
  const joint = filing === 'joint';
  const medicare = Math.max(0, earnings - (joint ? 250000 : 200000)) * .009;
  const taxable = Math.max(0, profit - self / 2 - (joint ? 32200 : 16100));
  const limits = joint ? [24800,100800,211400,403550,512450,768700,Infinity] : [12400,50400,105700,201775,256225,640600,Infinity];
  const rates = [.1,.12,.22,.24,.32,.35,.37];
  let federal = 0, previous = 0;
  limits.forEach((limit,i) => { federal += Math.max(0, Math.min(taxable,limit)-previous)*rates[i]; previous=limit; });
  return {profit, self, medicare, federal, total: self + medicare + federal};
}
if (typeof module !== 'undefined') module.exports = { estimateTax };
if (typeof document !== 'undefined') {
  const form = document.getElementById('tax-form');
  if (form) {
    const $ = id => document.getElementById(id);
    const t = text => window.STEADY.t(text);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const fill = range => range.style.setProperty('--fill', `${(Number(range.value) / Number(range.max)) * 100}%`);
    const sliders = [...form.querySelectorAll('input[type="range"]')].map(range => {
      const input = $(range.dataset.for);
      const sync = () => { range.value = Math.min(Number(range.max), Number(input.value) || 0); fill(range); };
      range.addEventListener('input', () => { input.value = range.value; fill(range); calculate(); });
      input.addEventListener('input', () => { sync(); calculate(); });
      sync();
      return sync;
    });
    let filing = 'single', shown = null, frame = 0;
    form.querySelectorAll('[data-filing]').forEach(button => button.addEventListener('click', () => {
      filing = button.dataset.filing;
      form.querySelectorAll('[data-filing]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      calculate();
    }));
    function countTo(target) {
      cancelAnimationFrame(frame);
      const display = $('monthly-display');
      if (reducedMotion || shown === null) { shown = target; display.textContent = money(target); return; }
      const from = shown, start = performance.now();
      const step = now => {
        const progress = Math.min(1, (now - start) / 380);
        shown = from + (target - from) * (1 - (1 - progress) ** 3);
        display.textContent = money(shown);
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }
    function calculate() {
      const error = $('error');
      const revenue = Number($('revenue').value), expenses = Number($('costs').value);
      let result;
      try {
        if (!form.checkValidity()) throw new Error();
        result = estimateTax(revenue, expenses, filing);
      } catch (_) {
        error.textContent = t('Enter amounts from $0 to $10,000,000.');
        cancelAnimationFrame(frame); shown = null;
        $('monthly-display').textContent = '—';
        ['monthly', 'total-line', 'profit', 'federal', 'self', 'medicare'].forEach(id => { $(id).textContent = '—'; });
        $('tax-share').hidden = true;
        return;
      }
      error.textContent = expenses > revenue ? t('Expenses are higher than income. Losses count as zero here.') : '';
      countTo(result.total / 12);
      $('monthly').textContent = money(result.total / 12);
      $('total-line').textContent = money(result.total);
      ['profit', 'federal', 'self', 'medicare'].forEach(id => { $(id).textContent = money(result[id]); });
      const spent = Math.min(expenses, revenue);
      window.STEADY.renderShare($('tax-share'), [
        { label: 'Expenses', value: spent, tone: 'tone-expense' },
        { label: 'Income tax', value: result.federal, tone: 'tone-federal' },
        { label: 'Self-employment tax', value: result.self, tone: 'tone-self' },
        { label: 'Extra Medicare tax', value: result.medicare, tone: 'tone-medicare' },
        { label: 'Left over', value: Math.max(0, revenue - spent - result.total), tone: 'tone-left' }
      ]);
    }
    form.addEventListener('submit', event => event.preventDefault());
    window.addEventListener('steady-language-change', calculate);
    calculate();
  }
}
