-- PHASE 0: Security Foundation
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Only admins can insert/update/delete roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function to check roles (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Update video_embeds policies
DROP POLICY IF EXISTS "Authenticated users can insert videos" ON public.video_embeds;
DROP POLICY IF EXISTS "Authenticated users can update videos" ON public.video_embeds;
DROP POLICY IF EXISTS "Authenticated users can delete videos" ON public.video_embeds;

CREATE POLICY "Admins can insert videos"
ON public.video_embeds
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update videos"
ON public.video_embeds
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete videos"
ON public.video_embeds
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update dj_tapes policies to use has_role
DROP POLICY IF EXISTS "dj_tapes_admin_all" ON public.dj_tapes;

CREATE POLICY "Admins can manage dj_tapes"
ON public.dj_tapes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update announcements policies
DROP POLICY IF EXISTS "announcements_admin_all" ON public.announcements;

CREATE POLICY "Admins can manage announcements"
ON public.announcements
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update storage policies for admin-only uploads
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Manage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

CREATE POLICY "Admins can upload to buckets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('audio-files', 'video-files', 'site-images', 'cover-art', 'product-images')
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update in buckets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id IN ('audio-files', 'video-files', 'site-images', 'cover-art', 'product-images')
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete from buckets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id IN ('audio-files', 'video-files', 'site-images', 'cover-art', 'product-images')
  AND public.has_role(auth.uid(), 'admin')
);

-- PHASE 1: Site Images Registry
CREATE TABLE public.website_images (
  key TEXT PRIMARY KEY,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.website_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view website images"
ON public.website_images
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage website images"
ON public.website_images
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Seed website images with current assets
INSERT INTO public.website_images (key, page, section, description, url) VALUES
  ('home_hero', 'home', 'hero', 'Homepage hero background', '/images/hero-home.jpg'),
  ('dj_hero', 'dj', 'hero', 'DJ page hero background', '/images/hero-dj.jpg'),
  ('creative_hero', 'creative', 'hero', 'Creative services hero background', '/images/hero-creative.jpg'),
  ('shop_hero', 'shop', 'hero', 'Shop page hero background', '/images/hero-shop.jpg'),
  ('services_banner', 'home', 'services', 'Services section banner', '/public/assets/images/services-banner.png'),
  ('dj_equipment', 'dj', 'equipment', 'DJ equipment showcase', '/images/dj-equipment.jpg'),
  ('sound_equipment', 'shop', 'featured', 'Sound equipment image', '/images/sound-equipment.jpg'),
  ('studio_interior', 'dj', 'studio', 'Studio interior image', '/images/studio-interior.jpg');

-- PHASE 4: Extend Announcements Table
ALTER TABLE public.announcements
ADD COLUMN media_type TEXT DEFAULT 'text' CHECK (media_type IN ('text', 'image', 'audio', 'video')),
ADD COLUMN media_url TEXT,
ADD COLUMN pinned BOOLEAN DEFAULT false;

-- Add ui_variant columns for AI-assisted layouts
ALTER TABLE public.dj_tapes
ADD COLUMN ui_variant JSONB DEFAULT '{}';

ALTER TABLE public.video_embeds
ADD COLUMN ui_variant JSONB DEFAULT '{}';