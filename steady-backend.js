// One place for sign-in and Community data. The pages call these functions and
// don't need to know whether they're talking to Supabase or the local test server.
(() => {
  const config = (typeof window !== 'undefined' && window.STEADY_CONFIG) || {};
  const mode = config.dev ? 'dev' : (config.supabaseUrl && config.supabaseKey ? 'supabase' : (config.demo ? 'demo' : 'none'));
  const fail = code => { const error = new Error(code); error.code = code; return error; };
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const NO_POST = '00000000-0000-0000-0000-000000000000';

  async function devCall(path, body) {
    let response;
    try {
      response = await fetch(path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {});
    } catch (_) { throw fail('unavailable'); }
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw fail(result.error || 'unavailable');
    return result;
  }
  const dev = {
    sendCode: email => devCall('/api/dev/send', { email }),
    verifyCode: (email, code) => devCall('/api/dev/verify', { email, code }),
    signOut: () => devCall('/api/dev/signout', {}),
    deleteAccount: () => devCall('/api/dev/delete', {}),
    me: () => devCall('/api/community?sort=new'),
    list: ({ sort, topic, post, profile }) => {
      const query = new URLSearchParams({ sort: sort || 'new' });
      if (topic) query.set('topic', topic);
      if (post) query.set('post', post);
      if (profile) query.set('profile', profile);
      return devCall(`/api/community?${query}`);
    },
    action: body => devCall('/api/community', body),
    queue: () => devCall('/api/dev/queue'),
    moderate: (post, hidden) => devCall('/api/dev/moderate', { post, hidden }),
    resolve: report => devCall('/api/dev/resolve', { report })
  };

  // Demo mode: for presentations before real accounts exist. Runs entirely in this
  // browser. No email is sent, nothing leaves the device, and people on other
  // devices can't see any of it. Any email works with the code 123456.
  function createDemo(storage, key, characterFor) {
    const DAY = 86400000, HOUR = 3600000;
    const face = (emoji, parts) => (characterFor ? characterFor(parts) : emoji);
    function seed() {
      const now = Date.now();
      const person = (handle, bio, avatar) => ({ handle, bio, avatar, created: now - 40 * DAY });
      const profiles = Object.fromEntries([
        person('maya_rides', 'Sample profile. Rideshare driver in Queens.', face('🌻', { skin: 6, hair: 5, hairColor: 0, eyes: 4, outfit: 2, outfitColor: 2, card: 1, work: 2 })),
        person('luis_delivers', 'Perfil de muestra. Repartidor en el Bronx.', face('🌊', { skin: 4, hair: 1, hairColor: 0, beard: 2, head: 6, headColor: 4, outfit: 3, outfitColor: 4, card: 2, work: 1 })),
        person('priya_freelance', 'Sample profile. Freelance designer in Jackson Heights.', face('🌿', { skin: 5, hair: 10, hairColor: 0, eyes: 1, glasses: 1, outfit: 4, outfitColor: 6, card: 4, work: 6 })),
        person('amina_cares', 'Sample profile. Home health aide in Brooklyn.', face('🪴', { skin: 7, head: 3, headColor: 2, eyes: 7, mouth: 6, outfit: 6, outfitColor: 0, card: 0, work: 4 }))
      ].map(profile => [profile.handle, profile]));
      const post = (id, title, body, topic, age, handle, base) => ({ id, title, body, topic, created: now - age, handle, votes: {}, base });
      const comment = (id, target, body, age, handle) => ({ id, post: target, body, created: now - age, handle });
      return {
        session: null, moderatorIds: [], accounts: {}, profiles, reports: [],
        posts: [
          post('sample-1', 'Sample: how much do you set aside for taxes each week?', 'I move a set percent of each payout into a separate account the day it lands. What works for you?', 'taxes', 3 * HOUR, 'maya_rides', 14),
          post('sample-2', 'Ejemplo: ¿cómo llevan el registro de sus millas?', 'Empecé a anotarlas cada noche. Se acumula rápido. ¿Alguien usa una app?', 'money', 20 * HOUR, 'luis_delivers', 9),
          post('sample-3', 'Sample: a client paid me two months late. What did you do?', 'I sent a written reminder with the invoice attached and kept a copy of everything. Curious what helped others.', 'work', 2 * DAY, 'priya_freelance', 21),
          post('sample-4', 'Sample: finding a clinic without insurance', 'I found a health center that sets fees by income. It took one phone call to get started.', 'health', 3 * DAY, 'amina_cares', 17),
          post('sample-5', 'Sample: what is one small thing that made a slow week easier?', 'Mine was planning around my lowest week instead of my best one.', 'general', 5 * DAY, 'maya_rides', 11)
        ],
        comments: [
          comment('sample-c1', 'sample-1', 'I do the same with a smaller percent, and raise it in busy months.', 2 * HOUR, 'priya_freelance'),
          comment('sample-c2', 'sample-1', 'Yo aparto un poco de cada pago. Así no me sorprende.', HOUR, 'luis_delivers'),
          comment('sample-c3', 'sample-3', 'Keeping every message saved helped me a lot.', DAY, 'amina_cares'),
          comment('sample-c4', 'sample-4', 'Thank you for sharing this. I did not know that was an option.', 2 * DAY, 'maya_rides')
        ]
      };
    }
    const fail = code => { const error = new Error(code); error.code = code; return error; };
    const pause = () => new Promise(resolve => setTimeout(resolve, 400));
    function read() {
      try {
        const saved = JSON.parse(storage.getItem(key) || 'null');
        if (saved && Array.isArray(saved.posts)) return saved;
      } catch (_) { /* damaged or blocked storage starts fresh */ }
      return seed();
    }
    let memory = null;
    const load = () => memory || read();
    function write(state) {
      try { storage.setItem(key, JSON.stringify(state)); memory = null; } catch (_) { memory = state; }
    }
    const newId = () => `demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const myHandle = state => (state.session ? state.accounts[state.session.email] || null : null);
    const isMod = state => state.session?.email === 'mod@example.com';
    const score = post => (post.base || 0) + Object.values(post.votes).reduce((sum, vote) => sum + vote, 0);
    const avatarOf = (state, handle) => state.profiles[handle]?.avatar;
    function view(state, post, me) {
      const { votes, base, ...rest } = post;
      return { ...rest, avatar: avatarOf(state, post.handle), mine: Number(Boolean(me) && me === post.handle), score: score(post), myVote: votes[me] || 0, comments: state.comments.filter(item => item.post === post.id).length };
    }
    function list({ sort, topic, post, profile } = {}) {
      const state = load();
      const me = myHandle(state), mod = isMod(state);
      let found = state.posts.filter(item => !item.hidden || item.handle === me || mod);
      if (topic) found = found.filter(item => item.topic === topic);
      if (post) found = found.filter(item => item.id === post);
      if (profile) found = found.filter(item => item.handle === profile);
      found.sort((a, b) => (sort === 'top' ? score(b) - score(a) : b.created - a.created));
      return {
        signedIn: Boolean(state.session), isModerator: mod, me: state.profiles[me] || null,
        posts: found.map(item => view(state, item, me)),
        comments: state.comments.filter(item => item.post === post).map(item => ({ ...item, avatar: avatarOf(state, item.handle), mine: Number(item.handle === me) })),
        profile: state.profiles[profile] || null
      };
    }
    return {
      // A short pause, like a real sign-in, so the key press that submitted the form
      // can't land on the next page and close its pop-up.
      async sendCode() { await pause(); return { ok: true }; },
      async verifyCode(email, code) {
        await pause();
        if (code !== '123456') throw fail('badcode');
        const state = load();
        state.session = { email: `${email}`.trim().toLowerCase() };
        write(state);
      },
      async signOut() { const state = load(); state.session = null; write(state); },
      async deleteAccount() {
        const state = load();
        const me = myHandle(state);
        if (me) {
          delete state.profiles[me];
          state.posts = state.posts.filter(item => item.handle !== me);
          state.comments = state.comments.filter(item => item.handle !== me);
          delete state.accounts[state.session.email];
        }
        state.session = null;
        write(state);
      },
      me: async () => list({ sort: 'new' }),
      list: async query => list(query),
      async action(body) {
        const state = load();
        if (!state.session) throw fail('signin');
        const me = myHandle(state);
        const { action, id } = body;
        if (action === 'profile') {
          if (body.isNew) {
            const name = `${body.handle || ''}`.toLowerCase();
            if (!/^[a-z0-9_]{3,24}$/.test(name)) throw fail('handle');
            if (state.profiles[name]) throw fail('taken');
            state.profiles[name] = { handle: name, bio: body.bio || '', avatar: body.avatar || '✳', created: Date.now() };
            state.accounts[state.session.email] = name;
          } else if (me) {
            Object.assign(state.profiles[me], { bio: body.bio || '', avatar: body.avatar || '✳' });
          }
          write(state);
          return { ok: true };
        }
        if (!me) throw fail('profile');
        const target = state.posts.find(item => item.id === id);
        const ownComment = state.comments.find(item => item.id === id && item.handle === me);
        let result = { ok: true };
        if (action === 'post') {
          const created = { id: newId(), title: body.title, body: body.body, topic: body.topic, created: Date.now(), handle: me, votes: {}, base: 0 };
          state.posts.push(created);
          result = { id: created.id };
        } else if (action === 'vote' && target) target.votes[me] = Number(body.value);
        else if (action === 'comment' && target) state.comments.push({ id: newId(), post: target.id, body: body.body, created: Date.now(), handle: me });
        else if (action === 'edit' && target?.handle === me) Object.assign(target, { title: body.title, body: body.body });
        else if (action === 'delete' && target?.handle === me) {
          state.posts = state.posts.filter(item => item !== target);
          state.comments = state.comments.filter(item => item.post !== target.id);
        } else if (action === 'editComment' && ownComment) ownComment.body = body.body;
        else if (action === 'deleteComment' && ownComment) state.comments = state.comments.filter(item => item !== ownComment);
        else if (action === 'report' && target) {
          if (!state.reports.some(item => item.post === target.id && item.by === me)) state.reports.push({ id: newId(), post: target.id, by: me, reason: body.reason || '', resolved: false, created: Date.now() });
        } else throw fail('forbidden');
        write(state);
        return result;
      },
      async queue() {
        const state = load();
        if (!isMod(state)) throw fail('forbidden');
        return state.reports.filter(item => !item.resolved).map(item => {
          const post = state.posts.find(entry => entry.id === item.post);
          return { id: item.id, reason: item.reason, postId: item.post, title: post?.title || '', hidden: Boolean(post?.hidden), created: item.created };
        });
      },
      async moderate(postId, hidden) {
        const state = load();
        if (!isMod(state)) throw fail('forbidden');
        const post = state.posts.find(item => item.id === postId);
        if (post) post.hidden = Boolean(hidden);
        write(state);
        return { ok: true };
      },
      async resolve(reportId) {
        const state = load();
        if (!isMod(state)) throw fail('forbidden');
        const report = state.reports.find(item => item.id === reportId);
        if (report) report.resolved = true;
        write(state);
        return { ok: true };
      },
      reset() { memory = null; try { storage.removeItem(key); } catch (_) { /* blocked storage */ } }
    };
  }

  let clientPromise;
  function client() {
    clientPromise ||= new Promise((resolve, reject) => {
      const tag = document.createElement('script');
      tag.src = 'vendor/supabase.js';
      tag.onload = () => resolve(window.supabase.createClient(config.supabaseUrl, config.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }));
      tag.onerror = () => reject(fail('unavailable'));
      document.head.append(tag);
    });
    return clientPromise;
  }
  function databaseError(error, invalidAs = 'invalid') {
    const text = `${error.message || ''}`;
    if (text.includes('slow')) return fail('slow');
    if (text.includes('forbidden') || error.code === '42501') return fail('forbidden');
    if (error.code === '23505') return fail('taken');
    if (error.code === '23514') return fail(invalidAs);
    if (error.code === '23503') return fail('profile');
    if (error.code === '22P02' || error.code === '23502') return fail('invalid');
    return fail('unavailable');
  }
  async function run(request, invalidAs) {
    const { data, error } = await request;
    if (error) throw databaseError(error, invalidAs);
    return data;
  }
  async function userId() {
    const { data } = await (await client()).auth.getSession();
    if (!data.session) throw fail('signin');
    return data.session.user.id;
  }
  const remote = {
    async sendCode(email) {
      const { error } = await (await client()).auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
      if (error) throw fail(error.status === 429 ? 'ratelimit' : 'sendfail');
    },
    async verifyCode(email, code) {
      const { error } = await (await client()).auth.verifyOtp({ email, token: code, type: 'email' });
      if (error) throw fail(error.status === 429 ? 'ratelimit' : 'badcode');
    },
    async signOut() { await (await client()).auth.signOut(); },
    async deleteAccount() {
      const db = await client();
      await run(db.rpc('delete_my_account'));
      await db.auth.signOut({ scope: 'local' });
    },
    me: async () => run((await client()).rpc('community_me')),
    list: async ({ sort, topic, post, profile }) => run((await client()).rpc('community_list', {
      p_sort: sort || 'new', p_topic: topic || null,
      p_post: post ? (UUID.test(post) ? post : NO_POST) : null, p_profile: profile || null
    })),
    async action(body) {
      const db = await client();
      const me = await userId();
      const { action, id } = body;
      if (action === 'profile') {
        const fields = { bio: body.bio || '', avatar: body.avatar };
        if (body.isNew) return run(db.from('profiles').insert({ id: me, handle: `${body.handle}`.toLowerCase(), ...fields }), 'handle');
        return run(db.from('profiles').update(fields).eq('id', me));
      }
      if (action === 'post') return run(db.from('posts').insert({ author_id: me, title: body.title, body: body.body, topic: body.topic }).select('id').single());
      if (action === 'edit') return run(db.from('posts').update({ title: body.title, body: body.body }).eq('id', id));
      if (action === 'delete') return run(db.from('posts').delete().eq('id', id));
      if (action === 'comment') return run(db.from('comments').insert({ post_id: id, author_id: me, body: body.body }));
      if (action === 'editComment') return run(db.from('comments').update({ body: body.body }).eq('id', id));
      if (action === 'deleteComment') return run(db.from('comments').delete().eq('id', id));
      if (action === 'vote') {
        if (!body.value) return run(db.from('votes').delete().eq('post_id', id).eq('user_id', me));
        return run(db.from('votes').upsert({ post_id: id, user_id: me, value: body.value }));
      }
      if (action === 'report') {
        const { error } = await db.from('reports').insert({ post_id: id, reporter_id: me, reason: body.reason });
        // Reporting the same post twice isn't a problem worth showing.
        if (error && error.code !== '23505') throw databaseError(error);
        return null;
      }
      throw fail('invalid');
    },
    queue: async () => run((await client()).rpc('moderation_queue')),
    moderate: async (post, hidden) => run((await client()).rpc('moderate_post', { p_post: post, p_hidden: hidden })),
    resolve: async report => run((await client()).rpc('resolve_report', { p_report: report }))
  };
  const offline = async () => { throw fail('offline'); };
  const none = Object.fromEntries(Object.keys(remote).map(name => [name, offline]));
  if (typeof module !== 'undefined') module.exports = { createDemo };
  if (typeof window === 'undefined') return;
  // Each public site keeps its own demo data, even though they share a web address.
  const demoFor = () => createDemo(window.localStorage, `steady-demo:${location.pathname.split('/').length > 2 ? location.pathname.split('/')[1] : 'local'}`,
    window.STEADY_AVATAR ? parts => window.STEADY_AVATAR.encode({ ...window.STEADY_AVATAR.defaults(), ...parts }) : null);
  window.STEADY_BACKEND = { mode, ...(mode === 'dev' ? dev : mode === 'supabase' ? remote : mode === 'demo' ? demoFor() : none) };
})();
