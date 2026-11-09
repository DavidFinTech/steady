// The character maker. Works without an account: changes stay on this device.
(() => {
  const A = window.STEADY_AVATAR;
  const t = text => window.STEADY.t(text);
  const $ = id => document.getElementById(id);
  const e = text => String(text ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const FACE_VIEW = '40 30 120 120', EYE_VIEW = '60 62 80 56', LOW_VIEW = '60 92 80 56', TOP_VIEW = '25 5 150 150';
  const TABS = [
    { id: 'face', label: 'Face', field: 'face', view: FACE_VIEW, colors: [{ field: 'skin', list: A.SKIN, label: 'Skin tone' }] },
    { id: 'hair', label: 'Hair', field: 'hair', view: TOP_VIEW, colors: [{ field: 'hairColor', list: A.HAIR_COLORS, label: 'Color' }] },
    { id: 'eyes', label: 'Eyes', field: 'eyes', view: EYE_VIEW, colors: [{ field: 'eyeColor', list: A.EYE_COLORS, label: 'Color' }], sliders: [{ field: 'eyeSize', label: 'Size' }, { field: 'eyeY', label: 'Height' }, { field: 'eyeGap', label: 'Spacing' }] },
    { id: 'brows', label: 'Eyebrows', field: 'brows', view: EYE_VIEW, sliders: [{ field: 'browY', label: 'Height' }] },
    { id: 'nose', label: 'Nose', field: 'nose', view: LOW_VIEW, sliders: [{ field: 'noseSize', label: 'Size' }, { field: 'noseY', label: 'Height' }] },
    { id: 'mouth', label: 'Mouth', field: 'mouth', view: LOW_VIEW, sliders: [{ field: 'mouthSize', label: 'Size' }, { field: 'mouthY', label: 'Height' }] },
    { id: 'beard', label: 'Facial hair', field: 'beard', view: FACE_VIEW, colors: [{ field: 'hairColor', list: A.HAIR_COLORS, label: 'Color' }] },
    { id: 'glasses', label: 'Glasses', field: 'glasses', view: EYE_VIEW },
    { id: 'head', label: 'Headwear', field: 'head', view: TOP_VIEW, names: A.HEADWEAR, colors: [{ field: 'headColor', list: A.CLOTH, label: 'Color' }] },
    { id: 'outfit', label: 'Outfit', field: 'outfit', view: '20 110 160 90', colors: [{ field: 'outfitColor', list: A.CLOTH, label: 'Color' }] },
    { id: 'card', label: 'My card', card: true, colors: [{ field: 'card', list: A.CARDS, label: 'Background' }] }
  ];

  const saved = A.load();
  let character = saved ? A.decode(saved.character) : A.defaults();
  let bio = saved?.bio || '';
  let active = 'face';
  let adopted = false;
  const history = [];

  function remember() {
    history.push(A.encode(character));
    if (history.length > 50) history.shift();
    $('undo').disabled = false;
  }
  function paintCard() {
    const account = window.STEADY.account;
    $('me-portrait').innerHTML = A.svg(character, { title: t('Your character') });
    $('me-name').textContent = account?.me ? `@${account.me.handle}` : t('Your character');
    const work = A.WORK[character.work];
    $('me-work').textContent = character.work ? t(work.label) : '';
    $('me-work').hidden = !character.work;
    $('me-bio').textContent = bio;
    $('me-bio').hidden = !bio;
    document.querySelector('.me-card').style.setProperty('--card', A.CARDS[character.card]);
    document.querySelector('.me-card').classList.toggle('is-dark', character.card >= 8);
  }
  function paintStatus(message) {
    $('me-status').textContent = message;
  }
  // With a profile, every change saves to it on its own, so nothing is lost by leaving.
  let pending = null;
  let saving = Promise.resolve(true);
  function saveToProfile() {
    clearTimeout(pending);
    pending = null;
    const me = window.STEADY.account?.me;
    if (!me) return saving;
    const avatar = A.encode(character);
    if (avatar === me.avatar && bio === (me.bio || '')) return saving;
    saving = saving.then(() => window.STEADY_BACKEND.action({ action: 'profile', isNew: false, bio, avatar }))
      .then(() => {
        window.STEADY.setAccount({ me: { ...window.STEADY.account.me, avatar, bio } });
        paintStatus(t('Saved to your profile.'));
        return true;
      })
      .catch(() => { paintStatus(t('Couldn’t save. Try again.')); return false; });
    return saving;
  }
  function changed() {
    A.save(character, bio);
    paintCard();
    if (window.STEADY.account?.me) {
      paintStatus(t('Saving…'));
      clearTimeout(pending);
      pending = setTimeout(saveToProfile, 500);
    } else {
      paintStatus(t('Saved on this device.'));
    }
  }
  function drawTabs() {
    $('maker-tabs').innerHTML = TABS.map(tab => `<button type="button" data-maker-tab="${tab.id}" aria-pressed="${tab.id === active}">${e(t(tab.label))}</button>`).join('');
  }
  function drawOptions() {
    const tab = TABS.find(item => item.id === active);
    let body = '';
    if (tab.field) {
      const count = A.COUNTS[tab.field];
      body += `<div class="maker-grid" role="group" aria-label="${e(t(tab.label))}">${Array.from({ length: count }, (_, i) => {
        const name = tab.names ? t(tab.names[i].label) : t('Style {n}').replace('{n}', i + 1);
        return `<button type="button" class="maker-option" data-set="${tab.field}" data-value="${i}" aria-pressed="${character[tab.field] === i}" aria-label="${e(name)}" title="${e(name)}">${A.svg({ ...character, card: 0, ...(tab.id === 'face' ? { hair: 0, head: 0 } : {}), [tab.field]: i }, { viewBox: tab.view })}</button>`;
      }).join('')}</div>`;
    }
    for (const color of tab.colors || []) {
      body += `<div class="maker-row"><h3>${e(t(color.label))}</h3><div class="maker-swatches" role="group" aria-label="${e(t(color.label))}">${color.list.map((hex, i) => `<button type="button" class="maker-swatch" style="background:${hex}" data-set="${color.field}" data-value="${i}" aria-pressed="${character[color.field] === i}" aria-label="${e(t('Color {n}').replace('{n}', i + 1))}"></button>`).join('')}</div></div>`;
    }
    for (const slider of tab.sliders || []) {
      body += `<label class="maker-slider"><span>${e(t(slider.label))}</span><input type="range" min="0" max="8" step="1" value="${character[slider.field]}" data-slide="${slider.field}"></label>`;
    }
    if (tab.card) {
      body += `<div class="maker-row"><h3>${e(t('What I do'))}</h3><div class="work-options" role="group" aria-label="${e(t('What I do'))}">${A.WORK.map((work, i) => `<button type="button" data-set="work" data-value="${i}" aria-pressed="${character.work === i}">${e(t(work.label))}</button>`).join('')}</div></div>`;
      body += `<div class="maker-row"><label for="me-bio-input"><h3>${e(t('About you'))}</h3></label><textarea id="me-bio-input" rows="3" maxlength="280">${e(bio)}</textarea></div>`;
    }
    $('maker-options').innerHTML = body;
    document.querySelectorAll('#maker-options input[type="range"]').forEach(input => input.style.setProperty('--fill', `${input.value / 8 * 100}%`));
  }
  function drawAll() { drawTabs(); drawOptions(); paintCard(); paintStatus(''); }
  function pressOnly(field, value) {
    document.querySelectorAll(`#maker-options [data-set="${field}"]`).forEach(item => item.setAttribute('aria-pressed', String(Number(item.dataset.value) === value)));
  }

  document.addEventListener('click', event => {
    const tab = event.target.closest('[data-maker-tab]');
    if (tab) { active = tab.dataset.makerTab; drawTabs(); drawOptions(); return; }
    const option = event.target.closest('[data-set]');
    if (!option) return;
    remember();
    character[option.dataset.set] = Number(option.dataset.value);
    // Color changes also show on the style pictures, so redraw them.
    if (option.classList.contains('maker-swatch')) { drawOptions(); $('maker-options').querySelector(`[data-set="${option.dataset.set}"][data-value="${option.dataset.value}"]`)?.focus(); }
    else pressOnly(option.dataset.set, character[option.dataset.set]);
    changed();
  });
  let sliding = false;
  document.addEventListener('input', event => {
    const slider = event.target.closest('[data-slide]');
    if (slider) {
      if (!sliding) { remember(); sliding = true; }
      character[slider.dataset.slide] = Number(slider.value);
      slider.style.setProperty('--fill', `${slider.value / 8 * 100}%`);
      changed();
    }
    if (event.target.id === 'me-bio-input') { bio = event.target.value.slice(0, 280); changed(); }
  });
  document.addEventListener('change', event => { if (event.target.closest('[data-slide]')) sliding = false; });

  $('shuffle').addEventListener('click', () => {
    remember();
    const keepWork = character.work;
    character = { ...A.random(), work: keepWork };
    drawOptions(); changed();
    const portrait = $('me-portrait');
    portrait.classList.remove('is-bouncing'); void portrait.offsetWidth; portrait.classList.add('is-bouncing');
  });
  $('undo').addEventListener('click', () => {
    const last = history.pop();
    if (!last) return;
    character = A.decode(last);
    $('undo').disabled = !history.length;
    drawOptions(); changed();
  });
  $('start-over').addEventListener('click', () => {
    remember();
    character = A.defaults();
    drawOptions(); changed();
  });
  $('download').addEventListener('click', () => {
    const source = A.svg(character).replace('aria-hidden="true"', 'width="800" height="800"');
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 800;
      canvas.getContext('2d').drawImage(image, 0, 0, 800, 800);
      const link = document.createElement('a');
      link.download = 'steady-character.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
  });
  $('save-account').addEventListener('click', async () => {
    const button = $('save-account');
    button.disabled = true;
    if (await saveToProfile()) {
      location.href = `community.html?profile=${encodeURIComponent(window.STEADY.account.me.handle)}`;
      return;
    }
    button.disabled = false;
  });
  // Leaving before the last change is saved: save it first.
  $('maker-close').addEventListener('click', async event => {
    if (!pending) return;
    event.preventDefault();
    await saveToProfile();
    location.href = $('maker-close').href;
  });
  window.addEventListener('pagehide', () => { if (pending) saveToProfile(); });

  function paintAccount() {
    const account = window.STEADY.account;
    const me = account?.me;
    if (me && !adopted) {
      adopted = true;
      // Editing an existing profile starts from what's already saved to it.
      if (A.isCharacter(me.avatar)) character = A.decode(me.avatar);
      if (me.bio) bio = me.bio;
      drawOptions();
    }
    $('save-account').hidden = !me;
    $('use-character').hidden = !account?.signedIn || Boolean(me);
    $('account-note').hidden = Boolean(account?.signedIn);
    $('maker-close').href = me ? `community.html?profile=${encodeURIComponent(me.handle)}` : 'community.html';
    paintCard();
  }
  window.addEventListener('steady-language-change', drawAll);
  window.addEventListener('steady-account-change', paintAccount);
  drawAll();
  paintAccount();
})();
