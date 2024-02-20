-- SQL Editor > New query
-- const { data, error } = await supabase.rpc('delete_user');

CREATE OR REPLACE FUNCTION delete_user()
	RETURNS void
LANGUAGE SQL SECURITY DEFINER
AS $$
	DELETE FROM auth.users WHERE id = auth.uid();
$$;
