// Interactive layer: everything here is added on top of the page, so the site
// still works if this script does not load.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById(id);
  const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  const STRINGS = {
    "What's on your mind?": { es: '¿Qué tienes en mente?', 'zh-Hans': '您现在最关心什么？', hi: 'आपके मन में क्या है?' },
    'Plan my week': { es: 'Planificar mi semana', 'zh-Hans': '规划我的一周', hi: 'मेरे सप्ताह की योजना' },
    'Prepare for taxes': { es: 'Prepararme para impuestos', 'zh-Hans': '准备报税', hi: 'करों की तैयारी' },
    'Find health coverage': { es: 'Buscar cobertura médica', 'zh-Hans': '寻找医疗保险', hi: 'स्वास्थ्य कवरेज खोजें' },
    'Address unpaid work': { es: 'Consultar un pago pendiente', 'zh-Hans': '处理未付款工作', hi: 'अवैतनिक काम का समाधान' },
    'WHERE YOUR REVENUE GOES': { es: 'A DÓNDE VAN TUS INGRESOS', 'zh-Hans': '您的收入去向', hi: 'आपकी आमदनी कहाँ जाती है' },
    'Business expenses': { es: 'Gastos del negocio', 'zh-Hans': '业务支出', hi: 'व्यावसायिक खर्च' },
    'Federal income tax': { es: 'Impuesto federal sobre la renta', 'zh-Hans': '联邦所得税', hi: 'संघीय आयकर' },
    'Self-employment tax': { es: 'Impuesto por trabajo autónomo', 'zh-Hans': '自雇税', hi: 'स्व-रोज़गार कर' },
    'Additional Medicare tax': { es: 'Impuesto adicional de Medicare', 'zh-Hans': '附加医疗保险税', hi: 'अतिरिक्त मेडिकेयर कर' },
    'Left after federal tax': { es: 'Queda tras impuestos federales', 'zh-Hans': '缴纳联邦税后剩余', hi: 'संघीय कर के बाद शेष' },
    'About {n}% of your revenue goes to these federal taxes.': {
      es: 'Cerca del {n}% de tus ingresos se destina a estos impuestos federales.',
      'zh-Hans': '您的收入中约有 {n}% 用于这些联邦税。',
      hi: 'आपकी आमदनी का लगभग {n}% इन संघीय करों में जाता है।'
    },
    'WHERE THIS WEEK GOES': { es: 'A DÓNDE VA ESTA SEMANA', 'zh-Hans': '本周资金去向', hi: 'इस सप्ताह का पैसा कहाँ जाता है' },
    Essentials: { es: 'Gastos esenciales', 'zh-Hans': '基本开支', hi: 'ज़रूरी खर्च' },
    'Tax reserve': { es: 'Reserva para impuestos', 'zh-Hans': '税款储备', hi: 'कर आरक्षित' },
    Available: { es: 'Disponible', 'zh-Hans': '可用金额', hi: 'उपलब्ध' },
    Shortfall: { es: 'Déficit', 'zh-Hans': '缺口', hi: 'कमी' }
  };
  const t = text => {
    const language = document.documentElement.lang;
    return language === 'en' ? text : STRINGS[text]?.[language] || text;
  };

  function renderShare(host, title, segments, note = '') {
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    const visible = segments.filter(segment => segment.value > 0);
    const percent = value => (total ? Math.round((value / total) * 100) : 0);
    host.hidden = !total;
    if (!total) return;
    host.querySelector('.share-title').textContent = t(title);
    host.querySelector('.share-bar').innerHTML = visible
      .map(segment => `<i class="${segment.tone}" style="flex-grow:${segment.value}"></i>`)
      .join('');
    host.querySelector('.share-legend').innerHTML = visible
      .map(segment => `<li><i class="${segment.tone}"></i><span>${t(segment.label)}</span><b>${percent(segment.value)}%</b></li>`)
      .join('');
    host.querySelector('.share-note').textContent = note;
    host.querySelector('.share-note').hidden = !note;
  }
  function createShare() {
    const host = document.createElement('div');
    host.className = 'share';
    host.setAttribute('data-native-i18n', '');
    host.innerHTML = '<span class="eyebrow share-title"></span><div class="share-bar" aria-hidden="true"></div><ul class="share-legend"></ul><p class="share-note fine"></p>';
    return host;
  }

  // Header: reading progress and the current section.
  const header = document.querySelector('header');
  if (header) {
    const bar = document.createElement('span');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    header.append(bar);
    let queued = false;
    const paint = () => {
      queued = false;
      const room = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${room > 0 ? Math.min(1, scrollY / room) : 0})`;
      header.classList.toggle('is-scrolled', scrollY > 12);
    };
    addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    }, { passive: true });
    paint();
  }
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
  if (navLinks.length && 'IntersectionObserver' in window) {
    const watcher = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    navLinks.forEach(link => {
      const section = document.querySelector(link.hash);
      if (section) watcher.observe(section);
    });
  }

  // Hero: shortcuts into the checklist, and a card that follows the pointer.
  const actions = document.querySelector('.hero-actions');
  if (actions) {
    const shortcuts = document.createElement('div');
    shortcuts.className = 'hero-shortcuts';
    shortcuts.setAttribute('data-native-i18n', '');
    const needs = [['budget', 'Plan my week'], ['tax', 'Prepare for taxes'], ['health', 'Find health coverage'], ['pay', 'Address unpaid work']];
    const draw = () => {
      shortcuts.innerHTML = `<span class="hero-shortcuts-label">${t("What's on your mind?")}</span><div>${needs
        .map(([need, label]) => `<button type="button" data-need="${need}">${t(label)}</button>`)
        .join('')}</div>`;
    };
    draw();
    shortcuts.addEventListener('click', event => {
      const need = event.target.closest('[data-need]')?.dataset.need;
      if (need) window.steadyNavigator?.choose(need);
    });
    addEventListener('steady-language-change', draw);
    actions.after(shortcuts);
  }
  const heroArt = document.querySelector('.hero-art');
  const hero = document.querySelector('.hero');
  if (heroArt && hero && !reducedMotion && matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', event => {
      const box = hero.getBoundingClientRect();
      heroArt.style.setProperty('--tilt-x', ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
      heroArt.style.setProperty('--tilt-y', ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
    });
    hero.addEventListener('pointerleave', () => {
      heroArt.style.setProperty('--tilt-x', 0);
      heroArt.style.setProperty('--tilt-y', 0);
    });
  }

  // Cards: a soft light that follows the pointer.
  if (matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', event => {
      const card = event.target.closest?.('.cards article, .jump-grid > a');
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - box.left}px`);
      card.style.setProperty('--my', `${event.clientY - box.top}px`);
    }, { passive: true });
  }

  const fillRange = range => {
    const span = Number(range.max) - Number(range.min);
    range.style.setProperty('--fill', `${((Number(range.value) - Number(range.min)) / span) * 100}%`);
  };

  // Tax calculator: sliders, a counting total and a picture of the split.
  const form = $('tax-form');
  if (form && typeof estimateTax === 'function') {
    const total = $('total');
    const display = document.createElement('div');
    display.className = 'total total-display';
    display.setAttribute('aria-hidden', 'true');
    total.classList.add('visually-hidden');
    total.after(display);
    const share = createShare();
    document.querySelector('.result-caption').after(share);

    const sliders = [['revenue', 250000, 1000], ['costs', 100000, 500]].map(([id, max, step]) => {
      const input = $(id);
      const label = form.querySelector(`label[for="${id}"]`);
      label.id = `${id}-label`;
      const range = document.createElement('input');
      range.type = 'range';
      range.className = 'money-range';
      range.min = 0; range.max = max; range.step = step;
      range.value = input.value;
      range.setAttribute('aria-labelledby', label.id);
      input.parentElement.after(range);
      fillRange(range);
      range.addEventListener('input', () => {
        input.value = range.value;
        fillRange(range);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      input.addEventListener('input', () => {
        range.value = Math.min(max, Number(input.value) || 0);
        fillRange(range);
      });
      return { input, range, max };
    });

    let shownTotal = null;
    let frame = 0;
    const animateTotal = target => {
      cancelAnimationFrame(frame);
      if (reducedMotion || shownTotal === null) {
        shownTotal = target;
        display.textContent = money(target);
        return;
      }
      const from = shownTotal;
      const start = performance.now();
      const step = now => {
        const progress = Math.min(1, (now - start) / 420);
        shownTotal = from + (target - from) * (1 - (1 - progress) ** 3);
        display.textContent = money(shownTotal);
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    const refresh = () => {
      let result = null;
      if (form.checkValidity()) {
        try {
          result = estimateTax(Number(form.elements.revenue.value), Number(form.elements.costs.value), form.elements.filing.value);
        } catch (_) { /* the calculator shows its own error */ }
      }
      if (!result) {
        cancelAnimationFrame(frame);
        shownTotal = null;
        display.textContent = '—';
        share.hidden = true;
        return;
      }
      animateTotal(result.total);
      const revenue = Number(form.elements.revenue.value);
      const expenses = Math.min(Number(form.elements.costs.value), revenue);
      const note = revenue
        ? t('About {n}% of your revenue goes to these federal taxes.').replace('{n}', Math.round((result.total / revenue) * 100))
        : '';
      renderShare(share, 'WHERE YOUR REVENUE GOES', [
        { label: 'Business expenses', value: expenses, tone: 'tone-expense' },
        { label: 'Federal income tax', value: result.federal, tone: 'tone-federal' },
        { label: 'Self-employment tax', value: result.self, tone: 'tone-self' },
        { label: 'Additional Medicare tax', value: result.medicare, tone: 'tone-medicare' },
        { label: 'Left after federal tax', value: Math.max(0, revenue - expenses - result.total), tone: 'tone-left' }
      ], note);
    };
    form.addEventListener('input', refresh);
    form.addEventListener('submit', refresh);
    form.addEventListener('reset', () => setTimeout(() => {
      sliders.forEach(({ input, range, max }) => {
        range.value = Math.min(max, Number(input.value) || 0);
        fillRange(range);
      });
      refresh();
    }, 0));
    addEventListener('steady-language-change', refresh);
    refresh();
  }

  // Weekly planner: a picture of the week, and a clear shortfall state.
  const remaining = $('remaining');
  if (remaining && $('income')) {
    const share = createShare();
    remaining.after(share);
    const refresh = () => {
      const income = Math.max(0, Number($('income').value) || 0);
      const expenses = Math.max(0, Number($('expenses').value) || 0);
      const taxRate = Math.min(60, Math.max(0, Number($('tax').value) || 0));
      const scenario = income * (1 + Number($('change').value) / 100);
      const reserve = (scenario * taxRate) / 100;
      const left = scenario - expenses - reserve;
      remaining.classList.toggle('is-short', left < 0);
      renderShare(share, 'WHERE THIS WEEK GOES', [
        { label: 'Essentials', value: expenses, tone: 'tone-expense' },
        { label: 'Tax reserve', value: reserve, tone: 'tone-federal' },
        { label: 'Available', value: Math.max(0, left), tone: 'tone-left' },
        { label: 'Shortfall', value: Math.max(0, -left), tone: 'tone-short' }
      ]);
      fillRange($('change'));
    };
    ['income', 'expenses', 'savings', 'tax', 'change'].forEach(id => $(id).addEventListener('input', refresh));
    $('reset').addEventListener('click', refresh);
    addEventListener('steady-language-change', refresh);
    refresh();
  }
})();
