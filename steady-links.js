// Keeps people in their language when they leave for an outside resource.
// Official translated pages open directly. Other sites open through Google Translate.
(() => {
  const ACCESS_LANGUAGES = { es: 'es', bn: 'bn', ar: 'ar', 'zh-Hans': 'zh-hant' };
  const IRS_LANGUAGES = { es: 'es', 'zh-Hans': 'zh-hans' };
  const GOOGLE_LANGUAGES = { es: 'es', 'zh-Hans': 'zh-CN', bn: 'bn', ar: 'ar', hi: 'hi' };
  const DCWP = 'https://www.nyc.gov/site/dca/workers/workersrights/';
  const DCWP_PDF = 'https://www.nyc.gov/assets/dca/downloads/pdf/workers/Protecting-Freelance-Workers-';
  // Each of these translated pages was checked by opening it, November 2026.
  const EXACT = {
    [`${DCWP}Delivery-Workers.page`]: {
      es: `${DCWP}delivery-worker-rights-spanish.page`,
      'zh-Hans': `${DCWP}delivery-worker-rights-simplified-chinese.page`,
      bn: `${DCWP}delivery-worker-rights-bengali.page`,
      ar: `${DCWP}delivery-worker-rights-arabic.page`
    },
    [`${DCWP}freelancer-workers.page`]: {
      es: `${DCWP_PDF}Spanish.pdf`,
      'zh-Hans': `${DCWP_PDF}Chinese.pdf`,
      bn: `${DCWP_PDF}Bengali.pdf`,
      ar: `${DCWP_PDF}Arabic.pdf`,
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
  const googleTranslateUrl = (url, language) => `https://translate.google.com/translate?sl=en&tl=${GOOGLE_LANGUAGES[language]}&hl=${GOOGLE_LANGUAGES[language]}&u=${encodeURIComponent(url)}`;

  if (typeof module !== 'undefined') module.exports = { translatedUrl, googleTranslateUrl, EXACT, GOOGLE_LANGUAGES };
  if (typeof document === 'undefined') return;

  // Swap the address as the link is clicked, so the page opens in the chosen language.
  const swap = event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const original = link.dataset.originalHref || link.href;
    if (!/^https?:/.test(original) || new URL(original).origin === location.origin) return;
    const language = document.documentElement.lang;
    link.dataset.originalHref = original;
    link.href = language === 'en' || !GOOGLE_LANGUAGES[language] ? original : (translatedUrl(original, language) || googleTranslateUrl(original, language));
  };
  // auxclick covers a middle-click that opens the link in a new tab.
  document.addEventListener('click', swap);
  document.addEventListener('auxclick', swap);
})();
