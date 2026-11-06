-- Steady community database for Supabase. Run once in the SQL Editor.
-- People's email addresses stay in Supabase's private auth.users table; nothing
-- here stores or returns them.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text not null unique check (handle ~ '^[a-z0-9_]{3,24}$'),
  bio text not null default '' check (char_length(bio) <= 280),
  avatar text not null default '✳' check (avatar in ('✳', '🌿', '☀', '🌻', '🌊', '🪴') or avatar ~ '^c1\.[0-9a-z]{25}$'),
  created_at timestamptz not null default now()
);

-- Add moderators by hand in the Supabase Table Editor. The site cannot change this table.
create table public.moderators (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  body text not null check (char_length(btrim(body)) between 1 and 6000),
  topic text not null check (topic in ('general', 'money', 'taxes', 'health', 'work')),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index posts_created_idx on public.posts (created_at desc);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index comments_post_idx on public.comments (post_id, created_at);

create table public.votes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  primary key (post_id, user_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null check (char_length(btrim(reason)) between 1 and 500),
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

-- Lock everything down, then allow only what the site needs.
alter table public.profiles enable row level security;
alter table public.moderators enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;
alter table public.reports enable row level security;

revoke all on public.profiles, public.moderators, public.posts, public.comments, public.votes, public.reports from public, anon, authenticated;

grant select on public.profiles to anon, authenticated;
grant insert (id, handle, bio, avatar), update (bio, avatar) on public.profiles to authenticated;
grant select on public.posts, public.comments to anon, authenticated;
grant insert (author_id, title, body, topic), update (title, body), delete on public.posts to authenticated;
grant insert (post_id, author_id, body), update (body), delete on public.comments to authenticated;
grant select, insert (post_id, user_id, value), update (value), delete on public.votes to authenticated;
grant insert (post_id, reporter_id, reason) on public.reports to authenticated;

create function public.is_moderator() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.moderators m where m.user_id = auth.uid());
$$;

create policy "profiles are public" on public.profiles for select using (true);
create policy "create own profile" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "edit own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "see visible posts" on public.posts for select using (not hidden or author_id = auth.uid() or public.is_moderator());
create policy "create own posts" on public.posts for insert to authenticated with check (author_id = auth.uid());
create policy "edit own posts" on public.posts for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "delete own posts" on public.posts for delete to authenticated using (author_id = auth.uid());

create policy "see visible comments" on public.comments for select using (not hidden or author_id = auth.uid() or public.is_moderator());
create policy "create own comments" on public.comments for insert to authenticated with check (author_id = auth.uid());
create policy "edit own comments" on public.comments for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "delete own comments" on public.comments for delete to authenticated using (author_id = auth.uid());

create policy "see own votes" on public.votes for select to authenticated using (user_id = auth.uid());
create policy "cast own votes" on public.votes for insert to authenticated with check (user_id = auth.uid());
create policy "change own votes" on public.votes for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "remove own votes" on public.votes for delete to authenticated using (user_id = auth.uid());

create policy "file own reports" on public.reports for insert to authenticated with check (reporter_id = auth.uid());

-- Slow down rapid posting. The site shows this as "please wait a moment".
create function public.limit_posting() returns trigger
language plpgsql security definer set search_path = '' as $$
declare recent timestamptz;
begin
  if tg_table_name = 'posts' then
    select max(created_at) into recent from public.posts where author_id = new.author_id;
  else
    select max(created_at) into recent from public.comments where author_id = new.author_id;
  end if;
  if recent is not null and recent > now() - interval '15 seconds' then
    raise exception 'slow';
  end if;
  return new;
end;
$$;
create trigger posts_limit before insert on public.posts for each row execute function public.limit_posting();
create trigger comments_limit before insert on public.comments for each row execute function public.limit_posting();

-- Everything the Community page shows, in one call. Never includes email addresses.
create function public.community_me() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'signedIn', auth.uid() is not null,
    'isModerator', public.is_moderator(),
    'me', (select jsonb_build_object('handle', p.handle, 'bio', p.bio, 'avatar', p.avatar) from public.profiles p where p.id = auth.uid())
  );
