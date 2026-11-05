(() => {
  const panel = document.getElementById('language-access');
  if (!panel) return;
  const localButtons = [...panel.querySelectorAll('[data-local-language]')];
  const title = panel.querySelector('[data-language-access-title]');
  const description = panel.querySelector('[data-language-access-description]');
  const note = panel.querySelector('[data-language-access-note]');
  const copy = {
    en: {
      title: 'Choose your language',
      description: 'Start in the language that feels easiest. Tap a tile—no account needed.',
      note: 'English and Spanish are built into Steady. Other tiles open a machine-translated preview; confirm tax, health, and legal details with the original source.'
    },
    es: {
      title: 'Elige tu idioma',
      description: 'Empieza en el idioma que te resulte más fácil. Toca una opción; no necesitas una cuenta.',
      note: 'Inglés y español están integrados en Steady. Las otras opciones abren una vista traducida automáticamente; confirma los detalles fiscales, de salud y legales con la fuente original.'
    }
  };
  const selectedLanguage = () => {
    const translatedTo = new URLSearchParams(location.search).get('_x_tr_tl');
    if (translatedTo) return translatedTo;
    return document.documentElement.lang === 'es' ? 'es' : 'en';
  };
  const render = () => {
    const language = document.documentElement.lang === 'es' ? 'es' : 'en';
    const selected = selectedLanguage();
    const text = copy[language];
    title.textContent = text.title;
    description.textContent = text.description;
    note.textContent = text.note;
    panel.querySelectorAll('.language-tile').forEach(tile => {
      const code = tile.dataset.localLanguage || tile.dataset.translateLanguage;
      const active = code === selected;
      tile.classList.toggle('is-selected', active);
      if (tile.tagName === 'BUTTON') tile.setAttribute('aria-pressed', String(active));
      else tile.toggleAttribute('aria-current', active);
    });
  };
  localButtons.forEach(button => button.addEventListener('click', () => {
    const target = button.dataset.localLanguage;
    const destination = originalPageUrl() + '?lang=' + target;
    location.assign(destination);
  }));
  const originalPageUrl = () => {
    if (location.hostname === 'raw-githack-com.translate.goog') {
      return 'https://raw.githack.com' + location.pathname;
    }
    return location.origin + location.pathname;
  };
  panel.querySelectorAll('[data-translate-language]').forEach(link => {
    const target = link.dataset.translateLanguage;
    const source = encodeURIComponent(originalPageUrl());
    link.href = 'https://translate.google.com/translate?sl=auto&tl=' + target + '&u=' + source;
  });
  window.addEventListener('steady-language-change', render);
  render();
})();