const assert = require('node:assert/strict');
const fs = require('node:fs');
const A = require('./steady-avatar.js');
// Round trips, including every value of every part.
for (const [key, count] of A.FIELDS) for (let value = 0; value < count; value++) {
  const character = { ...A.defaults(), [key]: value };
  const code = A.encode(character);
  assert.ok(A.isCharacter(code), code);
  assert.deepEqual(A.decode(code), character);
  const drawn = A.svg(code);
  assert.ok(drawn.startsWith('<svg') && drawn.endsWith('</svg>'));
  assert.ok(!/undefined|NaN/.test(drawn), `${key}=${value} draws badly`);
}
for (let i = 0; i < 300; i++) assert.ok(!/undefined|NaN/.test(A.svg(A.encode(A.random()))));
// Codes from other people can't inject anything or break the page.
const evil = '<img src=x onerror=alert(1)>';
assert.ok(!A.html(evil).includes('<img'));
assert.equal(A.html('🌻'), '🌻');
assert.equal(A.isCharacter(`c1.${'0'.repeat(A.FIELDS.length - 1)}<`), false);
assert.deepEqual(A.decode(`c1.${'z'.repeat(A.FIELDS.length)}`), A.defaults());
assert.deepEqual(A.decode('nonsense'), A.defaults());
assert.equal(A.workLabel('🌻'), '');
assert.equal(A.workLabel(A.encode({ ...A.defaults(), work: 1 })), 'Delivery');
// The database rule must allow exactly the same codes.
const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
assert.ok(schema.includes(`^c1\\.[0-9a-z]{${A.FIELDS.length}}$`), 'schema avatar rule is out of date');
console.log('PASS: every character part draws, codes round trip, and bad codes are safe.');
