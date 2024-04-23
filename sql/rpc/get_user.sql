-- SQL Editor > New query
-- const { data, error } = await supabase.rpc('get_user', { uid: '' });

drop function if exists get_user;

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
security definer
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

-- select * from get_user('uid');
