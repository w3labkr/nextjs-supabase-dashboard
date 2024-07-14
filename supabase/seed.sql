----------------------------------------------------------------
--                                                            --
--                           Config                           --
--                                                            --
----------------------------------------------------------------

-- PostgREST Aggregate Functions
-- https://supabase.com/blog/postgrest-aggregate-functions

-- Staying Safe with Aggregate Functions
ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';
NOTIFY pgrst, 'reload config';

----------------------------------------------------------------
--                                                            --
--                         extensions                         --
--                                                            --
----------------------------------------------------------------

-- Cryptographic functions
create extension if not exists pgcrypto schema extensions;

-- Functions for tracking last modification time
create extension if not exists moddatetime schema extensions;

-- Job scheduler for PostgreSQL
create extension if not exists pg_cron;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

----------------------------------------------------------------
--                                                            --
--                          Storage                           --
--                                                            --
----------------------------------------------------------------

delete from storage.objects where bucket_id = 'YOUR_BUCKET_ID';
delete from storage.buckets where id = 'YOUR_BUCKET_ID';

drop policy if exists "Public access for all users" on storage.objects;
drop policy if exists "User can upload in their own folders" on storage.objects;
drop policy if exists "User can update their own objects" on storage.objects;
drop policy if exists "User can delete their own objects" on storage.objects;

insert into storage.buckets (id, name, public) values ('YOUR_BUCKET_ID', 'YOUR_BUCKET_ID', true);

create policy "Public access for all users" on storage.objects
  for select to authenticated, anon using (bucket_id = 'YOUR_BUCKET_ID');
create policy "User can upload in their own folders" on storage.objects
  for insert to authenticated with check (bucket_id = 'YOUR_BUCKET_ID' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "User can update their own objects" on storage.objects
  for update to authenticated using (owner_id = (select auth.uid()::text));
create policy "User can delete their own objects" on storage.objects
  for delete to authenticated using (owner_id = (select auth.uid()::text));

----------------------------------------------------------------
--                                                            --
--                       Job Scheduling                       --
--                                                            --
----------------------------------------------------------------

truncate table cron.job_run_details restart identity;

drop function if exists hourly_publish_future_posts;
drop function if exists daily_delete_old_cron_run_details;

select cron.schedule('hourly-publish-future-posts', '0 * * * *', 'SELECT hourly_publish_future_posts()');
select cron.schedule('daily-delete-old-cron-run-details', '0 0 * * *', 'SELECT daily_delete_old_cron_run_details()');

----------------------------------------------------------------
--                                                            --
--                           reset                            --
--                                                            --
----------------------------------------------------------------

drop trigger if exists on_created on auth.users;
drop trigger if exists on_encrypted_password_updated on auth.users;
drop trigger if exists on_updated_at on users;
drop trigger if exists on_username_updated on users;
drop trigger if exists on_role_updated on users;
drop trigger if exists on_plan_updated on users;
drop trigger if exists on_updated_at on role_permissions;
drop trigger if exists on_updated_at on users;
drop trigger if exists on_updated_at on emails;
drop trigger if exists on_updated_at on notifications;
drop trigger if exists on_updated_at on votes;
drop trigger if exists on_updated_at on favorites;
drop trigger if exists on_slug_upsert on posts;
drop trigger if exists on_updated_at on posts;
drop trigger if exists on_created on posts;
drop trigger if exists on_updated_at on tags;
drop trigger if exists on_slug_upsert on tags;

----------------------------------------------------------------

drop function if exists generate_password;
drop function if exists generate_username;
drop function if exists handle_has_set_password;
drop function if exists verify_user_password;
drop function if exists handle_new_user;
drop function if exists create_new_user;
drop function if exists assign_user_data;

drop function if exists handle_username_changed_at;
drop function if exists handle_role_changed_at;
drop function if exists handle_plan_changed_at;
drop function if exists set_user_role;
drop function if exists set_user_plan;
drop function if exists set_user_meta;
drop function if exists get_users;

drop function if exists set_post_tags;
drop function if exists set_tag_meta;
drop function if exists unique_tag_slug;
drop function if exists generate_tag_slug;
drop function if exists set_tag;

drop function if exists set_statistics;
drop function if exists get_vote;
drop function if exists set_favorite;
drop function if exists set_post_meta;
drop function if exists set_post_views;
drop function if exists unique_post_slug;
drop function if exists generate_post_slug;
drop function if exists count_posts;
drop function if exists get_adjacent_post_id;
drop function if exists create_new_posts;
drop function if exists handle_new_post;
drop function if exists truncate_posts;
drop function if exists get_posts_by_meta;

drop function if exists title_description;
drop function if exists title_keywords;
drop function if exists title_content;
drop function if exists title_description_keywords;
drop function if exists title_description_content;

----------------------------------------------------------------

drop table if exists statistics;
drop table if exists post_tags;
drop table if exists tagmeta;
drop table if exists tags;
drop table if exists votes;
drop table if exists favorites;
drop table if exists postmeta;
drop table if exists posts;
drop table if exists notifications;
drop table if exists emails;
drop table if exists role_permissions;
drop table if exists usermeta;
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

create trigger on_encrypted_password_updated after update of encrypted_password on auth.users
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
  insert into notifications (user_id) values (new.id);

  return new;
end;
$$ language plpgsql;

create trigger on_created after insert on auth.users
  for each row execute procedure handle_new_user();

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
  role text default 'guest'::text not null,
  role_changed_at timestamptz,
  plan text default 'free'::text not null,
  plan_changed_at timestamptz,
  unique (username)
);
comment on column users.updated_at is 'on_updated_at';
comment on column users.username_changed_at is 'on_username_updated';
comment on column users.has_set_password is 'on_encrypted_password_updated';
comment on column users.role is 'guest, user, admin, superadmin';
comment on column users.role_changed_at is 'on_role_updated';
comment on column users.plan is 'free, basic, standard, premium';
comment on column users.plan_changed_at is 'on_plan_updated';

