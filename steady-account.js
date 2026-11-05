// Shows who is signed in, on every page. Sign-in itself is handled by the site's host.
(() => {
  const t = text => window.STEADY.t(text);
  const here = /\/signin(\.html)?$/.test(location.pathname) ? '/community.html' : location.pathname + location.search;
  const state = { checked: false, available: false, signedIn: false, me: null };
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
  window.addEventListener('steady-language-change', paint);
  paint();
  fetch('/api/community?sort=new')
    .then(async response => {
      if (!response.ok) throw new Error();
      const data = await response.json();
      window.STEADY.setAccount({ available: true, signedIn: Boolean(data.signedIn), me: data.me || null });
    })
    .catch(() => window.STEADY.setAccount({ available: false, signedIn: false, me: null }));
})();
