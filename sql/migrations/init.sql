-- SQL Editor > New query

----------------------------------------------------------------
--                                                            --
--                         extensions                         --
--                                                            --
----------------------------------------------------------------

ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';
NOTIFY pgrst, 'reload config';

----------------------------------------------------------------

create extension if not exists moddatetime schema extensions;

----------------------------------------------------------------
--                                                            --
--                           reset                            --
--                                                            --
----------------------------------------------------------------

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_password_updated on auth.users;
drop trigger if exists handle_updated_at on users;
drop trigger if exists handle_updated_at on user_roles;
drop trigger if exists handle_updated_at on role_permissions;
drop trigger if exists handle_updated_at on user_plans;
drop trigger if exists handle_updated_at on profiles;
drop trigger if exists on_username_updated on profiles;
drop trigger if exists handle_updated_at on emails;
drop trigger if exists handle_updated_at on notifications;
drop trigger if exists handle_updated_at on post_votes;
drop trigger if exists handle_updated_at on post_views;
drop trigger if exists handle_updated_at on posts;

----------------------------------------------------------------

drop function if exists generate_username;
drop function if exists handle_new_user;
drop function if exists handle_has_set_password;
drop function if exists create_new_user;
drop function if exists auth_users_to_public_users;
drop function if exists get_user;
drop function if exists verify_user_password;
drop function if exists handle_username_changed_at;
drop function if exists count_posts;
drop function if exists get_post_vote;
drop function if exists set_post_vote;
drop function if exists set_post_view;
drop function if exists get_adjacent_post_id;

----------------------------------------------------------------

drop table if exists post_votes;
drop table if exists post_views;
drop table if exists posts;
drop table if exists notifications;
drop table if exists emails;
drop table if exists profiles;
drop table if exists role_permissions;
drop table if exists user_roles;
drop table if exists user_plans;
drop table if exists users;

----------------------------------------------------------------
--                                                            --
--                         auth.users                         --
--                                                            --
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
  select exists(select 1 from profiles where username = new_username) into username_exists;
  while username_exists loop
    new_username := new_username || '_' || to_char(trunc(random()*1000000), 'fm000000');
    select exists(select 1 from profiles where username = new_username) into username_exists;
  end loop;
  return new_username;
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
  insert into users (id, has_set_password) values (new.id, new_has_set_password);
  insert into profiles (id, username, full_name, avatar_url) values (new.id, new_username, new_username, new.raw_user_meta_data ->> 'avatar_url');
  insert into emails (user_id, email) values (new.id, new.email);
  insert into user_roles (user_id) values (new.id);
  insert into user_plans (user_id) values (new.id);
  insert into notifications (user_id) values (new.id);
  return new;
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

----------------------------------------------------------------

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure handle_new_user();
create trigger on_auth_user_password_updated after update of encrypted_password on auth.users
  for each row execute function handle_has_set_password();

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
  username_changed_at timestamptz,
  has_set_password boolean default false not null,
  is_ban boolean default false not null,
  banned_until timestamptz
);
comment on column users.has_set_password is 'handle_has_set_password';

alter table users enable row level security;

create policy "Users can view their users." on users for select to authenticated using ( (select auth.uid()) = id );
create policy "Users can insert their own user." on users for insert to authenticated with check ( (select auth.uid()) = id );
create policy "Users can update their own user." on users for update to authenticated using ( (select auth.uid()) = id );
create policy "Users can delete their own user." on users for delete to authenticated using ( (select auth.uid()) = id );

create trigger handle_updated_at before update on users
  for each row execute procedure moddatetime (updated_at);

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
comment on column user_roles.role is 'guest, user, admin, superadmin';

alter table user_roles enable row level security;

create policy "Users can view their roles." on user_roles for select to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can insert their own role." on user_roles for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "Users can update their own role." on user_roles for update to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can delete their own role." on user_roles for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger handle_updated_at before update on user_roles
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------
--                                                            --
--                  public.role_permissions                   --
--                                                            --
----------------------------------------------------------------

create table role_permissions (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  role text not null,
  permission text not null,
  unique (role, permission)
);

alter table role_permissions enable row level security;

