(() => {
  const t = text => window.STEADY.t(text);
  const $ = id => document.getElementById(id);
  const backend = window.STEADY_BACKEND;
  const requested = new URLSearchParams(location.search).get('return_to') || '';
  // Only ever return to a page on this site.
  const returnTo = /^[a-z-]+\.html(\?[\w=&%.-]*)?$/.test(requested) && !requested.startsWith('signin') ? requested : 'community.html';
  const MESSAGES = {
    badcode: 'That code isn’t right or has expired.',
    ratelimit: 'Too many tries. Wait a minute and try again.',
    sendfail: 'Couldn’t send the code. Try again in a minute.',
    unavailable: 'Unable to connect. Please try again.',
    offline: 'Unable to connect. Please try again.'
  };
  const views = [...document.querySelectorAll('[data-view]')];
  let step = null, email = '', cooldown = 0, timer = 0;
  const show = name => { step = name; views.forEach(view => { view.hidden = view.dataset.view !== name; }); };
  const showError = (id, error) => { $(id).textContent = t(MESSAGES[error.code] || MESSAGES.unavailable); };

  function paintCooldown() {
    const button = $('resend-code');
    button.disabled = cooldown > 0;
    button.textContent = cooldown > 0 ? `${t('Send a new code')} (${cooldown})` : t('Send a new code');
  }
  function startCooldown() {
    cooldown = 60;
    paintCooldown();
    clearInterval(timer);
    timer = setInterval(() => {
      cooldown -= 1;
      paintCooldown();
      if (cooldown <= 0) clearInterval(timer);
    }, 1000);
  }
  function paintCodeStep() {
    const [before, after] = t('We sent a code to {email}.').split('{email}');
    const address = document.createElement('bdi');
    address.textContent = email;
    $('code-sent').replaceChildren(before, address, after || '');
    $('dev-hint').hidden = backend.mode !== 'dev' && backend.mode !== 'demo';
  }
  function render() {
    const account = window.STEADY.account;
    if (step === 'code') { paintCodeStep(); paintCooldown(); return; }
    if (!account.checked) return show('checking');
    if (!account.available) return show('offline');
    if (!account.signedIn) {
      if (backend.mode === 'demo') {
        $('demo-email-hint').hidden = false;
        if (!$('email').value) $('email').value = 'sample@example.com';
      }
      return show('email');
    }
    show('signed-in');
    const avatar = $('me-avatar');
    avatar.innerHTML = window.STEADY_AVATAR.html(account.me?.avatar || '');
    avatar.hidden = !account.me;
    $('me-title').textContent = account.me ? `\u2066@${account.me.handle}\u2069` : t('You’re signed in.');
    $('me-line').textContent = account.me ? t('You’re signed in.') : '';
    $('continue-action').href = returnTo;
  }

  $('email-form').addEventListener('submit', async event => {
    event.preventDefault();
    const input = $('email');
    $('email-error').textContent = '';
    if (!input.checkValidity()) { $('email-error').textContent = t('Enter a valid email.'); input.focus(); return; }
    const button = $('send-code');
    button.disabled = true;
    try {
      email = input.value.trim().toLowerCase();
      await backend.sendCode(email);
      show('code');
      $('code').value = '';
      $('code-error').textContent = '';
      paintCodeStep();
      startCooldown();
      $('code').focus();
    } catch (error) {
      showError('email-error', error);
    } finally {
      button.disabled = false;
    }
  });
  async function verify() {
    const input = $('code');
    const code = input.value.replace(/\D/g, '');
    if (code.length < 6) return;
    const button = $('verify-code');
    button.disabled = true;
    $('code-error').textContent = '';
    try {
      await backend.verifyCode(email, code);
      step = null;
      clearInterval(timer);
      await window.STEADY.refreshAccount();
      const account = window.STEADY.account;
      location.href = returnTo;
    } catch (error) {
      showError('code-error', error);
      input.select();
      button.disabled = false;
    }
  }
  $('code-form').addEventListener('submit', event => { event.preventDefault(); verify(); });
  $('code').addEventListener('input', event => {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);
    if (event.target.value.length === 6) verify();
  });
  $('resend-code').addEventListener('click', async () => {
    $('code-error').textContent = '';
    try {
      await backend.sendCode(email);
      startCooldown();
    } catch (error) {
      showError('code-error', error);
    }
  });
  $('change-email').addEventListener('click', () => {
    clearInterval(timer);
    cooldown = 0;
    show('email');
    $('email').focus();
  });
  $('sign-out').addEventListener('click', async () => {
    await backend.signOut();
    await window.STEADY.refreshAccount();
  });
  $('delete-account').addEventListener('click', async () => {
    if (!confirm(t('Delete your account and everything you posted? This can’t be undone.'))) return;
    $('account-error').textContent = '';
    try {
      await backend.deleteAccount();
      await window.STEADY.refreshAccount();
    } catch (error) {
      showError('account-error', error);
    }
  });
  window.addEventListener('steady-account-change', render);
  window.addEventListener('steady-language-change', render);
  render();
})();