create index users_username_idx on users (username);
create index users_role_idx on users (role);
create index users_plan_idx on users (plan);

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

create or replace function handle_role_changed_at()
returns trigger
security definer set search_path = public
as $$
begin
  update users set role_changed_at = now() where id = new.id;
  return new;
end;
$$ language plpgsql;

create trigger on_role_updated after update of role on users
  for each row execute function handle_role_changed_at();

----------------------------------------------------------------

create or replace function handle_plan_changed_at()
returns trigger
security definer set search_path = public
as $$
begin
  update users set plan_changed_at = now() where id = new.id;
  return new;
end;
$$ language plpgsql;

create trigger on_plan_updated after update of plan on users
  for each row execute function handle_plan_changed_at();

----------------------------------------------------------------

create or replace function set_user_role(userrole text, userid uuid = null, useremail text = null)
returns void
security definer set search_path = public
as $$
begin
  if userid is not null and useremail is not null then
    update users u set role = userrole from auth.users au where au.id = u.id and au.id = userid and au.email = useremail;
  elsif userid is not null then
    update users u set role = userrole from auth.users au where au.id = u.id and au.id = userid;
  elsif useremail is not null then
    update users u set role = userrole from auth.users au where au.id = u.id and au.email = useremail;
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function set_user_plan(userplan text, userid uuid = null, useremail text = null)
returns void
security definer set search_path = public
as $$
begin
  if userid is not null and useremail is not null then
    update users u set plan = userplan from auth.users au where au.id = u.id and au.id = userid and au.email = useremail;
  elsif userid is not null then
    update users u set plan = userplan from auth.users au where au.id = u.id and au.id = userid;
  elsif useremail is not null then
    update users u set plan = userplan from auth.users au where au.id = u.id and au.email = useremail;
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function get_users(userrole text = null, userplan text = null)
returns setof users
security definer set search_path = public
as $$
begin
	if userrole is not null and userplan is not null then
		return query
    select * from users where role = userrole and plan = userplan;
	elsif userrole is not null then
		return query
    select * from users where role = userrole;
	elsif userplan is not null then
    return query
    select * from users where plan = userplan;
	end if;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                      public.usermeta                       --
--                                                            --
----------------------------------------------------------------

