const assert = require('node:assert/strict');
const { estimateTax, federalIncomeTax } = require('./resource-tax-calculator.js');
const { estimateTakeHome } = require('./steady-compare.js');
const near = (actual, expected, tolerance = 0.51) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not near ${expected}`);

// Sharing the bracket code didn't change the calculator's answer.
near(estimateTax(60000, 10000, 'single').total, 10461);
assert.equal(federalIncomeTax(0, false), 0);
assert.equal(federalIncomeTax(12400, false), 1240);
near(federalIncomeTax(15100, false), 1564);
assert.equal(federalIncomeTax(24800, true), 2480);

// W-2: $20 x 30 hours x 52 weeks = $31,200.
const w2 = estimateTakeHome({ type: 'w2', hourly: 20, hours: 30, weeklyCosts: 20 });
assert.equal(w2.gross, 31200);
near(w2.taxes, 31200 * 0.0765 + 1564);
near(w2.yearly, 31200 - 1040 - (31200 * 0.0765 + 1564));
near(w2.perHour, w2.weekly / 30, 0.001);

// 1099: tax comes from the same estimate the calculator uses, after expenses.
const gig = estimateTakeHome({ type: '1099', hourly: 28, hours: 30, weeklyCosts: 120 });
assert.equal(gig.gross, 43680);
near(gig.taxes, estimateTax(43680, 6240, 'single').total, 0.001);
near(gig.yearly, 43680 - 6240 - gig.taxes, 0.001);

// A 1099 worker pays both halves of payroll tax, so the same pay takes home less.
const sameW2 = estimateTakeHome({ type: 'w2', hourly: 25, hours: 40, weeklyCosts: 0 });
const same1099 = estimateTakeHome({ type: '1099', hourly: 25, hours: 40, weeklyCosts: 0 });
assert.ok(same1099.yearly < sameW2.yearly);

// High earners: wage cap and extra Medicare apply.
const high = estimateTakeHome({ type: 'w2', hourly: 150, hours: 40, weeklyCosts: 0 });
near(high.taxes, 184500 * 0.062 + 312000 * 0.0145 + 112000 * 0.009 + federalIncomeTax(312000 - 16100, false));

// Edge cases
assert.equal(estimateTakeHome({ type: 'w2', hourly: 20, hours: 0, weeklyCosts: 0 }).perHour, 0);
assert.ok(estimateTakeHome({ type: '1099', hourly: 5, hours: 10, weeklyCosts: 200 }).yearly < 0);
assert.equal(estimateTakeHome({ type: 'other', hourly: 20, hours: 10, weeklyCosts: 0 }), null);
assert.equal(estimateTakeHome({ type: 'w2', hourly: -1, hours: 10, weeklyCosts: 0 }), null);
assert.equal(estimateTakeHome({ type: 'w2', hourly: NaN, hours: 10, weeklyCosts: 0 }), null);
console.log('PASS: W-2 and 1099 take-home estimates, including shared tax brackets.');
