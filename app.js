const $=id=>document.getElementById(id);const money=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
function update(){const income=Math.max(0,+$('income').value||0),expenses=Math.max(0,+$('expenses').value||0),savings=Math.max(0,+$('savings').value||0),tax=Math.min(60,Math.max(0,+$('tax').value||0)),change=+$('change').value;const scenario=income*(1+change/100),reserve=scenario*tax/100,left=scenario-expenses-reserve;$('changeLabel').textContent=(change>0?'+':'')+change+'%';$('remaining').textContent=money(left);$('resultLabel').textContent=left<0?'Estimated weekly shortfall':'Available after essentials and tax reserve';$('scenario').textContent=money(scenario);$('reserve').textContent=money(reserve);$('runway').textContent=expenses?(savings/expenses).toFixed(1)+' weeks':'No expenses entered';$('advice').textContent=left<0?'This scenario leaves a gap. Review payment dates and essential expenses before planning a new savings contribution.':'Consider putting some of the remainder toward your buffer.';}
['income','expenses','savings','tax','change'].forEach(id=>$(id).addEventListener('input',update));$('reset').onclick=()=>{[850,550,400,20,0].forEach((v,i)=>$( ['income','expenses','savings','tax','change'][i]).value=v);update()};
document.querySelectorAll('.check input').forEach(c=>c.onchange=()=>$('progress').textContent=document.querySelectorAll('.check input:checked').length+' of 3 steps explored');
$('download').onclick=()=>{const items=[...document.querySelectorAll('.check')].map(c=>(c.querySelector('input').checked?'[x] ':'[ ] ')+c.querySelector('label').innerText);const blob=new Blob(['STEADY — MY ACTION LIST\nBrowser-only prototype\n\n'+items.join('\n\n')+'\n\nWeekly estimate: '+$('remaining').textContent+'\n\nFreelancer health options: https://freelancersunion.org/insurance/health/\nFree NY enrollment help: https://nystateofhealth.ny.gov/agent/assistors?lang=en\nNYC Care (not insurance): https://www.nyccare.nyc/enroll/\nGig-work taxes: https://www.irs.gov/businesses/small-businesses-self-employed/manage-taxes-for-your-gig-work\nRetirement options: https://www.irs.gov/retirement-plans/retirement-plans-for-small-entities-and-self-employed\nWellness: compare gym or campus recreation costs and access; Steady does not offer a gym benefit.\nWorker rights: https://www.nyc.gov/site/dca/workers/workersrights/freelancer-workers.page'],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='steady-action-list.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
const slides=[['The week we are designing for','01 · Problem and customer · 1 minute',['NYC freelance creatives, including students balancing classes and side gigs, are the initial audience. Irregular payments and access to benefits shape the concept.','Core problem: late payments and tax planning compete with insurance and healthcare, lifestyle wellness, retirement saving, and legal support across separate services.','Maya is an illustrative persona. Validate this framing through interviews before treating it as a research finding.']],['A connected starting point','02 · Background research · 1.5 minutes',['HealthCare.gov explains individual coverage pathways for self-employed workers. NYC DCWP provides freelance worker rights and complaint resources.','Existing services address distinct needs. Our hypothesis is that a weekly action plan could make those services easier to navigate together.','Interview five freelancers and compare their current tools and referral journeys. We have not established that this concept is unique in the market.']],['Three ideas. One first experiment.','03 · Originality and prioritization · 1 minute',['Considered concepts: an information directory, a pooled benefits fund, and a weekly planner with resource referrals.','Proposed choice: the planner and referral approach. A directory provides less decision support; a pooled fund requires insurance, financial, and operational expertise beyond this pilot.','Distinctive design hypothesis: use a concrete weekly income gap to prioritize a short protection checklist. Team discussion and user testing still need to validate the choice.']],['Show the week getting simpler','04 · Prototype walkthrough · 2 minutes',['Enter income, essentials, savings, and an assumed tax reserve. Reduce income by 25% to reveal the difference a slow week makes.','Explore the official health coverage and worker rights resources. Check an action and download the list.','The prototype calculates locally. It does not determine eligibility, issue insurance, transfer funds, submit complaints, or connect to bank accounts.']],['Start small enough to deliver','05 · Viability and rollout · 1.5 minutes',['Weeks 1–2: interview five workers, map existing services, and ask qualified partners to review resource wording.','Weeks 3–4: run five usability sessions and revise the task flow. Weeks 5–6: pilot with a small community organization, if a willing partner is found.','Illustrative six-week cash budget: $100 hosting/tools, $250 participant incentives, $500 specialist review = $850, excluding student labor. Sponsorship is a funding hypothesis; no partners or funds are secured.']],['Simple technology. Clear boundaries.','06 · Technical components · 1 minute',['Hardware: any modern phone or laptop. Software: responsive HTML, CSS, and JavaScript with a client-side budget calculator. Other services: external links to official resources.','Current demo: no database or personal-data collection. Inputs stay in page memory; downloads are generated locally.','A future saved-plan service would require consent, secure storage, accessibility testing, updated resource ownership, and a documented deletion process. These features are not implemented.']],['Learn, revise, and defend the idea','07 · Validation and next steps · 2 minutes',['Proposed pilot target: four of five participants can create a budget scenario, find a relevant resource, and describe a next step without assistance. Record completion time and confusing language.','Key risks: incorrect eligibility assumptions, outdated links, low trust, and incomplete budgets. Respond with official referrals, scheduled link review, minimal data collection, and usability testing.','Ask for feedback: Is the weekly cash gap the right entry point? Which protection is most often missed? How would we support employees whose rights differ from freelancers?']]];let current=0;function show(){const s=slides[current];$('slideCount').textContent=String(current+1).padStart(2,'0')+' / 07';$('slide').replaceChildren();const e=document.createElement('div');e.className='eyebrow';e.textContent=s[1];const h=document.createElement('h3');h.textContent=s[0];const ul=document.createElement('ul');s[2].forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.append(li)});$('slide').append(e,h,ul);$('prev').disabled=current===0;$('next').disabled=current===6;$('prev').style.opacity=current===0?.4:1;$('next').style.opacity=current===6?.4:1} $('prev').onclick=()=>{if(current>0){current--;show()}};$('next').onclick=()=>{if(current<6){current++;show()}};show();update();


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
    setAccountStatus('Sign-in is not connected yet. Configure STEADY_SUPABASE_URL and STEADY_SUPABASE_ANON_KEY in app.js and enable email/password authentication in Supabase. No credentials were sent.');
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
