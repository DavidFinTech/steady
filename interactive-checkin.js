(() => {
  const storageKey = 'steady-next-step';
  const choices = [...document.querySelectorAll('[data-next-step-choice]')];
  const result = document.getElementById('next-step-result');
  const reset = document.getElementById('next-step-reset');
  const heading = document.getElementById('next-step-heading');
  const intro = heading.nextElementSibling;
  const choiceGroup = document.querySelector('.next-step-choices');
  const copy = {
    en: {
      eyebrow: 'A QUICK CHECK-IN',
      heading: 'What would make this week feel steadier?',
      intro: 'Choose one place to begin. We’ll point you to a useful next step and remember it on this device.',
      group: 'Choose your priority',
      reset: 'Choose a different priority',
      choices: { taxes: 'Plan for taxes', health: 'Find health care', rights: 'Protect my pay' },
      messages: {
        taxes: ['YOUR NEXT STEP', 'Give your tax plan a number.', 'Start with your expected income and expenses. You’ll get an annual estimate and a monthly amount to set aside.', '#tax', 'Open the tax calculator'],
        health: ['YOUR NEXT STEP', 'Find the care path that fits.', 'Compare Marketplace coverage, Medicaid and CHIP, and nearby community health centers in one place.', '#health', 'Explore health options'],
        rights: ['YOUR NEXT STEP', 'Protect the work you have done.', 'Review payment and classification resources, then keep the records that support your next conversation.', '#legal', 'Review your rights']
      }
    },
    es: {
      eyebrow: 'UN MOMENTO RÁPIDO',
      heading: '¿Qué haría que esta semana se sienta más estable?',
      intro: 'Elige un punto de partida. Te mostraremos un siguiente paso útil y lo recordaremos en este dispositivo.',
      group: 'Elige tu prioridad',
      reset: 'Elegir otra prioridad',
      choices: { taxes: 'Planificar impuestos', health: 'Encontrar atención médica', rights: 'Proteger mi pago' },
      messages: {
        taxes: ['TU SIGUIENTE PASO', 'Dale una cifra a tu plan de impuestos.', 'Comienza con tus ingresos y gastos esperados. Recibirás una estimación anual y un monto mensual para reservar.', '#tax', 'Abrir la calculadora de impuestos'],
        health: ['TU SIGUIENTE PASO', 'Encuentra la ruta de atención que te conviene.', 'Compara cobertura del Mercado, Medicaid, CHIP y centros de salud comunitarios cercanos en un solo lugar.', '#health', 'Explorar opciones de salud'],
        rights: ['TU SIGUIENTE PASO', 'Protege el trabajo que ya hiciste.', 'Revisa recursos sobre pago y clasificación laboral, y conserva los registros que te ayudarán en tu próxima conversación.', '#legal', 'Revisar mis derechos']
      }
    }
  };
  const language = () => document.documentElement.lang === 'es' ? 'es' : 'en';
  const show = choice => {
    const item = copy[language()].messages[choice];
    if (!item) return;
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.nextStepChoice === choice)));
    result.innerHTML = '<span class="eyebrow">' + item[0] + '</span><h3>' + item[1] + '</h3><p>' + item[2] + '</p><a class="button small" href="' + item[3] + '">' + item[4] + ' <span>↗</span></a>';
    result.hidden = false;
    reset.hidden = false;
    try { localStorage.setItem(storageKey, choice); } catch (_) {}
  };
  const render = () => {
    const text = copy[language()];
    const active = choices.find(button => button.getAttribute('aria-pressed') === 'true');
    document.querySelector('.next-step-checkin > div > .eyebrow').textContent = text.eyebrow;
    heading.textContent = text.heading;
    intro.textContent = text.intro;
    choiceGroup.setAttribute('aria-label', text.group);
    choices.forEach(button => {
      const icon = button.querySelector('span').outerHTML;
      button.innerHTML = icon + text.choices[button.dataset.nextStepChoice];
    });
    reset.textContent = text.reset;
    if (active) show(active.dataset.nextStepChoice);
  };
  choices.forEach(button => button.addEventListener('click', () => show(button.dataset.nextStepChoice)));
  reset.addEventListener('click', () => {
    choices.forEach(button => button.setAttribute('aria-pressed', 'false'));
    result.hidden = true;
    reset.hidden = true;
    try { localStorage.removeItem(storageKey); } catch (_) {}
  });
  window.addEventListener('steady-language-change', render);
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) show(saved);
  } catch (_) {}
  render();
})();