create policy "Public role_permissions are viewable by everyone." on role_permissions for select to authenticated using ( true );
create policy "Users can insert their own role_permission." on role_permissions for insert to authenticated with check ( true );
create policy "Users can update their own role_permission." on role_permissions for update to authenticated using ( true );
create policy "Users can delete their own role_permission." on role_permissions for delete to authenticated using ( true );

create trigger handle_updated_at before update on role_permissions
  for each row execute procedure moddatetime (updated_at);

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
comment on column user_plans.plan is 'free, basic, standard, premium';

alter table user_plans enable row level security;

create policy "Users can view their plans." on user_plans for select to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can insert their own plan." on user_plans for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "Users can update their own plan." on user_plans for update to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can delete their own plan." on user_plans for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger handle_updated_at before update on user_plans
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------
--                                                            --
--                      public.profiles                       --
--                                                            --
----------------------------------------------------------------

create table profiles (
  id uuid not null references auth.users on delete cascade primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  username text not null,
  email varchar(255),
  full_name text,
  first_name text,
  last_name text,
  age integer,
  avatar_url text,
  website text,
  bio text,
  unique (username)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for select to authenticated, anon using ( true );
create policy "Users can insert their own profile." on profiles for insert to authenticated with check ( (select auth.uid()) = id );
create policy "Users can update their own profile." on profiles for update to authenticated using ( (select auth.uid()) = id );
create policy "Users can delete their own profile." on profiles for delete to authenticated using ( (select auth.uid()) = id );

create or replace function handle_username_changed_at()
returns trigger
security definer set search_path = public
as $$
begin
  update users set username_changed_at = now() where id = new.id;
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at before update on profiles
  for each row execute procedure moddatetime (updated_at);

create trigger on_username_updated after update of username on profiles
  for each row execute function handle_username_changed_at();

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

alter table emails enable row level security;

create policy "Users can view their emails." on emails for select to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can insert their own email." on emails for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "Users can update their own email." on emails for update to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can delete their own email." on emails for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger handle_updated_at before update on emails
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

alter table notifications enable row level security;

create policy "Users can view their notification." on notifications for select to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can insert their own notification." on notifications for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "Users can update their own notification." on notifications for update to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can delete their own notification." on notifications for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger handle_updated_at before update on notifications
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
  published_at timestamptz,
  user_id uuid references profiles(id) on delete cascade not null,
  type text default 'post'::text not null,
  status text default 'draft'::text not null,
  password varchar(255),
  slug text,
  title text,
  content text,
  excerpt text,
  thumbnail_url text,
  is_ban boolean default false not null,
  banned_until timestamptz,
  metadata jsonb,
  unique(user_id, slug)
);
comment on column posts.type is 'post, page, revision';
comment on column posts.status is 'publish, future, draft, pending, private, trash';

alter table posts enable row level security;

create policy "Public posts are viewable by everyone." on posts for select to authenticated, anon using ( true );
create policy "Users can insert their own post." on posts for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "Users can update their own post." on posts for update to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can delete their own post." on posts for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger handle_updated_at before update on posts
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------
--                                                            --
--                     public.post_views                      --
--                                                            --
----------------------------------------------------------------

create table post_views (
  id bigint not null references posts on delete cascade primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  view_count integer default 0 not null
);

alter table post_views enable row level security;

create policy "Public post_views are viewable by everyone." on post_views for select to authenticated, anon using ( true );
create policy "Users can insert their own post_view." on post_views for insert to authenticated with check ( true );
create policy "Users can update their own post_view." on post_views for update to authenticated, anon using ( true );
create policy "Users can delete their own post_view." on post_views for delete to authenticated using ( true );

create trigger handle_updated_at before update on post_views
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------
--                                                            --
--                     public.post_votes                      --
--                                                            --
----------------------------------------------------------------

create table post_votes (
  id bigint generated by default as identity primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  user_id uuid references profiles(id) not null,
  post_id bigint references posts(id) on delete cascade not null,
  is_like smallint default 0 not null,
  is_dislike smallint default 0 not null,
  unique (user_id, post_id)
);

alter table post_votes enable row level security;

