const assert = require('node:assert/strict');
const { checkDeliveryPay, DELIVERY_RATE } = require('./steady-tools-data.js');
assert.equal(DELIVERY_RATE, 22.13);
// DCWP's FAQ example: 10 trip hours means pay can't fall below $221.30.
assert.deepEqual(checkDeliveryPay(10, 180), { minimum: 221.3, short: 41.3, meets: false });
assert.deepEqual(checkDeliveryPay(10, 221.3), { minimum: 221.3, short: 0, meets: true });
assert.deepEqual(checkDeliveryPay(10, 300), { minimum: 221.3, short: 0, meets: true });
assert.deepEqual(checkDeliveryPay(0, 0), { minimum: 0, short: 0, meets: true });
assert.equal(checkDeliveryPay(0.25, 0).short, 5.53);
assert.equal(checkDeliveryPay(-1, 10), null);
assert.equal(checkDeliveryPay(NaN, 10), null);
assert.equal(checkDeliveryPay(10, Infinity), null);
console.log('PASS: delivery pay checker, including the DCWP example.');
