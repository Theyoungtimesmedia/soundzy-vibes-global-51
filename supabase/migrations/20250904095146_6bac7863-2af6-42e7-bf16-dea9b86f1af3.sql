-- Fix security warnings by setting proper search_path for functions

-- Update save_chat_message function with proper search_path
CREATE OR REPLACE FUNCTION public.save_chat_message(
  p_session_id text,
  p_direction text,
  p_message text,
  p_metadata text DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.chat_messages (session_id, direction, message, metadata)
  VALUES (p_session_id, p_direction, p_message, p_metadata::jsonb);
END;
$$;

-- Update get_user_role function with proper search_path
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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