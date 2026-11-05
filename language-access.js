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
  const render = () => {
    const language = document.documentElement.lang === 'es' ? 'es' : 'en';
    const text = copy[language];
    title.textContent = text.title;
    description.textContent = text.description;
    note.textContent = text.note;
    localButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.localLanguage === language)));
  };
  localButtons.forEach(button => button.addEventListener('click', () => {
    const target = button.dataset.localLanguage;
    if (target === (document.documentElement.lang === 'es' ? 'es' : 'en')) return;
    const toggle = document.querySelector('[data-language-toggle]');
    if (toggle) toggle.click();
  }));
  panel.querySelectorAll('[data-translate-language]').forEach(link => {
    const target = link.dataset.translateLanguage;
    const source = encodeURIComponent(location.href.split('#')[0]);
    link.href = 'https://translate.google.com/translate?sl=auto&tl=' + target + '&u=' + source;
  });
  window.addEventListener('steady-language-change', render);
  render();
})();