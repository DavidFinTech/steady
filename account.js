(() => {
const $ = id => document.getElementById(id);
// Account authentication (requires a configured Supabase project).
// Only use the project's public publishable/anon key here; never use a service-role key.
const STEADY_SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const STEADY_SUPABASE_ANON_KEY = 'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY';
const accountForm = $('account-form');
const accountStatus = $('account-status');
const accountUsernameWrap = $('username-wrap');
const accountUsername = $('account-username');
const accountPassword = $('account-password');
const accountSubmit = $('account-submit');
const signinTab = $('account-signin-tab');
const signupTab = $('account-signup-tab');
const signedInPanel = $('account-signed-in');
let accountMode = 'signin';
let steadyAuthClient = null;

function setAccountStatus(message) { accountStatus.textContent = message; }
function setAccountMode(mode) {
  accountMode = mode;
  const signup = mode === 'signup';
  accountUsernameWrap.hidden = !signup;
  accountUsername.required = signup;
  accountPassword.autocomplete = signup ? 'new-password' : 'current-password';
  accountSubmit.textContent = signup ? 'Create profile' : 'Sign in';
  signinTab.setAttribute('aria-pressed', String(!signup));
  signupTab.setAttribute('aria-pressed', String(signup));
  setAccountStatus('');
}
function configuredAuthClient() {
  if (STEADY_SUPABASE_URL === 'YOUR_SUPABASE_PROJECT_URL' ||
      STEADY_SUPABASE_ANON_KEY === 'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY' ||
      !window.supabase) return null;
  if (!steadyAuthClient) steadyAuthClient = window.supabase.createClient(
    STEADY_SUPABASE_URL, STEADY_SUPABASE_ANON_KEY,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );
  return steadyAuthClient;
}
function showAccountSession(user) {
  if (!user) {
    signedInPanel.hidden = true;
    accountForm.hidden = false;
    return;
  }
  const username = user.user_metadata && user.user_metadata.username;
  $('account-profile-summary').textContent = (username ? '@' + username + ' · ' : '') + user.email;
  accountForm.hidden = true;
  signedInPanel.hidden = false;
  setAccountStatus('Signed in successfully.');
}
signinTab.addEventListener('click', () => setAccountMode('signin'));
signupTab.addEventListener('click', () => setAccountMode('signup'));
accountForm.addEventListener('submit', async event => {
  event.preventDefault();
  const client = configuredAuthClient();
  if (!client) {
    setAccountStatus('Sign-in is not available yet. No credentials were sent. You can still use all Steady planning tools without an account.');
    return;
  }
  const email = $('account-email').value.trim();
  const password = accountPassword.value;
  accountSubmit.disabled = true;
  try {
    let result;
    if (accountMode === 'signup') {
      const username = accountUsername.value.trim();
      if (!/^[A-Za-z0-9_]{3,30}$/.test(username)) {
        setAccountStatus('Choose a username of 3–30 letters, numbers, or underscores.');
        return;
      }
      result = await client.auth.signUp({ email, password, options: { data: { username } } });
      if (result.error) throw result.error;
      if (result.data.session && result.data.user) showAccountSession(result.data.user);
      else setAccountStatus('Profile created. Check your email for a confirmation link before signing in.');
    } else {
      result = await client.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      showAccountSession(result.data.user);
    }
  } catch (error) {
    setAccountStatus(error && error.message ? error.message : 'Unable to complete account request. Please try again.');
  } finally {
    accountSubmit.disabled = false;
  }
});
$('account-signout').addEventListener('click', async () => {
  const client = configuredAuthClient();
  if (!client) return;
  const { error } = await client.auth.signOut();
  if (error) { setAccountStatus(error.message || 'Unable to sign out.'); return; }
  showAccountSession(null);
  setAccountStatus('You have signed out.');
});
(async () => {
  const client = configuredAuthClient();
  if (!client) return;
  const { data, error } = await client.auth.getUser();
  if (!error && data.user) showAccountSession(data.user);
})();

})();
