const assert = require('node:assert/strict');
const { translatedUrl, googleTranslateUrl } = require('./steady-links.js');
const { LANGUAGES } = require('./steady-i18n.js');
const DELIVERY = 'https://www.nyc.gov/site/dca/workers/workersrights/Delivery-Workers.page';
assert.match(translatedUrl(DELIVERY, 'bn'), /bengali/);
assert.match(translatedUrl(DELIVERY, 'zh-Hans'), /simplified-chinese/);
assert.equal(translatedUrl(DELIVERY, 'hi'), null);
assert.match(translatedUrl('https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page', 'hi'), /Hindi\.pdf$/);
assert.equal(translatedUrl('https://access.nyc.gov/programs/one-shot-deal/', 'ur'), 'https://access.nyc.gov/ur/programs/one-shot-deal/');
assert.equal(translatedUrl('https://access.nyc.gov/programs/one-shot-deal/', 'zh-Hans'), 'https://access.nyc.gov/zh-hant/programs/one-shot-deal/');
assert.equal(translatedUrl('https://access.nyc.gov/programs/one-shot-deal/', 'hi'), null);
assert.equal(translatedUrl('https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes', 'bn'), null);
assert.match(translatedUrl('https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes', 'zh-Hans'), /irs\.gov\/zh-hans\//);
assert.match(translatedUrl('https://www.healthcare.gov/medicaid-chip/', 'es'), /cuidadodesalud/);
assert.equal(translatedUrl('https://www.nybcf.org', 'es'), null);
// Every language can use the fallback, and URLs are encoded.
for (const [code] of LANGUAGES.filter(([value]) => value !== 'en')) {
  const url = googleTranslateUrl('https://www.nybcf.org/a?b=1', code);
  assert.ok(url.includes('u=https%3A%2F%2Fwww.nybcf.org%2Fa%3Fb%3D1'));
  assert.ok(!url.includes('undefined'));
}
console.log('PASS: translated resource links and Google Translate fallback.');
