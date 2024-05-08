-- SQL Editor > New query

drop function if exists set_post_view;

drop table if exists post_views;

create table post_views (
  id bigint not null references posts on delete cascade primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  view_count integer default 0 not null
);

-- Secure the table
alter table post_views enable row level security;

-- Add row-level security
create policy "Public post_views are viewable by everyone." on post_views for select to authenticated, anon using ( true );
create policy "Users can insert their own post_view." on post_views for insert to authenticated with check ( true );
create policy "Users can update their own post_view." on post_views for update to authenticated, anon using ( true );
create policy "Users can delete their own post_view." on post_views for delete to authenticated using ( true );

-- Update a column timestamp on every update.
create extension if not exists moddatetime schema extensions;

-- assuming the table name is "post_views", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
drop trigger if exists handle_updated_at on post_views;

create trigger handle_updated_at before update on post_views
  for each row execute procedure moddatetime (updated_at);
