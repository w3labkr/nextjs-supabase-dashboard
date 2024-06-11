----------------------------------------------------------------
--                                                            --
--                           Config                           --
--                                                            --
----------------------------------------------------------------

-- PostgREST Aggregate Functions
-- https://supabase.com/blog/postgrest-aggregate-functions

-- Staying Safe with Aggregate Functions
-- ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';
-- NOTIFY pgrst, 'reload config';

----------------------------------------------------------------
--                                                            --
--                         extensions                         --
--                                                            --
----------------------------------------------------------------

-- Cryptographic functions
-- create extension if not exists pgcrypto schema extensions;

-- Functions for tracking last modification time
-- create extension if not exists moddatetime schema extensions;

-- Job scheduler for PostgreSQL
-- create extension if not exists pg_cron;

-- grant usage on schema cron to postgres;
-- grant all privileges on all tables in schema cron to postgres;

----------------------------------------------------------------
--                                                            --
--                       Job Scheduling                       --
--                                                            --
----------------------------------------------------------------

truncate table cron.job_run_details restart identity;

select cron.unschedule('hourly-publish-future-posts');

drop function if exists hourly_publish_future_posts;

select cron.schedule('hourly-publish-future-posts', '0 * * * *', 'SELECT hourly_publish_future_posts()');

----------------------------------------------------------------
--                                                            --
--                          Storage                           --
--                                                            --
----------------------------------------------------------------

delete from storage.objects where bucket_id = 'my_bucket_id';
delete from storage.buckets where id = 'my_bucket_id';

drop policy if exists "Public access for all users" on storage.objects;
drop policy if exists "User can upload in their own folders" on storage.objects;
drop policy if exists "User can update their own objects" on storage.objects;
drop policy if exists "User can delete their own objects" on storage.objects;

insert into storage.buckets (id, name, public) values ('my_bucket_id', 'my_bucket_id', true);

create policy "Public access for all users" on storage.objects
  for select to authenticated, anon using (bucket_id = 'my_bucket_id');