create table usermeta (
  id bigint generated by default as identity primary key,
  user_id uuid references users(id) on delete cascade not null,
  meta_key varchar(255) not null,
  meta_value text,
  unique(user_id, meta_key)
);

create index usermeta_user_id_idx on usermeta (user_id);
create index usermeta_meta_key_idx on usermeta (meta_key);

alter table usermeta enable row level security;

create policy "Public access for all users" on usermeta for select to authenticated, anon using ( true );
create policy "User can insert their own usermeta" on usermeta for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own usermeta" on usermeta for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own usermeta" on usermeta for delete to authenticated using ( (select auth.uid()) = user_id );

----------------------------------------------------------------

create or replace function set_user_meta(userid bigint, metakey text, metavalue text = null)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from usermeta where user_id = userid and meta_key = metakey) then
    update usermeta set meta_value = metavalue where user_id = userid and meta_key = metakey;
  else
    insert into usermeta(user_id, meta_key, meta_value) values(userid, metakey, metavalue);
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

create index emails_user_id_idx on emails (user_id);
create index emails_email_idx on emails (email);

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

create index notifications_user_id_idx on notifications (user_id);

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
  title text,
  slug text,
  description text,
  keywords text,
  content text,
  thumbnail_url text,
  is_ban boolean default false not null,
  banned_until timestamptz
);
comment on column posts.updated_at is 'on_updated_at';
comment on column posts.slug is 'on_slug_upsert';
comment on column posts.type is 'post, page, revision';
comment on column posts.status is 'publish, future, draft, pending, private, trash';

create index posts_slug_idx on posts (slug);
create index posts_type_status_date_idx on posts (type, status, date, id);
create index posts_user_id_idx on posts (user_id);
create index posts_user_id_slug_idx on posts (user_id, slug);

alter table posts enable row level security;

create policy "Public access for all users" on posts for select to authenticated, anon using ( true );
create policy "User can insert their own posts" on posts for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own posts" on posts for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own posts" on posts for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger on_updated_at before update on posts
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------

create or replace function unique_post_slug()
returns trigger
security definer set search_path = public
as $$
declare
  old_slug text;
  new_slug text;
  slug_exists boolean;
  counter integer := 1;
  old_permalink text;
begin
  old_slug := new.slug;
  new_slug := old_slug;
  old_permalink := new.permalink;

  select exists(select 1 from posts where user_id = new.user_id and slug = new_slug and id != coalesce(new.id, 0)) into slug_exists;

  while slug_exists loop
    new_slug := old_slug || '-' || counter;
    counter := counter + 1;
    select exists(select 1 from posts where user_id = new.user_id and slug = new_slug and id != coalesce(new.id, 0)) into slug_exists;
  end loop;

  new.slug := new_slug;
  new.permalink := replace(old_permalink, old_slug, new_slug);
  return new;
end;
$$ language plpgsql;

create trigger on_slug_upsert before insert or update of slug on posts
  for each row execute function unique_post_slug();

----------------------------------------------------------------

create or replace function generate_post_slug(userid uuid, postslug text)
returns text
security definer set search_path = public
as $$
declare
  old_slug text;
  new_slug text;
  slug_exists boolean;
  counter integer := 1;
begin
  old_slug := postslug;
  new_slug := old_slug;

  select exists(select 1 from posts where user_id = userid and slug = new_slug) into slug_exists;

  while slug_exists loop
    new_slug := old_slug || '-' || counter;
    counter := counter + 1;
    select exists(select 1 from posts where user_id = userid and slug = new_slug) into slug_exists;
  end loop;

  return new_slug;
end;
$$ language plpgsql;

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
  postid bigint;
begin
  foreach r in array data loop
    insert into posts
    (created_at,updated_at,deleted_at,date,user_id,type,status,password,title,slug,description,keywords,content,thumbnail_url,permalink,is_ban,banned_until)
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
      (r ->> 'description')::text,
      (r ->> 'keywords')::text,
      (r ->> 'content')::text,
      (r ->> 'thumbnail_url')::text,
      (r ->> 'permalink')::text,
      coalesce((r ->> 'is_ban')::boolean, false),
      (r ->> 'banned_until')::timestamptz
    );
  end loop;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function handle_new_post()