create policy "Public post_votes are viewable by everyone." on post_votes for select to authenticated, anon using ( true );
create policy "Users can insert their own post_vote." on post_votes for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "Users can update their own post_vote." on post_votes for update to authenticated using ( (select auth.uid()) = user_id );
create policy "Users can delete their own post_vote." on post_votes for delete to authenticated using ( (select auth.uid()) = user_id );

create trigger handle_updated_at before update on post_votes
  for each row execute procedure moddatetime (updated_at);

----------------------------------------------------------------
--                                                            --
--                      public.functions                      --
--                                                            --
----------------------------------------------------------------

create or replace function get_user(uid uuid)
returns table(
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  deleted_at timestamptz,
  username_changed_at timestamptz,
  has_set_password boolean,
  is_ban boolean,
  banned_until timestamptz,
  role text,
  plan text
)
security definer set search_path = public
as $$
begin
	return query
  select u.*, ur."role", up."plan"
  from users u
    join user_roles ur on u.id = ur.user_id
    join user_plans up on u.id = up.user_id
  where u.id = uid;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function verify_user_password(uid uuid, password text)
returns boolean
security definer set search_path = public, extensions, auth
as $$
begin
  return exists (
    select id
    from auth.users
    where id = uid
      and encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function count_posts(uid uuid)
returns table(status text, count bigint)
security definer set search_path = public
as $$
begin
	return query
  select p.status, count(*)
  from posts p where p.user_id = uid
  group by p.status;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function get_post_vote(pid bigint)
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
  from votes v where v.post_id = pid
  group by v.post_id;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function set_post_vote(
  uid uuid,
  pid bigint,
  islike smallint default null,
  isdislike smallint default null
)
returns void
security definer set search_path = public
as $$
begin
  if (islike is not null) then
    if exists (select from post_votes where user_id = uid and post_id = pid) then
      update post_votes set is_like = islike where user_id = uid and post_id = pid;
    else
      insert into post_votes(user_id, post_id, is_like) values(uid, pid, islike);
    end if;
  elsif (isdislike is not null) then
    if exists (select from post_votes where user_id = uid and post_id = pid) then
      update post_votes set is_dislike = isdislike where user_id = uid and post_id = pid;
    else
      insert into post_votes(user_id, post_id, is_dislike) values(uid, pid, isdislike);
    end if;
  end if;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function set_post_view(pid bigint)
returns void
security definer set search_path = public
as $$
begin
  update post_views set view_count = view_count + 1 where id = pid;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function get_adjacent_post_id(
  pid bigint,
  uid uuid,
  post_type text default 'post',
  post_status text default 'publish'
)
returns table(previous_id bigint, next_id bigint)
security definer set search_path = public
as $$
begin
  return query
  select max(case when id < pid then id end) as previous,
  min(case when id > pid then id end) as next
  from posts
  where user_id = uid and type = post_type and status = post_status;
end;
$$ language plpgsql;

----------------------------------------------------------------
--                                                            --
--                           seeds                            --
--                                                            --
----------------------------------------------------------------

create or replace function create_new_user(email text, password text)
returns uuid
security definer set search_path = public
as $$
declare
  user_id uuid;
  encrypted_pw text;
begin
  user_id := gen_random_uuid();
  encrypted_pw := crypt(password, gen_salt('bf'));

  insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  values
  ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, '2023-05-03 19:41:43.585805+00', '2023-04-22 13:10:03.275387+00', '2023-04-22 13:10:31.458239+00', '{"provider":"email","providers":["email"]}', '{}', '2023-05-03 19:41:43.580424+00', '2023-05-03 19:41:43.585948+00', '', '', '', '');

  insert into auth.identities
  (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values
  (gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 'email', '2023-05-03 19:41:43.582456+00', '2023-05-03 19:41:43.582497+00', '2023-05-03 19:41:43.582497+00');

  return user_id;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function auth_users_to_public_users()
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
    insert into users (id, has_set_password) values (r.id, new_has_set_password);
    insert into profiles (id, username, full_name, avatar_url) values (r.id, new_username, new_username, r.raw_user_meta_data ->> 'avatar_url');
    insert into emails (user_id, email) values (r.id, r.email);
    insert into user_roles (user_id) values (r.id);
    insert into user_plans (user_id) values (r.id);
    insert into notifications (user_id) values (r.id);
  end loop;
end;
$$ language plpgsql;

select auth_users_to_public_users();