create policy "User can upload in their own folders" on storage.objects
  for insert to authenticated with check (bucket_id = 'my_bucket_id' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "User can update their own objects" on storage.objects
  for update to authenticated using (owner_id = (select auth.uid()::text));
create policy "User can delete their own objects" on storage.objects
  for delete to authenticated using (owner_id = (select auth.uid()::text));

----------------------------------------------------------------
--                                                            --
--                           reset                            --
--                                                            --
----------------------------------------------------------------

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_password_updated on auth.users;
drop trigger if exists on_updated_at on users;
drop trigger if exists on_username_updated on users;
drop trigger if exists on_updated_at on role_permissions;
drop trigger if exists on_updated_at on user_roles;
drop trigger if exists on_updated_at on user_plans;
drop trigger if exists on_updated_at on users;
drop trigger if exists on_updated_at on emails;
drop trigger if exists on_updated_at on notifications;
drop trigger if exists on_updated_at on votes;
drop trigger if exists on_updated_at on favorites;
drop trigger if exists on_updated_at on posts;
drop trigger if exists on_slug_upsert on posts;

----------------------------------------------------------------

drop function if exists generate_password;
drop function if exists generate_username;
drop function if exists handle_has_set_password;
drop function if exists verify_user_password;
drop function if exists handle_new_user;
drop function if exists create_new_user;
drop function if exists assign_user_data;

drop function if exists handle_username_changed_at;
drop function if exists get_users;
drop function if exists set_user_meta;
drop function if exists set_user_role;
drop function if exists set_user_plan;

drop function if exists get_vote;
drop function if exists set_favorite;
drop function if exists set_post_meta;
drop function if exists set_view_count;
drop function if exists generate_slug;
drop function if exists count_posts;
drop function if exists get_adjacent_post_id;
drop function if exists create_new_posts;
drop function if exists truncate_posts;

----------------------------------------------------------------

drop table if exists analyses;
drop table if exists votes;
drop table if exists favorites;
drop table if exists post_metas;
drop table if exists posts;
drop table if exists notifications;
drop table if exists emails;
drop table if exists role_permissions;
drop table if exists user_roles;
drop table if exists user_plans;
drop table if exists user_metas;
drop table if exists users;

----------------------------------------------------------------
--                                                            --
--                         auth.users                         --
--                                                            --
----------------------------------------------------------------

create or replace function generate_password()
returns text
security definer set search_path = public
as $$
begin
  return trim(both from (encode(decode(md5(random()::text || current_timestamp || random()),'hex'),'base64')), '=');
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function generate_username(email text)
returns text
security definer set search_path = public
as $$
declare
  new_username text;
  username_exists boolean;
begin
  new_username := lower(split_part(email, '@', 1));
  select exists(select 1 from users where username = new_username) into username_exists;

  while username_exists loop
    new_username := new_username || '_' || to_char(trunc(random()*1000000), 'fm000000');
    select exists(select 1 from users where username = new_username) into username_exists;
  end loop;

  return new_username;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function handle_has_set_password()
returns trigger
security definer set search_path = public
as $$
declare
  new_has_set_password boolean;
begin
  new_has_set_password := case when (new.encrypted_password is null or new.encrypted_password = '') then false else true end;
  update users set has_set_password = new_has_set_password where id = new.id;
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_password_updated after update of encrypted_password on auth.users
  for each row execute function handle_has_set_password();

----------------------------------------------------------------

create or replace function verify_user_password(userid uuid, password text)
returns boolean
security definer set search_path = public, extensions, auth
as $$
begin
  return exists (
    select id
    from auth.users
    where id = userid
      and encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function handle_new_user()
returns trigger
security definer set search_path = public
as $$
declare
  new_username text;
  new_has_set_password boolean;
begin
  new_username := generate_username(new.email);
  new_username := substr(new_username, 1, 255);
  new_has_set_password := case when new.encrypted_password is null or new.encrypted_password = '' then false else true end;

  insert into users
  (id, has_set_password, username, full_name, avatar_url)
  values
  (new.id, new_has_set_password, new_username, new_username, new.raw_user_meta_data ->> 'avatar_url');
  insert into emails (user_id, email) values (new.id, new.email);
  insert into user_roles (user_id) values (new.id);
  insert into user_plans (user_id) values (new.id);
  insert into notifications (user_id) values (new.id);

  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure handle_new_user();

----------------------------------------------------------------

create or replace function create_new_user(useremail text, password text = null, metadata JSONB = '{}'::JSONB)
returns uuid
as $$
declare
  user_id uuid;
  encrypted_pw text;
  app_metadata jsonb;
begin
  select id into user_id from auth.users where email = useremail;

  if user_id is null then
    user_id := gen_random_uuid();
    encrypted_pw := crypt(password, gen_salt('bf'));
    app_metadata := '{"provider":"email","providers":["email"]}'::jsonb || metadata::jsonb;

    insert into auth.users
    (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    values
    ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', useremail, encrypted_pw, now(), now(), now(), now(), app_metadata, '{}', now(), now(), '', '', '', '');

    insert into auth.identities
    (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values
    (gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, useremail)::jsonb, 'email', now(), now(), now());
  end if;

  return user_id;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function assign_user_data()
returns void
security definer set search_path = public
as $$
declare
  r record;
  new_username text;
  new_has_set_password boolean;
begin
  for r in (select * from auth.users) loop

    new_username := generate_username(r.email);
    new_username := substr(new_username, 1, 255);
    new_has_set_password := case when r.encrypted_password is null or r.encrypted_password = '' then false else true end;

    insert into users
    (id, has_set_password, username, full_name, avatar_url)
    values
    (r.id, new_has_set_password, new_username, new_username, r.raw_user_meta_data ->> 'avatar_url');
    insert into emails (user_id, email) values (r.id, r.email);
    insert into user_roles (user_id) values (r.id);
    insert into user_plans (user_id) values (r.id);
    insert into notifications (user_id) values (r.id);

  end loop;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                        public.users                        --
--                                                            --
----------------------------------------------------------------

create table users (
  id uuid not null references auth.users on delete cascade primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  email varchar(255),
  full_name text,
  first_name text,
  last_name text,
  age integer,
  avatar_url text,
  website text,
  bio text,
  username text not null,
  username_changed_at timestamptz,
  has_set_password boolean default false not null,
  is_ban boolean default false not null,
  banned_until timestamptz,
  unique (username)
);
comment on column users.updated_at is 'on_updated_at';
comment on column users.username_changed_at is 'on_username_updated';
comment on column users.has_set_password is 'on_auth_user_password_updated';

alter table users enable row level security;

create policy "Public access for all users" on users for select to authenticated, anon using ( true );
create policy "User can insert their own users" on users for insert to authenticated with check ( (select auth.uid()) = id );
create policy "User can update their own users" on users for update to authenticated using ( (select auth.uid()) = id );
create policy "User can delete their own users" on users for delete to authenticated using ( (select auth.uid()) = id );

create trigger on_updated_at before update on users
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------

create or replace function handle_username_changed_at()
returns trigger
security definer set search_path = public
as $$
begin
  update users set username_changed_at = now() where id = new.id;
  return new;
end;
$$ language plpgsql;

create trigger on_username_updated after update of username on users
  for each row execute function handle_username_changed_at();

----------------------------------------------------------------

create or replace function get_users(userrole text = null, userplan text = null)
returns setof users
security definer set search_path = public
as $$
begin
	if userrole is not null and userplan is not null then
		return query
      select u.*
      from users u
        join user_roles ur on u.id = ur.user_id
        join user_plans up on u.id = up.user_id
      where ur.role = userrole and up.plan = userplan;
	elsif userrole is not null then
		return query
      select u.*
      from users u join user_roles ur on u.id = ur.user_id
      where ur.role = userrole;
	elsif userplan is not null then
    return query
      select u.*
      from users u join user_plans up on u.id = up.user_id
      where up.plan = userplan;
	end if;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                     public.user_metas                      --
--                                                            --
----------------------------------------------------------------

create table user_metas (
  id bigint generated by default as identity primary key,
  user_id uuid references users(id) on delete cascade not null,
  meta_key varchar(255) not null,
  meta_value text,
  unique (user_id, meta_key)
);

alter table user_metas enable row level security;

create policy "Public access for all users" on user_metas for select to authenticated, anon using ( true );
create policy "User can insert their own user_metas" on user_metas for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own user_metas" on user_metas for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own user_metas" on user_metas for delete to authenticated using ( (select auth.uid()) = user_id );

----------------------------------------------------------------

create or replace function set_user_meta(userid bigint, metakey text, metavalue text)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from user_metas where user_id = userid and meta_key = metakey) then
    update user_metas set meta_value = metavalue where user_id = userid and meta_key = metakey;
  else
    insert into user_metas(user_id, meta_key, meta_value) values(userid, metakey, metavalue);
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                     public.user_roles                      --
--                                                            --
----------------------------------------------------------------

create table user_roles (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  user_id uuid references users(id) on delete cascade not null,
  role text default 'guest'::text not null,
  unique (user_id, role)
);
comment on column user_roles.updated_at is 'on_updated_at';
comment on column user_roles.role is 'guest, user, admin, superadmin';

alter table user_roles enable row level security;

create policy "Public access for all users" on user_roles for select to authenticated, anon using ( true );
create policy "User can insert their own user_roles" on user_roles for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own user_roles" on user_roles for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own user_roles" on user_roles for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger on_updated_at before update on user_roles
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------

create or replace function set_user_role(userrole text, userid uuid = null, useremail text = null)
returns void
security definer set search_path = public
as $$
begin
  if userid is not null and useremail is not null then
    update user_roles set role = userrole
    from auth.users u
    where user_id = u.id and u.id = userid and u.email = useremail;
  elsif userid is not null then
    update user_roles set role = userrole
    from auth.users u
    where user_id = u.id and u.id = userid;
  elsif useremail is not null then
    update user_roles set role = userrole
    from auth.users u
    where user_id = u.id and u.email = useremail;
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                  public.role_permissions                   --
--                                                            --
----------------------------------------------------------------

create table role_permissions (
  id bigint generated by default as identity primary key,
  role text not null,
  permission text not null,
  unique (role, permission)
);

alter table role_permissions enable row level security;

create policy "Public access for all users" on role_permissions for select to authenticated, anon using ( true );
create policy "User can insert role_permissions" on role_permissions for insert to authenticated with check ( true );
create policy "User can update role_permissions" on role_permissions for update to authenticated using ( true );
create policy "User can delete role_permissions" on role_permissions for delete to authenticated using ( true );

----------------------------------------------------------------
--                                                            --
--                     public.user_plans                      --
--                                                            --
----------------------------------------------------------------

create table user_plans (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  user_id uuid references users(id) on delete cascade not null,
  plan text default 'free'::text not null,
  unique (user_id, plan)
);
comment on column user_plans.updated_at is 'on_updated_at';
comment on column user_plans.plan is 'free, basic, standard, premium';

alter table user_plans enable row level security;

create policy "Public access for all users" on user_plans for select to authenticated, anon using ( true );
create policy "User can insert their own user_plans" on user_plans for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own user_plans" on user_plans for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own user_plans" on user_plans for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger on_updated_at before update on user_plans
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------

create or replace function set_user_plan(userplan text, userid uuid = null, useremail text = null)
returns void
security definer set search_path = public
as $$
begin
  if userid is not null and useremail is not null then
    update user_plans set plan = userplan
    from auth.users u
    where user_id = u.id and u.id = userid and u.email = useremail;
  elsif userid is not null then
    update user_plans set plan = userplan
    from auth.users u
    where user_id = u.id and u.id = userid;
  elsif useremail is not null then
    update user_plans set plan = userplan
    from auth.users u
    where user_id = u.id and u.email = useremail;
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                       public.emails                        --
--                                                            --
----------------------------------------------------------------

create table emails (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  user_id uuid references users(id) on delete cascade not null,
  email varchar(255) not null,
  email_confirmed_at timestamptz,
  unique (user_id, email)
);
comment on column emails.updated_at is 'on_updated_at';

alter table emails enable row level security;

create policy "User can select their own emails" on emails for select to authenticated using ( (select auth.uid()) = user_id );
create policy "User can insert their own emails" on emails for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own emails" on emails for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own emails" on emails for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger on_updated_at before update on emails
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------
--                                                            --
--                    public.notifications                    --
--                                                            --
----------------------------------------------------------------

create table notifications (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  user_id uuid references users(id) on delete cascade not null,
  marketing_emails boolean default false not null,
  security_emails boolean default true not null
);
comment on column notifications.updated_at is 'on_updated_at';

alter table notifications enable row level security;

create policy "User can select their own notifications" on notifications for select to authenticated using ( (select auth.uid()) = user_id );
create policy "User can insert their own notifications" on notifications for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own notifications" on notifications for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own notifications" on notifications for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger on_updated_at before update on notifications
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------
--                                                            --
--                        public.posts                        --
--                                                            --
----------------------------------------------------------------

create table posts (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz,
  date timestamptz,
  user_id uuid references users(id) on delete cascade not null,
  type text default 'post'::text not null,
  status text default 'draft'::text not null,
  password varchar(255),
  slug text,
  title text,
  content text,
  excerpt text,
  thumbnail_url text,
  is_ban boolean default false not null,
  banned_until timestamptz
);
comment on column posts.updated_at is 'on_updated_at';
comment on column posts.slug is 'on_slug_upsert';
comment on column posts.type is 'post, page, revision';
comment on column posts.status is 'publish, future, draft, pending, private, trash';

alter table posts enable row level security;

create policy "Public access for all users" on posts for select to authenticated, anon using ( true );
create policy "User can insert their own posts" on posts for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own posts" on posts for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own posts" on posts for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger on_updated_at before update on posts
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------

create or replace function generate_slug()
returns trigger
security definer set search_path = public
as $$
declare
  old_slug text;
  new_slug text;
  counter integer := 1;
begin
  old_slug := new.slug;
  new_slug := old_slug;

  loop
    if exists (select 1 from posts where user_id = new.user_id and slug = new_slug and id != coalesce(new.id, 0)) then
      new_slug := old_slug || '-' || counter;
      counter := counter + 1;
    else
      exit;
    end if;
  end loop;

  new.slug := new_slug;
  return new;
end;
$$ language plpgsql;

create trigger on_slug_upsert before insert or update of slug on posts
  for each row execute function generate_slug();

----------------------------------------------------------------

create or replace function count_posts(
  userid uuid,
  posttype text = 'post',
  q text = null
)
returns table(status text, count bigint)
security definer set search_path = public
as $$
begin
  if q is not null then
    return query
    select p.status, count(*)
    from posts p where p.user_id = userid and p.type = posttype and to_tsvector(title) @@ to_tsquery(q)
    group by p.status;
  else
    return query
    select p.status, count(*)
    from posts p where p.user_id = userid and p.type = posttype
    group by p.status;
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function get_adjacent_post_id(
  postid bigint,
  userid uuid,
  posttype text = 'post',
  poststatus text = 'publish'
)
returns table(previous_id bigint, next_id bigint)
security definer set search_path = public
as $$
begin
  return query
  select max(case when id < postid then id end), min(case when id > postid then id end)
  from posts
  where user_id = userid and type = posttype and status = poststatus;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function create_new_posts(data json[])
returns void
security definer set search_path = public
as $$
declare
  r json;
begin
  foreach r in array data
  loop
    insert into posts
    (created_at, updated_at, deleted_at, date, user_id, type, status, password, title, slug, content, excerpt, thumbnail_url, is_ban, banned_until)
    values
    (
      coalesce((r ->> 'created_at')::timestamptz, now()),
      coalesce((r ->> 'updated_at')::timestamptz, now()),
      (r ->> 'deleted_at')::timestamptz,
      (r ->> 'date')::timestamptz,
      (r ->> 'user_id')::uuid,
      coalesce((r ->> 'type')::text, 'post'),
      coalesce((r ->> 'status')::text, 'draft'),
      (r ->> 'password')::varchar(255),
      (r ->> 'title')::text,
      (r ->> 'slug')::text,
      (r ->> 'content')::text,
      (r ->> 'excerpt')::text,
      (r ->> 'thumbnail_url')::text,
      coalesce((r ->> 'is_ban')::boolean, false),
      (r ->> 'banned_until')::timestamptz
    );
  end loop;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function truncate_posts()
returns void
security definer set search_path = public
as $$
begin
  truncate table posts restart identity cascade;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                     public.post_metas                      --
--                                                            --
----------------------------------------------------------------

create table post_metas (
  id bigint generated by default as identity primary key,
  post_id bigint references posts(id) on delete cascade not null,
  meta_key varchar(255) not null,
  meta_value text,
  unique (post_id, meta_key)
);

alter table post_metas enable row level security;

create policy "Public access for all users" on post_metas for select to authenticated, anon using ( true );
create policy "User can insert post_metas" on post_metas for insert to authenticated with check ( true );
create policy "User can update post_metas" on post_metas for update to authenticated using ( true );
create policy "User can delete post_metas" on post_metas for delete to authenticated using ( true );

----------------------------------------------------------------

create or replace function set_post_meta(postid bigint, metakey text, metavalue text)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from post_metas where post_id = postid and meta_key = metakey) then
    update post_metas set meta_value = metavalue where post_id = postid and meta_key = metakey;
  else
    insert into post_metas(post_id, meta_key, meta_value) values(postid, metakey, metavalue);
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function set_view_count(postid bigint)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from post_metas where post_id = postid and meta_key = 'view_count') then
    update post_metas set meta_value = meta_value::integer + 1 where post_id = postid and meta_key = 'view_count';
  else
    insert into post_metas(post_id, meta_key, meta_value) values(postid, 'view_count', '1');
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                      public.favorites                      --
--                                                            --
----------------------------------------------------------------