returns trigger
security definer set search_path = public
as $$
begin
  insert into postmeta (post_id, meta_key, meta_value) values (new.id, 'views', '0');
  return new;
end;
$$ language plpgsql;

create trigger on_created after insert on posts
  for each row execute procedure handle_new_post();

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

create or replace function get_posts_by_meta(
  metakey text,
  datatype text = 'text',
  ascending boolean = null
)
returns setof posts
security definer set search_path = public
as $$
begin
  if ascending is not null and datatype = 'integer' then
    return query
    select p.* from posts p join postmeta m on p.id = m.post_id where m.meta_key = metakey
    order by
      case ascending when true then m.meta_value::integer else 0 end asc,
      case ascending when false then m.meta_value::integer else 0 end desc;
  elsif ascending is not null then
    return query
    select p.* from posts p join postmeta m on p.id = m.post_id where m.meta_key = metakey
    order by
      case ascending when true then m.meta_value else 0 end asc,
      case ascending when false then m.meta_value else 0 end desc;
  else
    return query
    select p.* from posts p join postmeta m on p.id = m.post_id where m.meta_key = metakey;
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------

create function title_description(posts) returns text as $$
  select $1.title || ' ' || $1.description;
$$ language sql immutable;

create function title_keywords(posts) returns text as $$
  select $1.title || ' ' || $1.keywords;
$$ language sql immutable;

create function title_content(posts) returns text as $$
  select $1.title || ' ' || $1.content;
$$ language sql immutable;

create function title_description_keywords(posts) returns text as $$
  select $1.title || ' ' || $1.description || ' ' || $1.keywords;
$$ language sql immutable;

create function title_description_content(posts) returns text as $$
  select $1.title || ' ' || $1.description || ' ' || $1.content;
$$ language sql immutable;


----------------------------------------------------------------
--                                                            --
--                      public.postmeta                       --
--                                                            --
----------------------------------------------------------------

create table postmeta (
  id bigint generated by default as identity primary key,
  post_id bigint references posts(id) on delete cascade not null,
  meta_key varchar(255) not null,
  meta_value text,
  unique(post_id, meta_key)
);

create index postmeta_post_id_idx on postmeta (post_id);
create index postmeta_meta_key_idx on postmeta (meta_key);

alter table postmeta enable row level security;

create policy "Public access for all users" on postmeta for select to authenticated, anon using ( true );
create policy "User can insert postmeta" on postmeta for insert to authenticated with check ( true );
create policy "User can update postmeta" on postmeta for update to authenticated using ( true );
create policy "User can delete postmeta" on postmeta for delete to authenticated using ( true );

----------------------------------------------------------------

create or replace function set_post_meta(postid bigint, metakey text, metavalue text = null)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from postmeta where post_id = postid and meta_key = metakey) then
    update postmeta set meta_value = metavalue where post_id = postid and meta_key = metakey;
  else
    insert into postmeta(post_id, meta_key, meta_value) values(postid, metakey, metavalue);
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function set_post_views(postid bigint)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from postmeta where post_id = postid and meta_key = 'views') then
    update postmeta set meta_value = meta_value::integer + 1 where post_id = postid and meta_key = 'views';
  else
    insert into postmeta(post_id, meta_key, meta_value) values(postid, 'views', '1');
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

create index favorites_user_id_idx on favorites (user_id);
create index favorites_post_id_idx on favorites (post_id);

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

create index votes_user_id_idx on votes (user_id);
create index votes_post_id_idx on votes (post_id);

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
	select v.post_id, sum(v.is_like), sum(v.is_dislike) from votes v where v.post_id = postid group by v.post_id;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                        public.tags                         --
--                                                            --
----------------------------------------------------------------

create table tags (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  user_id uuid references users(id) on delete cascade not null,
  name text,
  slug text,
  description text
);
comment on column tags.updated_at is 'on_updated_at';

create index tags_name_idx on tags (name);
create index tags_slug_idx on tags (slug);
create index tags_user_id_idx on tags (user_id);
create index tags_user_id_name_idx on tags (user_id, name);
create index tags_user_id_slug_idx on tags (user_id, slug);

