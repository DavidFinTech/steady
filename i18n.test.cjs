const assert = require('node:assert/strict');
const fs = require('node:fs');
const { DICTIONARY, LANGUAGES } = require('./steady-i18n.js');
const { STEADY_PATHS } = require('./support-navigator.js');
const codes = LANGUAGES.map(([code]) => code).filter(code => code !== 'en');
assert.equal(LANGUAGES.length, 6);
for (const [key, value] of Object.entries(DICTIONARY)) for (const code of codes) assert.ok(value[code], `${key} is missing ${code}`);
const used = new Set();
for (const file of ['index.html', 'planner.html']) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/data-(?:i18n(?:-aria)?|title)="([^"]+)"/g)) used.add(match[1].replace(/&amp;/g, '&'));
}
for (const path of Object.values(STEADY_PATHS)) {
  used.add(path.title); used.add(path.source); path.steps.forEach(step => used.add(step));
  if (path.outside) used.add(path.outside[0]);
}
for (const file of ['steady-experience.js', 'resource-tax-calculator.js', 'weekly-planner.js', 'support-navigator.js']) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/(?:label|title|line|cta): (['"])(.+?)\1/g)) if (!/^path\./.test(match[2])) used.add(match[2]);
  for (const match of source.matchAll(/\bt\((['"])(.+?)\1\)/g)) used.add(match[2]);
}
const missing = [...used].filter(key => !DICTIONARY[key]);
assert.deepEqual(missing, []);
const community = {};
global.window = community;
require('./community-i18n.js');
for (const [key, value] of Object.entries(community.COMMUNITY_I18N)) for (const code of ['es', 'zh-Hans', 'hi', 'bn', 'ur']) assert.ok(value[code], `community: ${key} is missing ${code}`);
console.log(`PASS: ${used.size} strings used; every string has all six languages.`);
