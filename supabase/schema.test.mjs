// Runs supabase/schema.sql on a throwaway in-memory Postgres and tests its rules.
// Setup: npm i --no-save @electric-sql/pglite    Run: node supabase/schema.test.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const db = new PGlite();
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth;
  grant usage on schema auth, public to anon, authenticated;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
  grant execute on function auth.uid() to anon, authenticated;
`);
await db.exec(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));

const [A, B, MOD] = ['aaaaaaaa-0000-4000-8000-000000000001', 'bbbbbbbb-0000-4000-8000-000000000002', 'cccccccc-0000-4000-8000-000000000003'];
await db.query(`insert into auth.users values ($1,'a@example.com'),($2,'b@example.com'),($3,'m@example.com')`, [A, B, MOD]);
await db.query('insert into public.moderators values ($1)', [MOD]);

async function as(uid, sql, params = []) {
  await db.exec(`reset role; select set_config('test.uid', '${uid || ''}', false); set role ${uid ? 'authenticated' : 'anon'};`);
  try { return await db.query(sql, params); } finally { await db.exec('reset role'); }
}
const rejects = (promise, pattern) => assert.rejects(promise, pattern);
const list = async (uid, args = "") => (await as(uid, `select public.community_list(${args}) as r`)).rows[0].r;
const age = () => db.exec(`update public.posts set created_at = created_at - interval '1 minute'; update public.comments set created_at = created_at - interval '1 minute'`);

// Profiles
await rejects(as(null, `insert into public.profiles (id, handle) values ($1,'nobody')`, [A]), /permission denied/);
await rejects(as(A, `insert into public.profiles (id, handle) values ($1,'stolen')`, [B]), /row-level security/);
await rejects(as(A, `insert into public.profiles (id, handle) values ($1,'NOT VALID')`, [A]), /check constraint/);
await as(A, `insert into public.profiles (id, handle) values ($1,'alice')`, [A]);
await rejects(as(B, `insert into public.profiles (id, handle) values ($1,'alice')`, [B]), /duplicate key/);
await as(B, `insert into public.profiles (id, handle, bio) values ($1,'bob','hi')`, [B]);
await as(MOD, `insert into public.profiles (id, handle) values ($1,'mod')`, [MOD]);
await rejects(as(A, `update public.profiles set handle = 'renamed' where id = $1`, [A]), /permission denied/);
assert.equal((await as(A, `update public.profiles set bio = 'x' where id = $1 returning 1`, [B])).rows.length, 0);

// Posts
await rejects(as(null, `insert into public.posts (author_id,title,body,topic) values ($1,'t','b','general')`, [A]), /permission denied/);
await rejects(as(A, `insert into public.posts (author_id,title,body,topic) values ($1,'t','b','general')`, [B]), /row-level security/);
const postId = (await as(A, `insert into public.posts (author_id,title,body,topic) values ($1,'Hello','Body','taxes') returning id`, [A])).rows[0].id;
await rejects(as(A, `insert into public.posts (author_id,title,body,topic) values ($1,'Again','Body','taxes')`, [A]), /slow/);
await age();
await rejects(as(A, `insert into public.posts (author_id,title,body,topic,hidden) values ($1,'x','y','taxes',false)`, [A]), /permission denied/);
await rejects(as(A, `update public.posts set hidden = true where id = $1`, [postId]), /permission denied/);
await rejects(as(A, `update public.posts set author_id = $1 where id = $2`, [B, postId]), /permission denied/);
assert.equal((await as(B, `update public.posts set title = 'hacked' where id = $1 returning 1`, [postId])).rows.length, 0);
assert.equal((await as(B, `delete from public.posts where id = $1 returning 1`, [postId])).rows.length, 0);
assert.equal((await as(A, `update public.posts set title = 'Edited' where id = $1 returning 1`, [postId])).rows.length, 1);

// Votes
await rejects(as(null, `insert into public.votes (post_id,user_id,value) values ($1,$2,1)`, [postId, A]), /permission denied/);
await rejects(as(A, `insert into public.votes (post_id,user_id,value) values ($1,$2,1)`, [postId, B]), /row-level security/);
await rejects(as(A, `insert into public.votes (post_id,user_id,value) values ($1,$2,5)`, [postId, A]), /check constraint/);
await as(A, `insert into public.votes (post_id,user_id,value) values ($1,$2,1)`, [postId, A]);
await as(B, `insert into public.votes (post_id,user_id,value) values ($1,$2,1)`, [postId, B]);
assert.equal((await as(A, 'select * from public.votes')).rows.length, 1, 'only your own votes are readable');

// Feed
const anonFeed = await list(null);
assert.equal(anonFeed.signedIn, false);
assert.equal(anonFeed.me, null);
assert.equal(anonFeed.posts[0].score, 2);
assert.equal(anonFeed.posts[0].mine, 0);
assert.ok(!JSON.stringify(anonFeed).includes('@example.com'), 'no email addresses');
const mine = await list(A);
assert.equal(mine.posts[0].mine, 1);
assert.equal(mine.posts[0].myVote, 1);
assert.equal(mine.me.handle, 'alice');
assert.equal((await list(null, "'new', 'health'")).posts.length, 0);
assert.equal((await list(null, "'new', 'taxes'")).posts.length, 1);
assert.equal((await list(null, "'new', null, null, 'bob'")).profile.bio, 'hi');

// Comments
const commentId = (await as(B, `insert into public.comments (post_id,author_id,body) values ($1,$2,'Nice') returning id`, [postId, B])).rows[0].id;
await rejects(as(B, `insert into public.comments (post_id,author_id,body) values ($1,$2,'Spam')`, [postId, B]), /slow/);
assert.equal((await as(A, `delete from public.comments where id = $1 returning 1`, [commentId])).rows.length, 0);
const detail = await list(A, `'new', null, '${postId}'`);
assert.equal(detail.comments.length, 1);
assert.equal(detail.posts[0].comments, 1);

// Reports and moderation
await rejects(as(null, `insert into public.reports (post_id,reporter_id,reason) values ($1,$2,'r')`, [postId, B]), /permission denied/);
await rejects(as(A, `insert into public.reports (post_id,reporter_id,reason) values ($1,$2,'r')`, [postId, B]), /row-level security/);
await as(B, `insert into public.reports (post_id,reporter_id,reason) values ($1,$2,'Rude')`, [postId, B]);
await rejects(as(B, 'select * from public.reports'), /permission denied/);
await rejects(as(B, 'select public.moderation_queue()'), /forbidden/);
await rejects(as(B, `select public.moderate_post($1, true)`, [postId]), /forbidden/);
await rejects(as(null, 'select public.moderation_queue()'), /permission denied/);
await rejects(as(B, `insert into public.moderators values ($1)`, [B]), /permission denied/);
await rejects(as(B, 'select * from public.moderators'), /permission denied/);
const queue = (await as(MOD, 'select public.moderation_queue() as q')).rows[0].q;
assert.equal(queue.length, 1);
assert.equal(queue[0].reason, 'Rude');
await as(MOD, `select public.moderate_post($1, true)`, [postId]);
assert.equal((await list(null)).posts.length, 0, 'hidden from the public');
assert.equal((await as(null, 'select * from public.posts')).rows.length, 0, 'hidden from direct reads');
assert.equal((await list(B)).posts.length, 0, 'hidden from others');
assert.equal((await list(A)).posts.length, 1, 'still visible to its author');
assert.equal((await list(MOD)).posts.length, 1, 'still visible to moderators');
await as(MOD, `select public.moderate_post($1, false)`, [postId]);
assert.equal((await list(null)).posts.length, 1);
await as(MOD, `select public.resolve_report($1)`, [queue[0].id]);
assert.equal((await as(MOD, 'select public.moderation_queue() as q')).rows[0].q.length, 0);

// Account deletion removes only that person
await rejects(as(null, 'select public.delete_my_account()'), /permission denied/);
await as(B, 'select public.delete_my_account()');
assert.equal((await db.query('select * from auth.users where id = $1', [B])).rows.length, 0);
assert.equal((await db.query('select * from public.profiles where id = $1', [B])).rows.length, 0);
assert.equal((await db.query('select * from public.comments')).rows.length, 0);
assert.equal((await list(null)).posts[0].score, 1);
assert.equal((await db.query('select * from auth.users')).rows.length, 2);

console.log('PASS: database rules for profiles, posts, votes, comments, reports, moderation and account deletion.');
