
-- Add admin role for nathanielnimfas3@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'nathanielnimfas3@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
