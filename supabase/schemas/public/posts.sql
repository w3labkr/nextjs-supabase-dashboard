----------------------------------------------------------------
--                                                            --
--                        public.posts                        --
--                                                            --
----------------------------------------------------------------

-- Functions for tracking last modification time
create extension if not exists moddatetime schema extensions;

----------------------------------------------------------------

drop trigger if exists on_updated_at on posts;
drop trigger if exists on_slug_upsert on posts;

drop function if exists generate_slug;
drop function if exists count_posts;
drop function if exists get_adjacent_post_id;
drop function if exists create_new_posts;
drop function if exists truncate_posts;

drop table if exists posts;

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

-- Secure the table
alter table posts enable row level security;

-- Add row-level security
create policy "Public access for all users" on posts for select to authenticated, anon using ( true );
create policy "User can insert their own posts" on posts for insert to authenticated with check ( (select auth.uid()) = user_id );
create policy "User can update their own posts" on posts for update to authenticated using ( (select auth.uid()) = user_id );
create policy "User can delete their own posts" on posts for delete to authenticated using ( (select auth.uid()) = user_id );

-- Trigger for tracking last modification time
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

create or replace function count_posts(userid uuid, posttype text default 'post')
returns table(status text, count bigint)
security definer set search_path = public
as $$
begin
  return query
  select p.status, count(*)
  from posts p where p.user_id = userid and p.type = posttype
  group by p.status;
end;
$$ language plpgsql;

----------------------------------------------------------------

create or replace function get_adjacent_post_id(
  postid bigint,
  userid uuid,
  posttype text default 'post',
  poststatus text default 'publish'
)
returns table(previous_id bigint, next_id bigint)
security definer set search_path = public
as $$
begin
  return query
  select max(case when id < postid then id end),
         min(case when id > postid then id end)
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
