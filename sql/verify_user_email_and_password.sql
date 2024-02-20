-- SQL Editor > New query
-- const { data, error } = await supabase.rpc('verify_user_email_and_password', {
--   user_email: '',
--   user_password: ''
-- });

SET search_path = extensions, public, auth;

CREATE OR REPLACE FUNCTION public.verify_user_email_and_password(user_email text, user_password text)
RETURNS BOOLEAN SECURITY DEFINER AS
$$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();
  RETURN EXISTS (
    SELECT id
    FROM auth.users
    WHERE id = user_id
      AND email = user_email
      AND encrypted_password = crypt(user_password::text, auth.users.encrypted_password)
  );
END;
$$ LANGUAGE plpgsql;
