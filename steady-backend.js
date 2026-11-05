// One place for sign-in and Community data. The pages call these functions and
// don't need to know whether they're talking to Supabase or the local test server.
(() => {
  const config = window.STEADY_CONFIG || {};
  const mode = config.dev ? 'dev' : (config.supabaseUrl && config.supabaseKey ? 'supabase' : 'none');
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
  window.STEADY_BACKEND = { mode, ...(mode === 'dev' ? dev : mode === 'supabase' ? remote : none) };
})();
