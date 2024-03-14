-- SQL Editor > New query
-- const { error } = await supabase.rpc('delete_user');

drop function if exists delete_user;

create or replace function delete_user()
returns void language sql
security definer
as $$
	delete from auth.users where id = auth.uid();
$$;