create table favorites (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  user_id uuid references users(id) on delete cascade not null,
  post_id bigint references posts(id) on delete cascade not null,
  is_favorite boolean default false not null,
  unique (user_id, post_id)
);
comment on column favorites.updated_at is 'on_updated_at';

alter table favorites enable row level security;

create policy "Public access for all users" on favorites for select to authenticated, anon using ( true );
create policy "User can insert their own favorites" on favorites for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own favorites" on favorites for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own favorites" on favorites for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger on_updated_at before update on favorites
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------

create or replace function set_favorite(postid bigint, userid uuid, isfavorite boolean)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from favorites where post_id = postid and user_id = userid) then
    update favorites set is_favorite = isfavorite where post_id = postid and user_id = userid;
  else
    insert into favorites(post_id, user_id, is_favorite) values(postid, userid, isfavorite);
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                        public.votes                        --
--                                                            --
----------------------------------------------------------------

create table votes (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  user_id uuid references users(id) on delete cascade not null,
  post_id bigint references posts(id) on delete cascade not null,
  is_like smallint default 0 not null,
  is_dislike smallint default 0 not null,
  unique (user_id, post_id)
);
comment on column votes.updated_at is 'on_updated_at';

alter table votes enable row level security;

create policy "Public access for all users" on votes for select to authenticated, anon using ( true );
create policy "User can insert their own votes" on votes for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own votes" on votes for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own votes" on votes for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger on_updated_at before update on votes
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------

