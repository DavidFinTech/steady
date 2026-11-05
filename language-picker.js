// Flag-and-name language menu. It drives the page's existing <select>, so the
// translation code on every page keeps working unchanged.
(() => {
  // Spanish has no single home flag. To use Mexico's flag, change es: 'es' to es: 'mx'.
  const FLAG_FOR_LANGUAGE = { en: 'us', es: 'es', 'zh-Hans': 'cn', hi: 'in' };

  const star = (cx, cy, r, fill) => {
    const points = Array.from({ length: 10 }, (_, i) => {
      const radius = i % 2 ? r * 0.42 : r;
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
    });
    return `<polygon points="${points.join(' ')}" fill="${fill}"/>`;
  };
  const usStripes = Array.from({ length: 7 }, (_, i) => `<rect y="${(i * 32) / 13}" width="24" height="${16 / 13}" fill="#b22234"/>`).join('');
  const usStars = Array.from({ length: 12 }, (_, i) => `<circle cx="${1.5 + (i % 4) * 2.6}" cy="${1.3 + Math.floor(i / 4) * 2.7}" r=".55" fill="#fff"/>`).join('');
  const chakraSpokes = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * Math.PI) / 6;
    return `<line x1="12" y1="8" x2="${(12 + 2 * Math.cos(angle)).toFixed(2)}" y2="${(8 + 2 * Math.sin(angle)).toFixed(2)}" stroke="#000080" stroke-width=".25"/>`;
  }).join('');
  const FLAGS = {
    us: `<rect width="24" height="16" fill="#fff"/>${usStripes}<rect width="10.6" height="8.6" fill="#3c3b6e"/>${usStars}`,
    es: '<rect width="24" height="16" fill="#aa151b"/><rect y="4" width="24" height="8" fill="#f1bf00"/>',
    mx: '<rect width="8" height="16" fill="#006847"/><rect x="8" width="8" height="16" fill="#fff"/><rect x="16" width="8" height="16" fill="#ce1126"/><circle cx="12" cy="8" r="1.8" fill="#8c6a2f"/>',
    cn: `<rect width="24" height="16" fill="#de2910"/>${star(4.2, 4.2, 2.9, '#ffde00')}${star(8.4, 1.7, 1, '#ffde00')}${star(10.2, 3.4, 1, '#ffde00')}${star(10.2, 5.8, 1, '#ffde00')}${star(8.4, 7.5, 1, '#ffde00')}`,
    in: `<rect width="24" height="5.34" fill="#ff9933"/><rect y="5.33" width="24" height="5.34" fill="#fff"/><rect y="10.66" width="24" height="5.34" fill="#138808"/><circle cx="12" cy="8" r="2.2" fill="none" stroke="#000080" stroke-width=".4"/>${chakraSpokes}`
  };
  const flagSvg = language => `<svg class="flag" viewBox="0 0 24 16" width="24" height="16" aria-hidden="true" focusable="false">${FLAGS[FLAG_FOR_LANGUAGE[language]] || ''}</svg>`;

  function enhance(select, index) {
    const options = [...select.options];
    const wrapper = document.createElement('div');
    wrapper.className = 'lang-picker';
    wrapper.setAttribute('data-language-selector', '');
    const labelId = `lang-picker-label-${index}`;
    const listId = `lang-picker-list-${index}`;
    wrapper.innerHTML = `
      <span class="visually-hidden" id="${labelId}">Language / Idioma / 语言 / भाषा</span>
      <button type="button" class="lang-button" aria-haspopup="listbox" aria-expanded="false" aria-controls="${listId}" aria-labelledby="${labelId} ${labelId}-value">
        <span class="lang-current" id="${labelId}-value"></span>
        <svg class="lang-chevron" viewBox="0 0 12 8" width="10" height="7" aria-hidden="true" focusable="false"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <ul class="lang-menu" id="${listId}" role="listbox" tabindex="-1" aria-labelledby="${labelId}" hidden>
        ${options.map((option, i) => `<li role="option" id="${listId}-${i}" data-value="${option.value}" lang="${option.value}">${flagSvg(option.value)}<span>${option.textContent}</span><svg class="lang-check" viewBox="0 0 14 11" width="13" height="10" aria-hidden="true" focusable="false"><path d="M1.5 5.5l4 4 7-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></li>`).join('')}
      </ul>`;
    select.after(wrapper);
    wrapper.prepend(select);
    select.classList.add('lang-native');
    select.setAttribute('aria-hidden', 'true');
    select.tabIndex = -1;

    const button = wrapper.querySelector('.lang-button');
    const current = wrapper.querySelector('.lang-current');
    const menu = wrapper.querySelector('.lang-menu');
    const items = [...menu.querySelectorAll('[role="option"]')];
    let active = 0;

    function sync() {
      const selected = select.value;
      const name = options.find(option => option.value === selected)?.textContent || '';
      current.innerHTML = `${flagSvg(selected)}<span lang="${selected}">${name}</span>`;
      items.forEach((item, i) => {
        const isSelected = item.dataset.value === selected;
        item.setAttribute('aria-selected', String(isSelected));
        if (isSelected) active = i;
      });
    }
    function highlight(i) {
      active = (i + items.length) % items.length;
      items.forEach((item, n) => item.classList.toggle('is-active', n === active));
      menu.setAttribute('aria-activedescendant', items[active].id);
    }
    function open() {
      sync();
      menu.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      highlight(active);
      menu.focus();
    }
    function close(returnFocus = true) {
      if (menu.hidden) return;
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      if (returnFocus) button.focus();
    }
    function choose(i) {
      select.value = items[i].dataset.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
      button.classList.remove('just-changed');
      void button.offsetWidth;
      button.classList.add('just-changed');
      close();
    }

    button.addEventListener('click', () => (menu.hidden ? open() : close()));
    button.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); open(); }
    });
    items.forEach((item, i) => {
      item.addEventListener('click', () => choose(i));
      item.addEventListener('pointermove', () => highlight(i));
    });
    menu.addEventListener('keydown', event => {
      const actions = {
        ArrowDown: () => highlight(active + 1),
        ArrowUp: () => highlight(active - 1),
        Home: () => highlight(0),
        End: () => highlight(items.length - 1),
        Enter: () => choose(active),
        ' ': () => choose(active),
        Escape: () => close()
      };
      if (event.key === 'Tab') return close(false);
      if (!actions[event.key]) return;
      event.preventDefault();
      actions[event.key]();
    });
    document.addEventListener('pointerdown', event => {
      if (!wrapper.contains(event.target)) close(false);
    });
    window.addEventListener('steady-language-change', sync);
    sync();
  }

  document.querySelectorAll('select[data-language-selector], select#language').forEach(enhance);
})();
