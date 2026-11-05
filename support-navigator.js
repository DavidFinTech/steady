'use strict';
// Explicit resource routing, not a benefits eligibility assessment.
const STEADY_PATHS = {
  budget: {
    title: 'Plan an uneven week', source: 'Open the planner', url: 'planner.html#planner',
    steps: ["List this week's income and bills.", 'Try a lower-income week in the planner.', 'Pick one bill or date to review.']
  },
  tax: {
    title: 'Get your tax records together', source: 'IRS estimated tax guide', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes',
    steps: ['Gather income records and receipts.', 'Read the IRS guide. Note your questions.', 'Ask a tax preparer if you need help.']
  },
  health: {
    title: 'Find a starting point for coverage', source: 'NY State of Health helpers', url: 'https://nystateofhealth.ny.gov/agent/assistors?lang=en',
    outside: ['HealthCare.gov', 'https://www.healthcare.gov/self-employed/coverage/'],
    steps: ['Decide: insurance, care or both?', 'Open the official site. Ask about options.', 'Ask which documents and dates apply.']
  },
  pay: {
    title: 'Get ready to ask about unpaid work', source: 'NYC freelance worker rights', url: 'https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page',
    outside: ['Find legal aid', 'https://www.lsc.gov/about-lsc/what-legal-aid/i-need-legal-help'],
    steps: ['Collect contract, invoices and messages.', 'Write a timeline of work and payments.', 'Ask about help and deadlines.']
  }
};
function getSupportPath(need, location) {
  if (!Object.hasOwn(STEADY_PATHS, need) || !['nyc', 'other'].includes(location)) throw new Error('Choose a supported need and location.');
  const path = STEADY_PATHS[need];
  const away = location === 'other' && path.outside;
  return { ...path, source: away ? path.outside[0] : path.source, url: away ? path.outside[1] : path.url };
}
if (typeof module !== 'undefined') module.exports = { getSupportPath, STEADY_PATHS };
if (typeof document !== 'undefined') {
  const section = document.getElementById('next-step');
  const tiles = [...document.querySelectorAll('[data-need]')];
  if (section && tiles.length) {
    const t = text => window.STEADY.t(text);
    const stepList = section.querySelector('#plan-steps');
    const regions = [...section.querySelectorAll('[data-region]')];
    const ringValue = section.querySelector('.ring-value');
    let need = null, region = 'nyc', checked = new Set();

    function celebrate() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      for (let i = 0; i < 16; i++) {
        const star = document.createElement('span');
        star.className = 'burst'; star.textContent = '✳'; star.setAttribute('aria-hidden', 'true');
        const angle = (i / 16) * Math.PI * 2;
        star.style.setProperty('--x', Math.cos(angle) * (90 + Math.random() * 110) + 'px');
        star.style.setProperty('--y', Math.sin(angle) * (60 + Math.random() * 90) + 'px');
        section.querySelector('.plan-ring').append(star);
        star.addEventListener('animationend', () => star.remove());
      }
    }
    function paintProgress() {
      section.querySelector('#plan-count').textContent = `${checked.size}/3`;
      section.querySelector('#plan-status').textContent = checked.size === 3 ? t('All done. Nice work.') : t('{n} of 3 done').replace('{n}', checked.size);
      ringValue.style.strokeDashoffset = 100 - (checked.size / 3) * 100;
      section.classList.toggle('is-done', checked.size === 3);
    }
    function render() {
      if (!need) return;
      const path = getSupportPath(need, region);
      tiles.forEach(tile => tile.setAttribute('aria-pressed', String(tile.dataset.need === need)));
      regions.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.region === region)));
      section.querySelector('#plan-title').textContent = t(path.title);
      const action = section.querySelector('#plan-action');
      action.href = path.url;
      action.querySelector('span').textContent = t(path.source);
      stepList.innerHTML = path.steps.map((step, i) => `<label class="step"><input type="checkbox" data-step="${i}" ${checked.has(i) ? 'checked' : ''}><span class="step-mark" aria-hidden="true">${i + 1}</span><span class="step-text">${t(step)}</span></label>`).join('');
      paintProgress();
    }
    stepList.addEventListener('change', event => {
      const i = Number(event.target.dataset.step);
      event.target.checked ? checked.add(i) : checked.delete(i);
      const finished = checked.size === 3 && !section.classList.contains('is-done');
      paintProgress();
      if (finished) celebrate();
    });
    tiles.forEach(tile => tile.addEventListener('click', () => {
      if (tile.dataset.need !== need) checked.clear();
      need = tile.dataset.need;
      section.hidden = false;
      render();
      section.scrollIntoView();
      section.querySelector('#plan-title').focus({ preventScroll: true });
    }));
    regions.forEach(button => button.addEventListener('click', () => {
      if (button.dataset.region !== region) checked.clear();
      region = button.dataset.region;
      render();
    }));
    section.querySelector('#plan-print').addEventListener('click', () => window.print());
    section.querySelector('#plan-reset').addEventListener('click', () => {
      const tile = tiles.find(item => item.dataset.need === need);
      need = null; checked.clear(); section.hidden = true;
      tiles.forEach(item => item.setAttribute('aria-pressed', 'false'));
      tile.focus();
    });
    window.addEventListener('steady-language-change', render);
  }
}
