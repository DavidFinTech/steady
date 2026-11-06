(() => {
  const $ = selector => document.querySelector(selector);
  const icon = name => window.steadyIcon(name);
  const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const t = text => window.STEADY.t(text);
  const TOPICS = { all: ['All conversations', 'chat'], general: ['General', 'users'], money: ['Finances & budgeting', 'coin'], taxes: ['Taxes', 'receipt'], health: ['Health & coverage', 'heart'], work: ['Work & rights', 'scale'] };
  const AVATARS = ['✳', '🌿', '☀', '🌻', '🌊', '🪴'];
  const ERRORS = { offline: 'The community isn’t available yet.', signin: 'Sign in to join the conversation.', profile: 'Create your profile first.', handle: 'Use 3–24 lowercase letters, numbers, or underscores.', taken: 'That username is taken. Try another.', invalid: 'Please complete all fields with valid values.', slow: 'Please wait a moment before posting again.', forbidden: 'You can only change your own content.', missing: 'This post is no longer available.', unavailable: 'Unable to connect. Please try again.' };
  const url = new URL(location.href);
  let postId = url.searchParams.get('post') || '', handle = url.searchParams.get('profile') || '', topic = 'all', sort = 'new';
  let data = { posts: [], comments: [], signedIn: false }, editing = null, offline = false, failed = false;
  let wantsSetup = url.searchParams.get('setup') === '1';

  const date = n => new Intl.DateTimeFormat(document.documentElement.lang, { dateStyle: 'medium' }).format(new Date(n));
  const status = text => { $('#status').textContent = text ? t(text) : ''; };
  const backend = window.STEADY_BACKEND;
  async function mutate(body) {
    try {
      return await backend.action(body);
    } catch (error) {
      throw new Error(t(ERRORS[error.code] || ERRORS.unavailable));
    }
  }
  function needsAccount() {
    if (!data.signedIn) {
      const page = location.pathname.split('/').pop() || 'community.html';
      location.href = `signin.html?return_to=${encodeURIComponent(page + location.search)}`;
      return true;
    }
    if (!data.me) { openProfile(); return true; }
    return false;
  }
  async function load() {
    status('Loading…');
    offline = failed = false;
    try {
      data = await backend.list({ sort, topic: topic === 'all' ? '' : topic, post: postId, profile: handle });
      window.STEADY.setAccount?.({ available: true, signedIn: Boolean(data.signedIn), me: data.me || null, isModerator: Boolean(data.isModerator) });
      status('');
    } catch (error) {
      failed = true;
      offline = error.code === 'offline';
      status('');
      data = { posts: [], comments: [], signedIn: false };
    }
    render();
    renderModeration();
    if (wantsSetup && data.signedIn && !data.me) { wantsSetup = false; openProfile(); }
  }

  function renderTopics() {
    $('#topics').innerHTML = Object.entries(TOPICS).map(([key, [label, name]]) => `<button type="button" data-topic="${key}" aria-pressed="${topic === key}">${icon(name)}<span>${e(t(label))}</span></button>`).join('');
    $('#new-sort').setAttribute('aria-pressed', String(sort === 'new'));
    $('#top-sort').setAttribute('aria-pressed', String(sort === 'top'));
    $('#browse-tools').hidden = Boolean(postId || handle);
  }
  function postCard(post) {
    const body = postId ? post.body : post.body.slice(0, 220) + (post.body.length > 220 ? '…' : '');
    const owner = post.mine
      ? `<button type="button" class="quiet" data-edit="${e(post.id)}">${icon('pencil')}<span>${e(t('Edit'))}</span></button><button type="button" class="quiet" data-delete="${e(post.id)}">${icon('trash')}<span>${e(t('Delete'))}</span></button>`
      : `<button type="button" class="quiet" data-report="${e(post.id)}">${icon('flag')}<span>${e(t('Report'))}</span></button>`;
    return `<article class="post-card">
      <div class="post-meta"><a class="author" href="?profile=${encodeURIComponent(post.handle)}"><span class="avatar">${window.STEADY_AVATAR.html(post.avatar)}</span><b>@${e(post.handle)}</b></a><span>${e(date(post.created))}</span><span class="topic-tag">${e(t(TOPICS[post.topic]?.[0] || 'General'))}</span>${post.hidden ? `<span class="topic-tag is-hidden">${e(t('Hidden'))}</span>` : ''}</div>
      <h2><a href="?post=${encodeURIComponent(post.id)}">${e(post.title)}</a></h2>
      <p class="post-body">${e(body)}</p>
      <div class="post-actions">
        <div class="vote"><button type="button" data-vote="1" data-id="${e(post.id)}" aria-label="${e(t('Upvote'))}" aria-pressed="${post.myVote === 1}">${icon('up')}</button><b class="num">${Number(post.score) || 0}</b><button type="button" data-vote="-1" data-id="${e(post.id)}" aria-label="${e(t('Downvote'))}" aria-pressed="${post.myVote === -1}">${icon('down')}</button></div>
        <a class="quiet" href="?post=${encodeURIComponent(post.id)}">${icon('chat')}<span><span class="num">${Number(post.comments) || 0}</span> ${e(t('Comments'))}</span></a>
        <span class="post-owner">${owner}</span>
      </div>
    </article>`;
  }
  function render() {
    renderTopics();
    const profile = data.profile;
    $('#profile-card').innerHTML = handle
      ? (profile
        ? `<div class="profile-card"><span class="avatar big">${window.STEADY_AVATAR.html(profile.avatar)}</span><h2>@${e(profile.handle)}</h2>${window.STEADY_AVATAR.workLabel(profile.avatar) ? `<span class="work-chip">${e(t(window.STEADY_AVATAR.workLabel(profile.avatar)))}</span>` : ''}${profile.bio ? `<p>${e(profile.bio)}</p>` : ''}<small>${e(t('Joined'))} ${e(date(profile.created))}</small>${data.me?.handle === handle ? `<button type="button" class="pill" id="edit-profile">${icon('pencil')}<span>${e(t('Edit profile'))}</span></button>` : ''}</div>`
        : `<p class="empty-line">${e(t('Profile not found.'))}</p>`)
      : '';
    const back = postId || handle ? `<a class="pill back" href="community.html">${icon('back')}<span>${e(t('All conversations'))}</span></a>` : '';
    let feed;
    if (failed) {
      feed = `<div class="empty"><span class="empty-icon">${icon('chat')}</span><h2>${e(t(offline ? 'The community isn’t available yet.' : 'Unable to connect. Please try again.'))}</h2>${offline ? '' : `<button type="button" class="button" id="retry">${e(t('Try again'))}</button>`}</div>`;
    } else if (data.posts.length) {
      feed = data.posts.map(postCard).join('');
    } else if (handle) {
      feed = '';
    } else {
      feed = `<div class="empty"><span class="empty-icon">${icon('question')}</span><h2>${e(t(postId ? 'This post is no longer available.' : 'Start a conversation.'))}</h2>${postId ? '' : `<button type="button" class="button" data-compose>${e(t('Ask a question'))}</button>`}</div>`;
    }
    $('#feed').innerHTML = back + feed;
    if (postId && data.posts.length) {
      $('#feed').insertAdjacentHTML('beforeend', `<section class="comments"><h2>${e(t('Comments'))}</h2>
        <form id="comment-form"><label class="visually-hidden" for="comment">${e(t('Add a comment'))}</label><textarea id="comment" required maxlength="2000" placeholder="${e(t('Add a comment'))}"></textarea><button class="button" type="submit">${e(t('Post comment'))}</button></form>
        ${(data.comments || []).map(comment => `<article class="comment"><div class="post-meta"><a class="author" href="?profile=${encodeURIComponent(comment.handle)}"><span class="avatar">${window.STEADY_AVATAR.html(comment.avatar)}</span><b>@${e(comment.handle)}</b></a><span>${e(date(comment.created))}</span></div><p class="comment-body">${e(comment.body)}</p>${comment.mine ? `<div class="post-actions"><button type="button" class="quiet" data-edit-comment="${e(comment.id)}">${icon('pencil')}<span>${e(t('Edit'))}</span></button><button type="button" class="quiet" data-delete-comment="${e(comment.id)}">${icon('trash')}<span>${e(t('Delete'))}</span></button></div>` : ''}</article>`).join('')}
      </section>`);
    }
  }

  async function renderModeration() {
    const panel = $('#mod-panel');
    if (!data.isModerator) { panel.innerHTML = ''; return; }
    let reports;
    try { reports = await backend.queue(); } catch (_) { panel.innerHTML = ''; return; }
    panel.innerHTML = `<details class="mod-panel" ${reports.length ? 'open' : ''}><summary><span>${e(t('Reports'))} <b class="num">${reports.length}</b></span></summary>
      ${reports.length ? reports.map(report => `<div class="mod-item"><a href="?post=${encodeURIComponent(report.postId)}"><b>${e(report.title)}</b></a>${report.hidden ? `<span class="topic-tag is-hidden">${e(t('Hidden'))}</span>` : ''}<p>${e(report.reason)}</p><div class="post-actions"><button type="button" class="quiet" data-moderate="${e(report.postId)}" data-to="${report.hidden ? '' : '1'}">${e(t(report.hidden ? 'Restore' : 'Hide'))}</button><button type="button" class="quiet" data-resolve="${e(report.id)}">${e(t('Dismiss'))}</button></div></div>`).join('') : `<p class="fine">${e(t('No open reports.'))}</p>`}
    </details>`;
  }

  const field = (name, label, value = '', tag = 'input', max = 160, required = true) =>
    `<label for="f-${name}">${e(t(label))}</label>${tag === 'input'
      ? `<input id="f-${name}" name="${name}" maxlength="${max}" ${required ? 'required' : ''} value="${e(value)}">`
      : `<textarea id="f-${name}" name="${name}" maxlength="${max}" ${required ? 'required' : ''}>${e(value)}</textarea>`}`;
  function dialog(title, fields, save, submitLabel = 'Save') {
    $('#dialog-title').textContent = t(title);
    $('#fields').innerHTML = fields;
    $('#form-error').textContent = '';
    $('#editor-submit').textContent = t(submitLabel);
    editing = save;
    $('#editor').showModal();
  }
  function openProfile() {
    if (!data.signedIn) { needsAccount(); return; }
    const me = data.me || {};
    const mine = window.STEADY_AVATAR.load()?.character;
    const usingCharacter = url.searchParams.get('character') === '1';
    const current = me.avatar || (usingCharacter && mine) || AVATARS[0];
    let draft = {};
    try { draft = JSON.parse(sessionStorage.getItem('steady-profile-draft') || '{}'); sessionStorage.removeItem('steady-profile-draft'); } catch (_) { /* private browsing */ }
    const choices = [...new Set([mine, window.STEADY_AVATAR.isCharacter(me.avatar) ? me.avatar : null].filter(Boolean)), ...AVATARS];
    dialog(data.me ? 'Edit profile' : 'Create profile',
      `<fieldset class="picker"><legend>${e(t('Your avatar'))}</legend><div class="avatar-grid">${choices.map(avatar => `<label><input type="radio" name="avatar" value="${e(avatar)}" ${avatar === current ? 'checked' : ''}><span>${window.STEADY_AVATAR.html(avatar)}</span></label>`).join('')}</div><a class="design-link" href="profile.html" id="design-character">${e(t('Design your character'))}</a> <small class="hint">${e(t('Optional'))}</small></fieldset>`
      + (data.me ? '' : field('handle', 'Username', draft.handle || '', 'input', 24)
      + `<small class="hint">${e(t('Use 3–24 lowercase letters, numbers, or underscores.'))}</small>`)
      + field('bio', 'About you', me.bio || draft.bio || (usingCharacter && window.STEADY_AVATAR.load()?.bio) || '', 'textarea', 280, false)
      + `<small class="hint">${e(t('Optional'))} · ${e(t('Profiles, posts, and comments are public. Your sign-in email is never displayed.'))}</small>`,
      async fields => {
        await mutate({ action: 'profile', isNew: !data.me, ...fields });
        handle = (fields.handle || data.me.handle).toLowerCase();
        postId = '';
        history.replaceState(null, '', `?profile=${encodeURIComponent(handle)}`);
      });
  }
  function openCompose() {
    if (needsAccount()) return;
    const start = topic !== 'all' ? topic : 'general';
    dialog('Ask a question',
      field('title', 'Title')
      + `<fieldset class="picker"><legend>${e(t('Topics'))}</legend><div class="topic-grid">${Object.entries(TOPICS).filter(([key]) => key !== 'all').map(([key, [label, name]]) => `<label><input type="radio" name="topic" value="${key}" ${key === start ? 'checked' : ''}><span>${icon(name)}${e(t(label))}</span></label>`).join('')}</div></fieldset>`
      + field('body', 'Your post', '', 'textarea', 6000),
      async fields => {
        const result = await mutate({ action: 'post', title: fields.title, body: fields.body, topic: fields.topic });
        postId = result.id; handle = '';
        history.replaceState(null, '', `?post=${encodeURIComponent(result.id)}`);
      }, 'Create a post');
  }

  // Keep what someone typed while they go to design a character.
  document.addEventListener('click', event => {
    if (!event.target.closest?.('#design-character')) return;
    try { sessionStorage.setItem('steady-profile-draft', JSON.stringify({ handle: $('#f-handle')?.value || '', bio: $('#f-bio')?.value || '' })); } catch (_) { /* private browsing */ }
  });
  document.addEventListener('click', async event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.id === 'compose' || 'compose' in button.dataset) return openCompose();
    if (button.id === 'edit-profile') return openProfile();
    if (button.id === 'retry') return load();
    if (button.id === 'new-sort') { sort = 'new'; return load(); }
    if (button.id === 'top-sort') { sort = 'top'; return load(); }
    if (button.id === 'close-editor') return $('#editor').close();
    if (button.dataset.topic) {
      topic = button.dataset.topic; postId = ''; handle = '';
      history.replaceState(null, '', 'community.html');
      return load();
    }
    try {
      if (button.dataset.moderate) {
        await backend.moderate(button.dataset.moderate, Boolean(button.dataset.to));
        return await load();
      }
      if (button.dataset.resolve) {
        await backend.resolve(button.dataset.resolve);
        return await load();
      }
      if (button.dataset.vote) {
        if (needsAccount()) return;
        button.disabled = true;
        const post = data.posts.find(item => item.id === button.dataset.id);
        const value = Number(button.dataset.vote);
        await mutate({ action: 'vote', id: post.id, value: post.myVote === value ? 0 : value });
        await load();
      }
      if (button.dataset.delete || button.dataset.deleteComment) {
        if (!confirm(t('Delete this permanently?'))) return;
        await mutate({ action: button.dataset.delete ? 'delete' : 'deleteComment', id: button.dataset.delete || button.dataset.deleteComment });
        await load();
      }
      if (button.dataset.edit) {
        const post = data.posts.find(item => item.id === button.dataset.edit);
        dialog('Edit', field('title', 'Title', post.title) + field('body', 'Your post', post.body, 'textarea', 6000), fields => mutate({ action: 'edit', id: post.id, title: fields.title, body: fields.body }));
      }
      if (button.dataset.editComment) {
        const comment = data.comments.find(item => item.id === button.dataset.editComment);
        dialog('Edit', field('body', 'Add a comment', comment.body, 'textarea', 2000), fields => mutate({ action: 'editComment', id: comment.id, body: fields.body }));
      }
      if (button.dataset.report) {
        if (needsAccount()) return;
        dialog('Report', `<p class="hint">${e(t('Reports are recorded for the site team. Review is not immediate.'))}</p>` + field('reason', 'Reason', '', 'textarea', 500), async fields => { await mutate({ action: 'report', id: button.dataset.report, reason: fields.reason }); }, 'Report');
      }
    } catch (error) {
      $('#status').textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
  $('#editor-form').addEventListener('submit', async event => {
    event.preventDefault();
    const submit = $('#editor-submit');
    submit.disabled = true;
    try {
      await editing(Object.fromEntries(new FormData(event.target)));
      $('#editor').close();
      await load();
    } catch (error) {
      $('#form-error').textContent = error.message;
    } finally {
      submit.disabled = false;
    }
  });
  document.addEventListener('submit', async event => {
    if (event.target.id !== 'comment-form') return;
    event.preventDefault();
    if (needsAccount()) return;
    const submit = event.target.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      await mutate({ action: 'comment', id: postId, body: $('#comment').value });
      await load();
    } catch (error) {
      $('#status').textContent = error.message;
      submit.disabled = false;
    }
  });
  // Demo sample posts come back in the new language, so fetch them again.
  window.addEventListener('steady-language-change', () => { if (backend.mode === 'demo') load(); else { render(); renderModeration(); } });
  load();
})();
