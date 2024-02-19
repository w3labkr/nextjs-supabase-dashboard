-- SQL Editor > New query
-- const { data, error } = await supabase.rpc('verify_user_password', { password: oldPassword });

SET search_path = extensions, public, auth;

CREATE OR REPLACE FUNCTION public.verify_user_password(password text)
RETURNS BOOLEAN SECURITY DEFINER AS
$$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();
  RETURN EXISTS (
    SELECT id
    FROM auth.users
    WHERE id = user_id AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$$ LANGUAGE plpgsql;