alter table tags enable row level security;

create policy "Public access for all users" on tags for select to authenticated, anon using ( true );
create policy "User can insert their own tags" on tags for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own tags" on tags for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own tags" on tags for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger on_updated_at before update on tags
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------

create or replace function unique_tag_slug()
returns trigger
security definer set search_path = public
as $$
declare
  old_slug text;
  new_slug text;
  slug_exists boolean;
  counter integer := 1;
begin
  old_slug := new.slug;
  new_slug := old_slug;

  select exists(select 1 from tags where user_id = new.user_id and slug = new_slug and id != coalesce(new.id, 0)) into slug_exists;

  while slug_exists loop
    new_slug := old_slug || '-' || counter;
    counter := counter + 1;
    select exists(select 1 from tags where user_id = new.user_id and slug = new_slug and id != coalesce(new.id, 0)) into slug_exists;
  end loop;

  new.slug := new_slug;
  return new;
end;
$$ language plpgsql;

create trigger on_slug_upsert before insert or update of slug on tags
  for each row execute function unique_tag_slug();

----------------------------------------------------------------

create or replace function generate_tag_slug(userid uuid, tagslug text)
returns text
security definer set search_path = public
as $$
declare
  old_slug text;
  new_slug text;
  slug_exists boolean;
  counter integer := 1;
begin
  old_slug := tagslug;
  new_slug := old_slug;

  select exists(select 1 from tags where user_id = userid and slug = new_slug) into slug_exists;

  while slug_exists loop
    new_slug := old_slug || '-' || counter;
    counter := counter + 1;
    select exists(select 1 from tags where user_id = userid and slug = new_slug) into slug_exists;
  end loop;

  return new_slug;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function set_tag(
  userid uuid,
  tagname text,
  tagslug text,
  tagdescription text = null
)
returns setof tags
security definer set search_path = public
as $$
begin

  if exists (select 1 from tags where user_id = userid and slug = tagslug) then
    update tags set name = tagname, slug = tagslug, description = tagdescription where user_id = userid and slug = tagslug;
  else
    insert into tags(user_id, name, slug, description) values(userid, tagname, tagslug, tagdescription);
  end if;

  return query
  select * from tags where user_id = userid and slug = tagslug;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                       public.tagmeta                       --
--                                                            --
----------------------------------------------------------------

create table tagmeta (
  id bigint generated by default as identity primary key,
  tag_id bigint references tags(id) on delete cascade not null,
  meta_key varchar(255) not null,
  meta_value text,
  unique (tag_id, meta_key)
);

create index tagmeta_tag_id_idx on tagmeta (tag_id);
create index tagmeta_meta_key_idx on tagmeta (meta_key);

alter table tagmeta enable row level security;

create policy "Public access for all users" on tagmeta for select to authenticated, anon using ( true );
create policy "User can insert tagmeta" on tagmeta for insert to authenticated with check ( true );
create policy "User can update tagmeta" on tagmeta for update to authenticated using ( true );
create policy "User can delete tagmeta" on tagmeta for delete to authenticated using ( true );

----------------------------------------------------------------

create or replace function set_tag_meta(tagid bigint, metakey text, metavalue text = null)
returns void
security definer set search_path = public
as $$
begin
  if exists (select 1 from tagmeta where tag_id = tagid and meta_key = metakey) then
    update tagmeta set meta_value = metavalue where tag_id = tagid and meta_key = metakey;
  else
    insert into tagmeta(tag_id, meta_key, meta_value) values(tagid, metakey, metavalue);
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                      public.post_tags                      --
--                                                            --
----------------------------------------------------------------

create table post_tags (
  id bigint generated by default as identity primary key,
  user_id uuid references users(id) on delete cascade not null,
  post_id bigint references posts(id) on delete cascade not null,
  tag_id bigint references tags(id) on delete cascade not null,
  unique (user_id, post_id, tag_id)
);

create index post_tags_user_id_idx on post_tags (user_id);
create index post_tags_post_id_idx on post_tags (post_id);
create index post_tags_tag_id_idx on post_tags (tag_id);
create index post_tags_user_id_post_id_idx on post_tags (user_id, post_id);

