(() => {
  const storageKey = 'steady-next-step';
  const choices = [...document.querySelectorAll('[data-next-step-choice]')];
  const result = document.getElementById('next-step-result');
  const reset = document.getElementById('next-step-reset');
  const messages = {
    taxes: {
      eyebrow: 'YOUR NEXT STEP',
      title: 'Give your tax plan a number.',
      body: 'Start with your expected income and expenses. You’ll get an annual estimate and a monthly amount to set aside.',
      href: '#tax',
      label: 'Open the tax calculator'
    },
    health: {
      eyebrow: 'YOUR NEXT STEP',
      title: 'Find the care path that fits.',
      body: 'Compare Marketplace coverage, Medicaid and CHIP, and nearby community health centers in one place.',
      href: '#health',
      label: 'Explore health options'
    },
    rights: {
      eyebrow: 'YOUR NEXT STEP',
      title: 'Protect the work you have done.',
      body: 'Review payment and classification resources, then keep the records that support your next conversation.',
      href: '#legal',
      label: 'Review your rights'
    }
  };

  const show = choice => {
    const item = messages[choice];
    if (!item) return;
    choices.forEach(button => {
      const active = button.dataset.nextStepChoice === choice;
      button.setAttribute('aria-pressed', String(active));
    });
    result.innerHTML = '<span class="eyebrow">' + item.eyebrow + '</span><h3>' + item.title + '</h3><p>' + item.body + '</p><a class="button small" href="' + item.href + '">' + item.label + ' <span>↗</span></a>';
    result.hidden = false;
    reset.hidden = false;
    try { localStorage.setItem(storageKey, choice); } catch (_) {}
  };

  choices.forEach(button => button.addEventListener('click', () => show(button.dataset.nextStepChoice)));
  reset.addEventListener('click', () => {
    choices.forEach(button => button.setAttribute('aria-pressed', 'false'));
    result.hidden = true;
    reset.hidden = true;
    try { localStorage.removeItem(storageKey); } catch (_) {}
  });

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) show(saved);
  } catch (_) {}
})();