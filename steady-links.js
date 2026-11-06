// Keeps people in their language when they leave for an outside resource.
// Official translated pages open directly. Other sites get a reminder first.
(() => {
  const ACCESS_LANGUAGES = { es: 'es', bn: 'bn', ur: 'ur', 'zh-Hans': 'zh-hant' };
  const IRS_LANGUAGES = { es: 'es', 'zh-Hans': 'zh-hans' };
  const GOOGLE_LANGUAGES = { es: 'es', 'zh-Hans': 'zh-CN', bn: 'bn', ur: 'ur', hi: 'hi' };
  const DCWP = 'https://www.nyc.gov/site/dca/workers/workersrights/';
  const DCWP_PDF = 'https://www.nyc.gov/assets/dca/downloads/pdf/workers/Protecting-Freelance-Workers-';
  // Each of these translated pages was checked by opening it, November 2026.
  const EXACT = {
    [`${DCWP}Delivery-Workers.page`]: {
      es: `${DCWP}delivery-worker-rights-spanish.page`,
      'zh-Hans': `${DCWP}delivery-worker-rights-simplified-chinese.page`,
      bn: `${DCWP}delivery-worker-rights-bengali.page`,
      ur: `${DCWP}delivery-worker-rights-urdu.page`
    },
    [`${DCWP}freelancer-workers.page`]: {
      es: `${DCWP_PDF}Spanish.pdf`,
      'zh-Hans': `${DCWP_PDF}Chinese.pdf`,
      bn: `${DCWP_PDF}Bengali.pdf`,
      ur: `${DCWP_PDF}Urdu.pdf`,
      hi: `${DCWP_PDF}Hindi.pdf`
    },
    'https://www.healthcare.gov/self-employed/coverage/': { es: 'https://www.cuidadodesalud.gov/es/self-employed/coverage/' },
    'https://www.healthcare.gov/medicaid-chip/': { es: 'https://www.cuidadodesalud.gov/es/medicaid-chip/' },
    'https://www.lawhelpny.org/': { es: 'https://www.lawhelpny.org/es' }
  };
  const IRS_PAGES = new Set([
    'https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers',
    'https://www.irs.gov/filing/free-file-do-your-federal-taxes-for-free',
    'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes'
  ]);

  function translatedUrl(url, language) {
    if (EXACT[url]?.[language]) return EXACT[url][language];
    if (url.startsWith('https://access.nyc.gov/programs/') && ACCESS_LANGUAGES[language]) {
      return url.replace('https://access.nyc.gov/', `https://access.nyc.gov/${ACCESS_LANGUAGES[language]}/`);
    }
    if (IRS_PAGES.has(url) && IRS_LANGUAGES[language]) {
      return url.replace('https://www.irs.gov/', `https://www.irs.gov/${IRS_LANGUAGES[language]}/`);
    }
    return null;
  }
  const googleTranslateUrl = (url, language) => `https://translate.google.com/translate?sl=en&tl=${GOOGLE_LANGUAGES[language]}&u=${encodeURIComponent(url)}`;

  if (typeof module !== 'undefined') module.exports = { translatedUrl, googleTranslateUrl, EXACT, GOOGLE_LANGUAGES };
  if (typeof document === 'undefined') return;

  const t = text => window.STEADY?.t(text) ?? (window.COMMUNITY_I18N?.[text]?.[document.documentElement.lang] || text);
  let sheet;
  function showReminder(url, language) {
    if (!sheet) {
      sheet = document.createElement('dialog');
      sheet.id = 'lang-sheet';
      document.body.append(sheet);
    }
    const flag = document.querySelector('.lang-current .flag')?.outerHTML || '';
    sheet.innerHTML = `<div class="lang-sheet-head">${flag}<h2>${t('This page may open in English')}</h2></div>
      <p>${t('Look for a language menu at the top or bottom of the site.')}</p>
      <div class="lang-sheet-actions">
        <a class="button" href="${googleTranslateUrl(url, language)}" target="_blank" rel="noopener noreferrer" data-sheet-link>${t('Open with Google Translate')}</a>
        <a class="pill" href="${url}" target="_blank" rel="noopener noreferrer" data-steady-keep data-sheet-link><span>${t('Open as is')}</span></a>
        <button type="button" class="link" data-sheet-close>${t('Stay here')}</button>
      </div>
      <p class="fine">${t('Google Translate can make mistakes. Check important details, and don’t enter personal information on a translated page.')}</p>`;
    sheet.showModal();
    sheet.querySelector('.button').focus();
  }
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-sheet-close]')) { sheet.close(); return; }
    if (event.target.closest?.('[data-sheet-link]')) { setTimeout(() => sheet.close(), 0); return; }
    if (event.target === sheet) { sheet.close(); return; }
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const original = link.dataset.originalHref || link.href;
    if (!/^https?:/.test(original) || new URL(original).origin === location.origin) return;
    const language = document.documentElement.lang;
    link.dataset.originalHref = original;
    if (language === 'en') { link.href = original; return; }
    const translated = translatedUrl(original, language);
    if (translated) { link.href = translated; return; }
    link.href = original;
    event.preventDefault();
    showReminder(original, language);
  });
})();
