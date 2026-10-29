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
const optionalProfileFields = $('optional-profile-fields');
const profileFieldIds = ['occupation', 'industry', 'location', 'bio', 'background'];
const avatarInput = $('account-avatar');
const avatarPreviewWrap = $('avatar-preview-wrap');
const avatarPreview = $('avatar-preview');
const headerProfile = $('header-profile');
const headerAvatar = $('header-avatar');
const headerUsername = $('header-username');
let selectedAvatarDataUrl = '';
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
function setHeaderProfile(user) {
  if (!user) { headerProfile.hidden = true; headerAvatar.removeAttribute('src'); headerUsername.textContent = ''; return; }
  const metadata = user.user_metadata || {};
  headerUsername.textContent = metadata.username || (user.email ? user.email.split('@')[0] : 'Profile');
  const avatarUrl = metadata.avatar_url || '';
  if (avatarUrl) { headerAvatar.src = avatarUrl; headerAvatar.hidden = false; }
  else { headerAvatar.removeAttribute('src'); headerAvatar.hidden = true; }
  headerProfile.hidden = false;
}
avatarInput.addEventListener('change', () => {
  const file = avatarInput.files && avatarInput.files[0]; selectedAvatarDataUrl = ''; avatarPreviewWrap.hidden = true; if (!file) return;
  if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)) { avatarInput.value = ''; setAccountStatus('Choose a JPG, PNG, WebP, or GIF image.'); return; }
  if (file.size > MAX_AVATAR_BYTES) { avatarInput.value = ''; setAccountStatus('Profile pictures must be 2 MB or smaller.'); return; }
  const reader = new FileReader(); reader.onload = () => { selectedAvatarDataUrl = String(reader.result || ''); avatarPreview.src = selectedAvatarDataUrl; avatarPreviewWrap.hidden = false; };
  reader.onerror = () => setAccountStatus('Could not read that image. Please choose another file.'); reader.readAsDataURL(file);
});
$('avatar-remove').addEventListener('click', () => { avatarInput.value = ''; selectedAvatarDataUrl = ''; avatarPreview.removeAttribute('src'); avatarPreviewWrap.hidden = true; });
async function uploadAvatar(client, user) {
  const file = avatarInput.files && avatarInput.files[0]; if (!file || !selectedAvatarDataUrl) return user;
  const extensions = {'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};
  const path = user.id + '/' + Date.now() + '.' + extensions[file.type];
  const uploaded = await client.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
  if (uploaded.error) throw new Error('Account created, but the picture could not be uploaded. Configure the public avatars bucket and its upload policy in Supabase.');
  const publicData = client.storage.from('avatars').getPublicUrl(uploaded.data.path);
  const avatarUrl = publicData.data && publicData.data.publicUrl; if (!avatarUrl) throw new Error('No public avatar URL available. Check the Supabase avatars bucket settings.');
  const updated = await client.auth.updateUser({ data: { avatar_url: avatarUrl } }); if (updated.error) throw updated.error; return updated.data.user || user;
}

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
  optionalProfileFields.hidden = !signup;
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
    setHeaderProfile(null);
    return;
  }
  setHeaderProfile(user);
  const metadata = user.user_metadata || {};
  const profileLines = [
    metadata.username ? '@' + metadata.username : '',
    user.email || '',
    metadata.occupation ? 'Occupation: ' + metadata.occupation : '',
    metadata.industry ? 'Industry: ' + metadata.industry : '',
    metadata.location ? 'Location: ' + metadata.location : '',
    metadata.bio ? 'Bio: ' + metadata.bio : '',
    metadata.background ? 'Background: ' + metadata.background : ''
  ].filter(Boolean);
  $('account-profile-summary').textContent = profileLines.join('\n');
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
      const profileData = { username };
      profileFieldIds.forEach(field => {
        const value = $('account-' + field).value.trim();
        if (value) profileData[field] = value;
      });
      result = await client.auth.signUp({
        email,
        password,
        options: { data: profileData }
      });
      if (result.error) throw result.error;
      if (result.data.session && result.data.user) {
        let user = result.data.user;
        if (avatarInput.files && avatarInput.files[0]) user = await uploadAvatar(client, user);
        showAccountSession(user);
      } else {
        setAccountStatus(avatarInput.files && avatarInput.files[0] ? 'Profile created. Check your email for confirmation, then sign in and select your picture again to upload it.' : 'Profile created. Check your email for a confirmation link before signing in.');
      }
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
