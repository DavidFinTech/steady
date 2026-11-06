'use strict';
// Estimates federal take-home for a W-2 job or 1099 gig, as if it were someone's only
// work for 52 weeks. Uses the same 2026 figures as the tax calculator. Leaves out state
// and city tax, credits and the QBI deduction. Filing status is single.
(() => {
  const taxLib = typeof module !== 'undefined' ? require('./resource-tax-calculator.js') : { estimateTax: window.estimateTax, federalIncomeTax: window.federalIncomeTax };
  const STANDARD_DEDUCTION = 16100, WAGE_BASE = 184500, MEDICARE_EXTRA_OVER = 200000, WEEKS = 52;

  function estimateTakeHome({ type, hourly, hours, weeklyCosts }) {
    const values = [hourly, hours, weeklyCosts];
    if (!['w2', '1099'].includes(type) || !values.every(n => Number.isFinite(n) && n >= 0)) return null;
    const gross = hourly * hours * WEEKS;
    const costs = weeklyCosts * WEEKS;
    let taxes;
    if (type === '1099') {
      taxes = taxLib.estimateTax(gross, Math.min(costs, 10000000), 'single').total;
    } else {
      const payroll = Math.min(gross, WAGE_BASE) * 0.062 + gross * 0.0145 + Math.max(0, gross - MEDICARE_EXTRA_OVER) * 0.009;
      taxes = payroll + taxLib.federalIncomeTax(Math.max(0, gross - STANDARD_DEDUCTION), false);
    }
    const yearly = gross - costs - taxes;
    return {
      gross, costs, taxes, yearly,
      weekly: yearly / WEEKS,
      perHour: hours > 0 ? yearly / WEEKS / hours : 0
    };
  }
  if (typeof module !== 'undefined') module.exports = { estimateTakeHome };
  if (typeof window !== 'undefined') window.estimateTakeHome = estimateTakeHome;
})();
