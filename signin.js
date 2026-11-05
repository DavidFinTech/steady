(() => {
  const t = text => window.STEADY.t(text);
  const params = new URLSearchParams(location.search);
  const requested = params.get('return_to') || '';
  // Only ever return to a page on this site.
  const returnTo = /^\/(?![/\\])/.test(requested) && !requested.startsWith('/signin') ? requested : '/community.html';
  const views = [...document.querySelectorAll('[data-view]')];
  const show = name => views.forEach(view => { view.hidden = view.dataset.view !== name; });
  document.getElementById('signin-action').href = `/signin-with-chatgpt?return_to=${encodeURIComponent(returnTo)}`;
  document.getElementById('signout-action').href = `/signout-with-chatgpt?return_to=${encodeURIComponent('/signin.html')}`;
  document.getElementById('continue-action').href = returnTo === '/signin.html' ? 'community.html' : returnTo;

  function render() {
    const account = window.STEADY.account;
    if (!account.checked) return show('checking');
    if (!account.available) return show('offline');
    if (!account.signedIn) return show('signed-out');
    show('signed-in');
    const avatar = document.getElementById('me-avatar');
    avatar.textContent = account.me?.avatar || '';
    avatar.hidden = !account.me;
    document.getElementById('me-title').textContent = account.me ? `@${account.me.handle}` : t('Almost there.');
    document.getElementById('me-line').textContent = t(account.me ? 'You’re signed in.' : 'Pick a username');
    document.getElementById('continue-label').textContent = t('Go to Community');
    document.getElementById('continue-action').href = account.me ? (returnTo === '/signin.html' ? 'community.html' : returnTo) : 'community.html?setup=1';
  }
  window.addEventListener('steady-account-change', render);
  window.addEventListener('steady-language-change', render);
  render();
})();