create or replace function get_vote(postid bigint)
returns table(
	id bigint,
	like_count bigint,
	dislike_count bigint
)
security definer set search_path = public
as $$
begin
	return query
	select v.post_id, sum(v.is_like), sum(v.is_dislike)
  from votes v where v.post_id = postid
  group by v.post_id;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                        public.analyses                     --
--                                                            --
----------------------------------------------------------------

create table analyses (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  post_id bigint references posts(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  ip inet,
  user_agent text
);

alter table analyses enable row level security;

create policy "Public access for all users" on analyses for select to authenticated, anon using ( true );
create policy "User can insert analyses" on analyses for insert to authenticated with check ( true );
create policy "User can update analyses" on analyses for update to authenticated using ( true );
create policy "User can delete analyses" on analyses for delete to authenticated using ( true );

----------------------------------------------------------------
--                                                            --
--                       Job Scheduling                       --
--                                                            --
----------------------------------------------------------------

create or replace function hourly_publish_future_posts()
returns void
security definer set search_path = public
as $$
declare
  r record;
  visibility text;
begin
  for r in (select * from posts where status = 'future' and date < now()) loop
    select meta_value into visibility from post_metas where post_id = r.id and meta_key = 'visibility';

    if visibility = 'private' then
      update posts set status = 'private' where id = r.id;
    else
      update posts set status = 'publish' where id = r.id;
    end if;

    update post_metas set meta_value = null where post_id = r.id and meta_key = 'future_date';
  end loop;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                           seed                             --
--                                                            --
----------------------------------------------------------------

select assign_user_data();

-- select create_new_user('username@example.com', '123456789');
-- select set_user_role('superadmin', null, 'username@example.com')
-- select set_user_plan('premium', null, 'username@example.com')
