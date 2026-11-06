// Shows who is signed in, on every page.
(() => {
  const t = text => window.STEADY.t(text);
  const page = location.pathname.split('/').pop() || 'index.html';
  const here = page.startsWith('signin') ? 'community.html' : page + location.search;
  const state = { checked: false, available: false, signedIn: false, me: null, isModerator: false };
  window.STEADY.account = state;

  function paint() {
    document.querySelectorAll('[data-account-link]').forEach(link => {
      link.href = `signin.html?return_to=${encodeURIComponent(here)}`;
      link.querySelector('span').textContent = state.signedIn ? (state.me ? `@${state.me.handle}` : t('Pick a username')) : t('Sign in');
      link.classList.toggle('is-signed-in', state.signedIn);
      const icon = link.querySelector('i');
      if (state.signedIn && state.me?.avatar) { icon.textContent = state.me.avatar; icon.classList.add('as-avatar'); }
      else { icon.innerHTML = window.steadyIcon('user'); icon.classList.remove('as-avatar'); }
    });
  }
  window.STEADY.setAccount = next => {
    Object.assign(state, next, { checked: true });
    paint();
    window.dispatchEvent(new CustomEvent('steady-account-change'));
  };
  window.STEADY.refreshAccount = async () => {
    const backend = window.STEADY_BACKEND;
    if (backend.mode === 'none') return window.STEADY.setAccount({ available: false, signedIn: false, me: null, isModerator: false });
    try {
      const data = await backend.me();
      window.STEADY.setAccount({ available: true, signedIn: Boolean(data.signedIn), me: data.me || null, isModerator: Boolean(data.isModerator) });
    } catch (_) {
      window.STEADY.setAccount({ available: false, signedIn: false, me: null, isModerator: false });
    }
  };
  function paintDemoBanner() {
    if (window.STEADY_BACKEND.mode !== 'demo') return;
    let banner = document.getElementById('demo-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'demo-banner';
      document.querySelector('.topbar').before(banner);
      banner.addEventListener('click', event => {
        if (!event.target.closest('button')) return;
        window.STEADY_BACKEND.reset();
        location.reload();
      });
    }
    banner.innerHTML = '<span></span><button type="button"></button>';
    banner.querySelector('span').textContent = t('Demo mode: sample data. Nothing is sent.');
    banner.querySelector('button').textContent = t('Reset demo');
  }
  window.addEventListener('steady-language-change', paintDemoBanner);
  paintDemoBanner();
  window.addEventListener('steady-language-change', paint);
  paint();
  window.STEADY.refreshAccount();
})();
