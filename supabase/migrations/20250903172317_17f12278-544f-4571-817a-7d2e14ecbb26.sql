-- Create helper functions for chat and admin functionality

-- Function to save chat messages
CREATE OR REPLACE FUNCTION public.save_chat_message(
  p_session_id text,
  p_direction text,
  p_message text,
  p_metadata text DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.chat_messages (session_id, direction, message, metadata)
  VALUES (p_session_id, p_direction, p_message, p_metadata::jsonb);
END;
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM public.users
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'user');
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.save_chat_message TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role TO anon, authenticated;