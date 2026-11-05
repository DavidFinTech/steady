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
  window.addEventListener('steady-language-change', paint);
  paint();
  window.STEADY.refreshAccount();
})();
