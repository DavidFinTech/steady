// Shared interactions: choosers, breakdown bars, header progress and reveals.
(() => {
  const t = text => window.STEADY.t(text);
  const arrow = () => window.steadyIcon('arrow');

  window.STEADY.renderShare = (host, segments) => {
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    const visible = segments.filter(segment => segment.value > 0);
    host.hidden = !total;
    if (!total) return;
    host.querySelector('.share-bar').innerHTML = visible.map(s => `<i class="${s.tone}" style="flex-grow:${s.value}"></i>`).join('');
    host.querySelector('.share-legend').innerHTML = visible.map(s => `<li><i class="${s.tone}"></i><span>${t(s.label)}</span><b class="num">${Math.round((s.value / total) * 100)}%</b></li>`).join('');
  };

  const CHOOSERS = window.STEADY_TOOLS.CHOOSERS;
  document.querySelectorAll('[data-chooser]').forEach(host => {
    const options = CHOOSERS[host.dataset.chooser];
    let active = 0;
    host.innerHTML = '<div class="chooser-tabs" role="group"></div><div class="chooser-panel" aria-live="polite"></div>';
    const tabs = host.querySelector('.chooser-tabs');
    const panel = host.querySelector('.chooser-panel');
    const draw = () => {
      tabs.innerHTML = options.map((option, i) => `<button type="button" aria-pressed="${i === active}" data-i="${i}">${window.steadyIcon(option.icon)}<span>${t(option.label)}</span></button>`).join('');
      const option = options[active];
      panel.innerHTML = `<div class="chooser-card"><span class="chooser-icon">${window.steadyIcon(option.icon)}</span><h3>${t(option.title)}</h3><p>${t(option.line)}</p><div class="rights-actions"><a class="pill pill-strong" href="${option.url}"><span>${t(option.cta)}</span>${arrow()}</a>${(option.more || []).map(link => `<a class="pill" href="${link.url}"><span>${t(link.label)}</span>${arrow()}</a>`).join('')}</div></div>`;
    };
    tabs.addEventListener('click', event => {
      const button = event.target.closest('[data-i]');
      if (!button) return;
      active = Number(button.dataset.i);
      draw();
      tabs.querySelector(`[data-i="${active}"]`).focus();
    });
    window.addEventListener('steady-language-change', draw);
    draw();
  });

  const header = document.querySelector('.topbar');
  const bar = document.querySelector('.scroll-progress');
  if (header && bar) {
    let queued = false;
    const paint = () => {
      queued = false;
      const room = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${room > 0 ? Math.min(1, scrollY / room) : 0})`;
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(paint); } }, { passive: true });
    paint();
  }

  const links = [...document.querySelectorAll('a[data-section]')];
  if ('IntersectionObserver' in window) {
    if (links.length) {
      const watcher = new IntersectionObserver(entries => entries.forEach(entry => {
        links.filter(link => link.dataset.section === entry.target.id).forEach(link => link.classList.toggle('is-active', entry.isIntersecting));
      }), { rootMargin: '-40% 0px -55% 0px' });
      new Set(links.map(link => link.dataset.section)).forEach(id => {
        const section = document.getElementById(id);
        if (section) watcher.observe(section);
      });
    }
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('can-reveal');
      const revealer = new IntersectionObserver((entries, observer) => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }), { threshold: 0.08 });
      document.querySelectorAll('.reveal').forEach(el => revealer.observe(el));
    }
  }
})();