$$;

create function public.community_list(p_sort text default 'new', p_topic text default null, p_post uuid default null, p_profile text default null)
returns jsonb
language sql stable security definer set search_path = '' as $$
  with visible as (
    select p.*, a.handle, a.avatar,
      coalesce((select sum(v.value) from public.votes v where v.post_id = p.id), 0)::int as score,
      coalesce((select v.value from public.votes v where v.post_id = p.id and v.user_id = auth.uid()), 0)::int as my_vote,
      (select count(*) from public.comments c where c.post_id = p.id and not c.hidden)::int as comment_count
    from public.posts p join public.profiles a on a.id = p.author_id
    where (not p.hidden or p.author_id = auth.uid() or public.is_moderator())
      and (p_topic is null or p.topic = p_topic)
      and (p_post is null or p.id = p_post)
      and (p_profile is null or a.handle = p_profile)
    order by case when p_sort = 'top' then coalesce((select sum(v.value) from public.votes v where v.post_id = p.id), 0) end desc nulls last, p.created_at desc
    limit 50
  )
  select public.community_me() || jsonb_build_object(
    'posts', coalesce((select jsonb_agg(jsonb_build_object(
        'id', v.id, 'title', v.title, 'body', v.body, 'topic', v.topic, 'handle', v.handle, 'avatar', v.avatar,
        'created', (extract(epoch from v.created_at) * 1000)::bigint, 'score', v.score, 'myVote', v.my_vote,
        'comments', v.comment_count, 'hidden', v.hidden, 'mine', coalesce(v.author_id = auth.uid(), false)::int)) from visible v), '[]'::jsonb),
    'comments', case when p_post is null then '[]'::jsonb else coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'body', c.body, 'handle', a.handle, 'avatar', a.avatar,
        'created', (extract(epoch from c.created_at) * 1000)::bigint, 'mine', coalesce(c.author_id = auth.uid(), false)::int) order by c.created_at)
      from public.comments c join public.profiles a on a.id = c.author_id
      where c.post_id = p_post and (not c.hidden or c.author_id = auth.uid() or public.is_moderator())), '[]'::jsonb) end,
    'profile', (select jsonb_build_object('handle', a.handle, 'bio', a.bio, 'avatar', a.avatar,
        'created', (extract(epoch from a.created_at) * 1000)::bigint) from public.profiles a where a.handle = p_profile)
  );
$$;

-- Moderators only.
create function public.moderation_queue() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'forbidden'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id', r.id, 'reason', r.reason, 'postId', p.id, 'title', p.title, 'hidden', p.hidden,
      'created', (extract(epoch from r.created_at) * 1000)::bigint) order by r.created_at)
    from public.reports r join public.posts p on p.id = r.post_id where not r.resolved), '[]'::jsonb);
end;
$$;

create function public.moderate_post(p_post uuid, p_hidden boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'forbidden'; end if;
  update public.posts set hidden = p_hidden where id = p_post;
end;
$$;

create function public.resolve_report(p_report uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_moderator() then raise exception 'forbidden'; end if;
  update public.reports set resolved = true where id = p_report;
end;
$$;

-- Lets a person delete their own account, profile, posts, comments and votes.
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'signin'; end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.is_moderator(), public.limit_posting(), public.community_me(), public.community_list(text, text, uuid, text), public.moderation_queue(), public.moderate_post(uuid, boolean), public.resolve_report(uuid), public.delete_my_account() from public, anon, authenticated;
grant execute on function public.is_moderator(), public.community_me(), public.community_list(text, text, uuid, text) to anon, authenticated;
grant execute on function public.moderation_queue(), public.moderate_post(uuid, boolean), public.resolve_report(uuid), public.delete_my_account() to authenticated;
