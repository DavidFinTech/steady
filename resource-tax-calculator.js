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
  const money = n => n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
  function calculate() {
    const error = document.getElementById('error');
    if (!form.checkValidity()) {
      error.textContent = 'Enter valid, non-negative amounts in both fields.';
      ['total','profit','federal','self','medicare','monthly'].forEach(id => document.getElementById(id).textContent = '—');
      return;
    }
    try {
      const result = estimateTax(Number(form.elements.revenue.value),Number(form.elements.costs.value),form.elements.filing.value);
      Object.entries(result).forEach(([id,value]) => document.getElementById(id).textContent = money(value));
      document.getElementById('monthly').textContent = money(result.total / 12);
      error.textContent = Number(form.elements.costs.value) > Number(form.elements.revenue.value) ? 'Expenses exceed revenue. This model treats the loss as zero; it does not calculate loss deductions.' : '';
    } catch(e) { error.textContent = e.message; }
  }
  form.addEventListener('submit', e => { e.preventDefault(); calculate(); });
  form.addEventListener('input', calculate);
  form.addEventListener('reset', () => setTimeout(calculate,0));
  calculate();
}
