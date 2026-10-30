const assert = require('node:assert/strict');
const { getSupportPath } = require('./support-navigator.js');
for (const need of ['budget','tax','health','pay']) for (const location of ['nyc','other']) {
  const plan = getSupportPath(need,location);
  assert.equal(plan.steps.length,3);
  assert.ok(plan.steps.every(step=>step.length===2 && step.every(Boolean)));
  assert.ok(plan.url.startsWith('https://') || plan.url === 'planner.html#planner');
}
assert.match(getSupportPath('health','nyc').url,/nystateofhealth/);
assert.match(getSupportPath('health','other').url,/healthcare.gov/);
assert.match(getSupportPath('pay','nyc').url,/nyc.gov/);
assert.match(getSupportPath('pay','other').url,/lsc.gov/);
assert.throws(()=>getSupportPath('__proto__','nyc'));
assert.throws(()=>getSupportPath('health','unknown'));
console.log('PASS: eight routes, bilingual checklists, location-specific referrals and invalid selections.');