alter table post_tags enable row level security;

create policy "Public access for all users" on post_tags for select to authenticated, anon using ( true );
create policy "User can insert their own post_tags" on post_tags for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own post_tags" on post_tags for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own post_tags" on post_tags for delete to authenticated using ( (select auth.uid()) = user_id );

----------------------------------------------------------------

create or replace function set_post_tags(
  userid uuid,
  postid bigint
)
returns void
security definer set search_path = public
as $$
declare
  tagnames text[];
  tagid bigint;
  metavalue text;
  element jsonb;
begin

	select array_agg(names) into tagnames from (select jsonb_array_elements(meta_value::jsonb)->>'text'::text as names from postmeta where post_id = postid and meta_key = 'tags') t;

 	if array_length(tagnames, 1) > 0 then
		delete from post_tags pt using tags t where pt.user_id = userid and pt.post_id = postid and pt.tag_id = t.id and t.name != all(coalesce(tagnames, array[]::text[]));
  else
		delete from post_tags where user_id = userid and post_id = postid;
 	end if;

  select meta_value into metavalue from postmeta where post_id = postid and meta_key = 'tags';

 	for element in (select * from jsonb_array_elements(metavalue::jsonb)) loop
 		if not exists (select 1 from post_tags pt join tags t on t.id = pt.tag_id where pt.user_id = userid and pt.post_id = postid and t.name = element->>'text') then
 			if exists (select 1 from tags where user_id = userid and name = element->>'text') then
 				select id into tagid from tags where user_id = userid and name = element->>'text';
 			else
	 			insert into tags(user_id, name, slug) values(userid, element->>'text', element->>'slug')
		    returning id into tagid;
	    end if;
 			insert into post_tags(user_id, post_id, tag_id) values(userid, postid, tagid);
 		end if;
 	end loop;

end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                     public.statistics                      --
--                                                            --
----------------------------------------------------------------

create table statistics (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  user_id uuid references users(id) on delete cascade,
  visitor_id uuid not null,
  title text,
  location text,
  path text,
  referrer text,
  ip inet,
  browser jsonb,
  user_agent text
);

create index statistics_user_id_idx on statistics (user_id);
create index statistics_visitor_id_idx on statistics (visitor_id);
create index statistics_path_idx on statistics (path);

alter table statistics enable row level security;

create policy "Public access for all users" on statistics for select to authenticated, anon using ( true );
create policy "User can insert statistics" on statistics for insert to authenticated with check ( true );
create policy "User can update statistics" on statistics for update to authenticated using ( true );
create policy "User can delete statistics" on statistics for delete to authenticated using ( true );

----------------------------------------------------------------

create or replace function set_statistics(data json)
returns void
security definer set search_path = public
as $$
begin
  insert into statistics
  (user_id,visitor_id,title,location,path,referrer,ip,browser,user_agent)
  values
  (
    (data ->> 'user_id')::uuid,
    (data ->> 'visitor_id')::uuid,
    (data ->> 'title')::text,
    (data ->> 'location')::text,
    (data ->> 'path')::text,
    (data ->> 'referrer')::text,
    (data ->> 'ip')::inet,
    (data ->> 'browser')::jsonb,
    (data ->> 'user_agent')::text
  );
end;
$$ language plpgsql;

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
    select meta_value into visibility from postmeta where post_id = r.id and meta_key = 'visibility';

    if visibility = 'private' then
      update posts set status = 'private' where id = r.id;
    else
      update posts set status = 'publish' where id = r.id;
    end if;

    update postmeta set meta_value = null where post_id = r.id and meta_key = 'future_date';
  end loop;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function daily_delete_old_cron_run_details()
returns void
security definer set search_path = public
as $$
begin
  delete from cron.job_run_details where start_time < now() - interval '30 days';
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                           seed                             --
--                                                            --
----------------------------------------------------------------

-- select create_new_user('username@example.com', '123456789');

select assign_user_data();

select set_user_role('superadmin', null, 'username@example.com');
select set_user_plan('premium', null, 'username@example.com');
