// Interactive rights, money and health tools. Nothing entered here leaves the browser or is saved.
(() => {
  const { RIGHTS, COVERAGE, POVERTY_BASE, POVERTY_PER_PERSON, OPEN_ENROLLMENT_ENDS, URLS, checkDeliveryPay } = window.STEADY_TOOLS;
  const t = text => window.STEADY.t(text);
  const icon = name => window.steadyIcon(name);
  const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const $ = id => document.getElementById(id);
  const money2 = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const fill = range => {
    const min = Number(range.min), span = Number(range.max) - min;
    range.style.setProperty('--fill', `${((Number(range.value) - min) / span) * 100}%`);
  };
  const pill = (label, url, strong) => `<a class="pill${strong ? ' pill-strong' : ''}" href="${url}"><span>${e(t(label))}</span>${icon('arrow')}</a>`;

  // Section tabs
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const buttons = [...group.querySelectorAll('[data-tab]')];
    const select = name => {
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tab === name)));
      document.querySelectorAll(`[data-panel-of="${group.dataset.tabs}"]`).forEach(panel => { panel.hidden = panel.dataset.panel !== name; });
    };
    group.addEventListener('click', event => {
      const button = event.target.closest('[data-tab]');
      if (button) select(button.dataset.tab);
    });
    buttons.forEach(button => { if (location.hash === `#${button.dataset.tab}`) { select(button.dataset.tab); group.closest('section').scrollIntoView(); } });
  });
  document.querySelectorAll('[data-go-tab]').forEach(link => link.addEventListener('click', () => {
    document.querySelector(`[data-tab="${link.dataset.goTab}"]`).click();
  }));

  // Income swings
  const swing = $('swing-tool');
  if (swing) {
    const weeks = [850, 620, 1100, 480];
    function drawSwingInputs() {
      swing.querySelector('.sliders').innerHTML = weeks.map((value, i) => `<div class="slider"><label for="week-${i}">${e(t('Week {n}').replace('{n}', i + 1))}</label><div class="money-field"><span>$</span><input id="week-${i}" type="number" inputmode="numeric" min="0" max="20000" value="${value}" data-week="${i}" dir="ltr"></div><input type="range" min="0" max="3000" step="10" value="${Math.min(value, 3000)}" data-week-range="${i}" aria-labelledby="week-label-${i}"><span id="week-label-${i}" class="visually-hidden">${e(t('Week {n}').replace('{n}', i + 1))}</span></div>`).join('');
      swing.querySelectorAll('input[type="range"]').forEach(fill);
    }
    function paintSwing() {
      const low = Math.min(...weeks), high = Math.max(...weeks);
      const average = weeks.reduce((sum, value) => sum + value, 0) / weeks.length;
      $('swing-low').textContent = money(low);
      $('swing-average').textContent = money(average);
      $('swing-high').textContent = money(high);
      $('swing-cushion').textContent = money(average - low);
      const top = Math.max(high, 1);
      $('swing-bars').innerHTML = weeks.map(value => `<i class="${value === low ? 'is-low' : ''}" style="height:${Math.max(4, (value / top) * 100)}%"></i>`).join('');
    }
    swing.addEventListener('input', event => {
      const target = event.target;
      const i = Number(target.dataset.week ?? target.dataset.weekRange);
      if (Number.isNaN(i)) return;
      const value = Math.max(0, Math.min(20000, Number(target.value) || 0));
      weeks[i] = value;
      if (target.type === 'range') swing.querySelector(`[data-week="${i}"]`).value = value;
      else swing.querySelector(`[data-week-range="${i}"]`).value = Math.min(value, 3000);
      fill(swing.querySelector(`[data-week-range="${i}"]`));
      paintSwing();
    });
    window.addEventListener('steady-language-change', () => { drawSwingInputs(); paintSwing(); });
    drawSwingInputs();
    paintSwing();
  }

  // Take-home comparer
  const compare = $('compare-tool');
  if (compare) {
    const gigs = [
      { name: 'Gig A', type: 'w2', hourly: 20, hours: 30, weeklyCosts: 20 },
      { name: 'Gig B', type: '1099', hourly: 28, hours: 30, weeklyCosts: 120 }
    ];
    const FIELDS = [
      { key: 'hourly', label: 'Pay per hour, with tips', prefix: '$', max: 80, step: 0.5 },
      { key: 'hours', label: 'Hours per week', prefix: '', max: 60, step: 1 },
      { key: 'weeklyCosts', label: 'Weekly costs', prefix: '$', max: 500, step: 5, hint: 'Gas, phone, gear, commute' }
    ];
    const results = () => gigs.map(gig => window.estimateTakeHome(gig));
    function drawCompare() {
      compare.querySelector('.compare-grid').innerHTML = gigs.map((gig, g) => `<article class="compare-card">
        <h3>${e(t(gig.name))}</h3>
        <div class="segmented on-dark compare-type" role="group" data-i18n-group>
          <button type="button" data-gig="${g}" data-type="w2" aria-pressed="${gig.type === 'w2'}">${e(t('W-2 (taxes withheld)'))}</button>
          <button type="button" data-gig="${g}" data-type="1099" aria-pressed="${gig.type === '1099'}">${e(t('1099 (you pay taxes)'))}</button>
        </div>
        ${FIELDS.map(field => `<div class="slider compact"><label for="gig-${g}-${field.key}">${e(t(field.label))}</label>${field.hint ? `<small>${e(t(field.hint))}</small>` : ''}<div class="money-field">${field.prefix ? `<span>${field.prefix}</span>` : ''}<input id="gig-${g}-${field.key}" type="number" inputmode="decimal" min="0" step="${field.step}" value="${gig[field.key]}" data-gig="${g}" data-field="${field.key}" dir="ltr"></div><input type="range" min="0" max="${field.max}" step="${field.step}" value="${Math.min(gig[field.key], field.max)}" data-gig="${g}" data-range="${field.key}" aria-label="${e(t(field.label))}"></div>`).join('')}
        <div class="compare-result"><div class="compare-amount num" id="gig-${g}-hour"></div><span>${e(t('take-home an hour'))}</span><p class="tax-sub" id="gig-${g}-week"></p><dl class="rows"><div><dt>${e(t('Estimated taxes'))}</dt><dd class="num" id="gig-${g}-tax"></dd></div></dl></div>
      </article>`).join('');
      compare.querySelectorAll('input[type="range"]').forEach(fill);
      paintCompare();
    }
    function paintCompare() {
      const [first, second] = results();
      [first, second].forEach((result, g) => {
        const money2Week = money(result ? result.weekly : 0);
        $(`gig-${g}-hour`).textContent = result ? money2(result.perHour) : '—';
        $(`gig-${g}-week`).textContent = result ? t('{amount} a week').replace('{amount}', money2Week) : '—';
        $(`gig-${g}-tax`).textContent = result ? money(result.taxes / 52) : '—';
      });
      compare.querySelectorAll('.compare-card').forEach((card, g) => {
        const other = g === 0 ? second : first, own = g === 0 ? first : second;
        card.classList.toggle('is-best', Boolean(own && other && own.perHour - other.perHour >= 0.005));
      });
      const verdict = $('compare-verdict');
      if (!first || !second) { verdict.textContent = ''; return; }
      const gap = Math.abs(first.perHour - second.perHour);
      if (gap < 0.25) { verdict.textContent = t('They take home about the same'); return; }
      const winner = first.perHour > second.perHour ? gigs[0] : gigs[1];
      verdict.textContent = t('{name} takes home {amount} more an hour').replace('{name}', t(winner.name)).replace('{amount}', money2(gap));
    }
    compare.addEventListener('click', event => {
      const button = event.target.closest('[data-type]');
      if (!button) return;
      gigs[Number(button.dataset.gig)].type = button.dataset.type;
      compare.querySelectorAll(`[data-gig="${button.dataset.gig}"][data-type]`).forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      paintCompare();
    });
    compare.addEventListener('input', event => {
      const target = event.target;
      const g = Number(target.dataset.gig);
      const key = target.dataset.field || target.dataset.range;
      if (!key) return;
      const value = target.value === '' ? NaN : Number(target.value);
      gigs[g][key] = Number.isNaN(value) ? NaN : value;
      if (target.dataset.range) compare.querySelector(`[data-gig="${g}"][data-field="${key}"]`).value = target.value;
      else if (!Number.isNaN(value)) compare.querySelector(`[data-gig="${g}"][data-range="${key}"]`).value = value;
      fill(compare.querySelector(`[data-gig="${g}"][data-range="${key}"]`));
      paintCompare();
    });
    window.addEventListener('steady-language-change', drawCompare);
    drawCompare();
  }

  // Next estimated tax payment. A weekend due date moves to the next weekday.
  function nextDueDate(today = new Date()) {
    const year = today.getFullYear();
    const dates = [[year, 0, 15], [year, 3, 15], [year, 5, 15], [year, 8, 15], [year + 1, 0, 15]].map(([y, m, d]) => {
      const date = new Date(y, m, d);
      while (date.getDay() === 0 || date.getDay() === 6) date.setDate(date.getDate() + 1);
      return date;
    });
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dates.find(date => date >= start);
  }
  let yearlyTax = null;
  function paintDue() {
    const box = $('next-payment');
    if (!box) return;
    const due = nextDueDate();
    const days = Math.round((due - new Date(new Date().setHours(0, 0, 0, 0))) / 86400000);
    $('due-date').textContent = new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: 'long' }).format(due);
    $('due-days').textContent = t('{n} days').replace('{n}', days);
    $('due-amount').textContent = yearlyTax === null ? '—' : t('About {amount} per payment').replace('{amount}', money(yearlyTax / 4));
  }
  window.addEventListener('steady-tax-result', event => { yearlyTax = event.detail.total; paintDue(); });
  window.addEventListener('steady-language-change', paintDue);
  paintDue();
  const addMiles = $('add-miles');
  if (addMiles) {
    addMiles.addEventListener('click', () => {
      const miles = Math.max(0, Number($('miles').value) || 0);
      if (!miles) return;
      const costs = $('costs');
      costs.value = Math.round((Number(costs.value) || 0) + miles * 0.725);
      costs.dispatchEvent(new Event('input', { bubbles: true }));
      $('miles').value = '';
    });
  }

  // Rights finder
  const finder = $('rights-finder');
  if (finder) {
    let role = null, issue = null, proofDone = new Set();
    let note = { company: '', when: '', amount: '', what: '' }, overdue = { amount: '', due: '' };
    function overdueText() {
      const amount = Number(overdue.amount);
      if (!overdue.due || !(amount > 0)) return '';
      const days = Math.floor((Date.now() - new Date(`${overdue.due}T00:00:00`).getTime()) / 86400000);
      if (days <= 0) return e(t('Not late yet.'));
      return `<b class="num">${e(t('{n} days late').replace('{n}', days))}</b><span>${e(t('Double would be {amount}.').replace('{amount}', money(amount * 2)))}</span>`;
    }
    function draw(focusSelector, scroll) {
      const roleData = RIGHTS[role];
      const result = roleData?.issues[issue];
      let html = `<h3 class="finder-q">${e(t('How do you work?'))}</h3><div class="finder-grid">${Object.entries(RIGHTS).map(([key, item]) => `<button type="button" data-role="${key}" aria-pressed="${key === role}">${icon(item.icon)}<span>${e(t(item.label))}</span></button>`).join('')}</div>`;
      if (roleData) {
        html += `<h3 class="finder-q">${e(t('What happened?'))}</h3><div class="finder-grid">${Object.entries(roleData.issues).map(([key, item]) => `<button type="button" data-issue="${key}" aria-pressed="${key === issue}">${icon(item.icon)}<span>${e(t(item.label))}</span></button>`).join('')}</div>`;
      }
      if (result) {
        html += `<article class="rights-result" id="rights-result" tabindex="-1">
          <h3>${e(t(result.title))}</h3><p class="rights-line">${e(t(result.line))}</p>
          ${roleData.anyStatus ? `<p class="status-note">${icon('shield')}<span>${e(t('These rights apply regardless of immigration status.'))}</span></p>` : ''}
          <div class="rights-actions">${pill(result.cta, result.url, true)}${(result.more || []).map(link => pill(link.label, link.url)).join('')}</div>
          ${result.overdue ? `<div class="overdue"><h4>${e(t('How late is it?'))}</h4><div class="note-fields"><label>${e(t('Amount owed'))}<input type="number" min="0" inputmode="decimal" data-overdue="amount" value="${e(overdue.amount)}" dir="ltr"></label><label>${e(t('Payment was due'))}<input type="date" data-overdue="due" value="${e(overdue.due)}" dir="ltr"></label></div><p class="overdue-result" id="overdue-result" aria-live="polite">${overdueText()}</p></div>` : ''}
          <h4>${e(t('Keep this proof'))}</h4><div class="proof-grid">${result.proof.map((item, i) => `<label><input type="checkbox" data-proof="${i}" ${proofDone.has(i) ? 'checked' : ''}><span>${e(t(item))}</span></label>`).join('')}</div>
          ${result.note ? `<details class="case-note"><summary><span>${e(t('Build a case note'))}</span></summary><div class="note-fields"><label>${e(t('Company or client'))}<input data-note="company" maxlength="120" value="${e(note.company)}"></label><label>${e(t('When it happened'))}<input type="date" data-note="when" value="${e(note.when)}" dir="ltr"></label><label>${e(t('Amount, if any'))}<input type="number" min="0" inputmode="decimal" data-note="amount" value="${e(note.amount)}" dir="ltr"></label></div><label>${e(t('What happened'))}<textarea data-note="what" maxlength="1500">${e(note.what)}</textarea></label><button type="button" class="pill" id="copy-note"><span>${e(t('Copy note'))}</span></button><p class="fine">${e(t('Not saved or sent. Paste it somewhere safe.'))}</p></details>` : ''}
          <p class="fine">${e(t('General information, not legal advice.'))}</p>
        </article>`;
      }
      finder.innerHTML = html;
      if (focusSelector) finder.querySelector(focusSelector)?.focus();
      if (scroll && result) finder.querySelector('#rights-result').scrollIntoView({ block: 'nearest' });
    }
    finder.addEventListener('click', async event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.role) {
        role = button.dataset.role; issue = null; proofDone = new Set();
        draw(`[data-role="${role}"]`);
      } else if (button.dataset.issue) {
        issue = button.dataset.issue; proofDone = new Set();
        draw(`[data-issue="${issue}"]`, true);
      } else if (button.id === 'copy-note') {
        const result = RIGHTS[role].issues[issue];
        const text = [t(result.label), `${t('Company or client')}: ${note.company}`, `${t('When it happened')}: ${note.when}`, `${t('Amount, if any')}: ${note.amount}`, `${t('What happened')}: ${note.what}`].join('\n');
        const label = button.querySelector('span');
        try {
          await navigator.clipboard.writeText(text);
          label.textContent = t('Copied');
        } catch (_) {
          finder.querySelector('[data-note="what"]').select();
        }
      }
    });
    finder.addEventListener('input', event => {
      const { note: noteKey, overdue: overdueKey, proof } = event.target.dataset;
      if (noteKey) note[noteKey] = event.target.value;
      if (overdueKey) { overdue[overdueKey] = event.target.value; $('overdue-result').innerHTML = overdueText(); }
      if (proof !== undefined) { event.target.checked ? proofDone.add(Number(proof)) : proofDone.delete(Number(proof)); }
    });
    window.STEADY.openRights = (nextRole, nextIssue, noteFields = {}) => {
      document.querySelector('[data-tab="happened"]').click();
      role = nextRole; issue = nextIssue; proofDone = new Set();
      note = { ...note, ...noteFields };
      draw();
      const details = finder.querySelector('.case-note');
      if (details && Object.keys(noteFields).length) details.open = true;
      finder.querySelector('#rights-result').scrollIntoView();
      finder.querySelector('#rights-result').focus({ preventScroll: true });
    };
    window.addEventListener('steady-language-change', () => draw());
    draw();
  }

  // Pay checker
  const payTool = $('pay-tool');
  if (payTool) {
    let kind = 'delivery';
    const hours = $('trip-hours'), hoursRange = $('trip-hours-range'), pay = $('pay-before-tips'), payRange = $('pay-range');
    const hoursText = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
    function paintPay() {
      payTool.querySelectorAll('[data-pay-kind]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.payKind === kind)));
      payTool.querySelectorAll('[data-pay-view]').forEach(view => { view.hidden = view.dataset.payView !== kind; });
      fill(hoursRange);
      fill(payRange);
      const answer = $('pay-answer');
      const result = hours.value === '' || pay.value === '' ? null : checkDeliveryPay(Number(hours.value), Number(pay.value));
      answer.hidden = !result;
      if (!result) { $('pay-actions').hidden = true; return; }
      answer.classList.toggle('is-short', !result.meets);
      answer.classList.toggle('is-ok', result.meets);
      $('pay-label').textContent = t(result.meets ? 'Meets the minimum' : 'Looks short by');
      $('pay-amount').textContent = result.meets ? '✓' : money2(result.short);
      $('pay-minimum').textContent = money2(result.minimum);
      $('pay-entered').textContent = money2(Number(pay.value));
      $('pay-actions').hidden = result.meets;
    }
    payTool.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.payKind) { kind = button.dataset.payKind; paintPay(); }
      if (button.id === 'pay-note') {
        const result = checkDeliveryPay(Number(hours.value), Number(pay.value));
        window.STEADY.openRights('delivery', 'lowpay', {
          amount: String(result.short),
          what: t('Pay looks short by {amount} for {hours} trip hours.').replace('{amount}', money2(result.short)).replace('{hours}', hoursText(hours.value))
        });
      }
      if (button.id === 'pay-late') window.STEADY.openRights('freelance', 'unpaid');
    });
    hours.addEventListener('input', () => { hoursRange.value = Math.min(Number(hoursRange.max), Number(hours.value) || 0); paintPay(); });
    hoursRange.addEventListener('input', () => { hours.value = hoursRange.value; paintPay(); });
    pay.addEventListener('input', () => { payRange.value = Math.min(Number(payRange.max), Number(pay.value) || 0); paintPay(); });
    payRange.addEventListener('input', () => { pay.value = payRange.value; paintPay(); });
    window.addEventListener('steady-language-change', paintPay);
    paintPay();
  }

  // Health coverage finder
  const coverage = $('coverage-tool');
  if (coverage) {
    let people = 1;
    const income = $('coverage-income'), range = $('coverage-range');
    function paintCoverage() {
      const amount = Math.max(0, Number(income.value) || 0);
      const percent = (amount / (POVERTY_BASE + POVERTY_PER_PERSON * (people - 1))) * 100;
      const match = COVERAGE.find(item => percent <= item.upTo);
      $('people-count').textContent = people;
      $('coverage-zones').innerHTML = COVERAGE.map(item => `<span class="${item === match ? 'is-on' : ''}">${e(t(item.label))}</span>`).join('');
      $('coverage-result').innerHTML = `<h3>${e(t(match.title))}</h3><p>${e(t(match.line))}</p><div class="rights-actions">${pill('NY State of Health', window.STEADY_TOOLS.URLS.nyHealth, true)}${pill('Free application help', window.STEADY_TOOLS.URLS.assistors)}</div>`;
      const ends = new Date(`${OPEN_ENROLLMENT_ENDS}T23:59:59`);
      $('enroll-note').hidden = new Date() > ends;
      fill(range);
    }
    coverage.addEventListener('click', event => {
      const step = Number(event.target.closest('[data-people]')?.dataset.people);
      if (!step) return;
      people = Math.max(1, Math.min(12, people + step));
      paintCoverage();
    });
    income.addEventListener('input', () => { range.value = Math.min(Number(range.max), Number(income.value) || 0); paintCoverage(); });
    range.addEventListener('input', () => { income.value = range.value; paintCoverage(); });
    window.addEventListener('steady-language-change', paintCoverage);
    paintCoverage();
  }
})();
