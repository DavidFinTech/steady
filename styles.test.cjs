const assert = require('node:assert/strict');
const fs = require('node:fs');
const css = fs.readFileSync('steady.css', 'utf8');
// Content must stay visible even if a browser delays or skips animation frames.
for (const name of ['rise', 'swap', 'settle']) {
  const rule = css.match(new RegExp(`@keyframes ${name}\\{.*\\}\\}`));
  assert.ok(rule, `${name} animation is missing`);
  assert.ok(!rule[0].includes('opacity'), `${name} must not hide content`);
}
assert.ok(!/\.reveal\{[^}]*opacity/.test(css), 'scroll reveals must not hide content');
assert.ok(!css.includes('::details-content'), 'details must open without depending on an animation');
console.log('PASS: content does not depend on animations to be visible.');
