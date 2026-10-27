/* 2026 simplified planning model. Sources and exclusions appear beside the calculator. */
(function () {
  'use strict';
  const rates = [.10, .12, .22, .24, .32, .35, .37];
  const limits = {
    single: [12400, 50400, 105700, 201775, 256225, 640600, Infinity],
    joint: [24800, 100800, 211400, 403550, 512450, 768700, Infinity]
  };
  function federalTax(taxable, filing) {
    let total = 0, lower = 0, marginal = 0;
    limits[filing].forEach((upper, i) => {
      const slice = Math.max(0, Math.min(taxable, upper) - lower);
      total += slice * rates[i];
      if (slice > 0) marginal = rates[i];
      lower = upper;
    });
    return { total, marginal };
  }
  function calculateGigTax(input) {
    const { revenue, expenses, milesFirst, milesSecond, stateRate, filing, mileage } = input;
    if (!limits[filing] || [revenue, expenses, milesFirst, milesSecond, stateRate].some(n => !Number.isFinite(n) || n < 0) || revenue > 10000000 || expenses > 10000000 || milesFirst > 1000000 || milesSecond > 1000000 || stateRate > 20) {
      throw new RangeError('Enter valid nonnegative amounts within the displayed limits. State/local rate must be 0–20%.');
    }
    const mileageDeduction = mileage ? milesFirst * .725 + milesSecond * .76 : 0;
    const profit = Math.max(0, revenue - expenses - mileageDeduction);
    const earnings = profit * .9235;
    const regularSE = earnings >= 400 ? Math.min(earnings, 184500) * .124 + earnings * .029 : 0;
    const threshold = filing === 'joint' ? 250000 : 200000;
    const additionalMedicare = Math.max(0, earnings - threshold) * .009;
    const standard = filing === 'joint' ? 32200 : 16100;
    const federal = federalTax(Math.max(0, profit - regularSE / 2 - standard), filing);
    const state = profit * stateRate / 100;
    const federalTotal = regularSE + additionalMedicare + federal.total;
    const total = federalTotal + state;
    const w2Payroll = Math.min(revenue, 184500) * .062 + revenue * .0145 + Math.max(0, revenue - threshold) * .009;
    const w2Federal = federalTax(Math.max(0, revenue - standard), filing).total;
    return {
      mileageDeduction, profit, regularSE, additionalMedicare, federal: federal.total,
      marginal: federal.marginal, state, total, federalTotal, takehome: profit - total,
      effective: revenue ? total / revenue : 0, monthly: total / 12, quarterly: federalTotal / 4,
      contractorFederalTakehome: revenue - federalTotal, w2Takehome: revenue - w2Payroll - w2Federal
    };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { calculateGigTax, federalTax };
  if (typeof document === 'undefined') return;
  const get = id => document.getElementById(id);
  const inputs = ['gig-revenue', 'gig-expenses', 'gig-miles-first', 'gig-miles-second', 'gig-state'];
  const outputs = ['gig-takehome', 'gig-effective', 'gig-profit', 'gig-deduction', 'gig-se', 'gig-medicare', 'gig-federal', 'gig-state-tax', 'gig-total', 'gig-monthly', 'gig-quarterly', 'gig-comparison'];
  const cash = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  function render() {
    try {
      if (inputs.some(id => get(id).value.trim() === '' || !get(id).validity.valid)) throw new RangeError('Complete all fields with valid nonnegative amounts. State/local rate must be 0–20%.');
      const r = calculateGigTax({ revenue: +get('gig-revenue').value, expenses: +get('gig-expenses').value,
        milesFirst: +get('gig-miles-first').value, milesSecond: +get('gig-miles-second').value,
        stateRate: +get('gig-state').value, filing: get('gig-filing').value, mileage: get('gig-mileage').checked });
      get('gig-error').textContent = '';
      const values = { 'gig-takehome': r.takehome, 'gig-profit': r.profit, 'gig-deduction': r.mileageDeduction,
        'gig-se': r.regularSE, 'gig-medicare': r.additionalMedicare, 'gig-federal': r.federal,
        'gig-state-tax': r.state, 'gig-total': r.total, 'gig-monthly': r.monthly, 'gig-quarterly': r.quarterly };
      Object.entries(values).forEach(([id, value]) => { get(id).textContent = cash(value); });
      get('gig-effective').textContent = (r.effective * 100).toFixed(1) + '% of revenue for estimated taxes + reserve · ' + (r.marginal * 100).toFixed(0) + '% federal marginal bracket';
      get('gig-comparison').textContent = 'On ' + cash(+get('gig-revenue').value) + ' of gross income: 1099 after federal taxes, before business costs: ' + cash(r.contractorFederalTakehome) + '. W-2 after employee payroll and federal income taxes: ' + cash(r.w2Takehome) + '. Both exclude state/local tax.';
      document.querySelectorAll('.gig-payment').forEach(el => { el.textContent = cash(r.quarterly); });
    } catch (error) {
      get('gig-error').textContent = error.message;
      outputs.forEach(id => { get(id).textContent = '—'; });
      document.querySelectorAll('.gig-payment').forEach(el => { el.textContent = '—'; });
    }
  }
  [...inputs, 'gig-filing', 'gig-mileage'].forEach(id => get(id).addEventListener('input', render));
  get('gig-reset').addEventListener('click', () => {
    [35000, 0, 2500, 2500, 0].forEach((value, i) => { get(inputs[i]).value = value; });
    get('gig-filing').value = 'single'; get('gig-mileage').checked = true; render();
  });
  render();
})();
