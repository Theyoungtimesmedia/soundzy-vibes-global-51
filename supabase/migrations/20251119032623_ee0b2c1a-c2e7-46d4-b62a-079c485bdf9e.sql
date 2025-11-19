-- Phase 1: Fix Admin Access
-- Add the user to user_roles table with admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('cabd5f0d-4824-4932-b720-fcd4309ed3b4', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Add RLS policies for storage buckets to allow admin uploads
CREATE POLICY "Admins can upload to product-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update product-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload to audio-files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio-files' AND
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update audio-files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'audio-files' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete audio-files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'audio-files' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload to video-files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'video-files' AND
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update video-files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'video-files' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete video-files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'video-files' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload to site-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-images' AND
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update site-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload to cover-art"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cover-art' AND
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update cover-art"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cover-art' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete cover-art"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cover-art' AND has_role(auth.uid(), 'admin'));

-- Public read access for all buckets
CREATE POLICY "Public can view product-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Public can view audio-files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio-files');

CREATE POLICY "Public can view video-files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'video-files');

CREATE POLICY "Public can view site-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-images');

CREATE POLICY "Public can view cover-art"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cover-art');

-- Phase 2: Add Categorization
-- Add category field to video_embeds
ALTER TABLE public.video_embeds 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Add category field to dj_tapes
ALTER TABLE public.dj_tapes 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add category field to announcements for better image management
ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Create media_categories table for organizing all media
CREATE TABLE IF NOT EXISTS public.media_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  media_type TEXT NOT NULL, -- 'image', 'video', 'audio'
  parent_category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on media_categories
ALTER TABLE public.media_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view categories"
ON public.media_categories FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.media_categories FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Insert default categories
INSERT INTO public.media_categories (name, description, media_type) VALUES
('Hero Images', 'Main hero section images', 'image'),
('Service Images', 'Service page images', 'image'),
('Portfolio', 'Portfolio and work showcase images', 'image'),
('Blog Images', 'Blog post images', 'image'),
('Product Images', 'Shop product images', 'image'),
('DJ Performances', 'DJ performance videos', 'video'),
('Service Videos', 'Service demonstration videos', 'video'),
('Testimonials', 'Client testimonial videos', 'video'),
('Mixtapes', 'DJ mixtape audio files', 'audio'),
('Sound Effects', 'Sound effects and samples', 'audio')
ON CONFLICT (name) DO NOTHING;

-- Phase 4: Dynamic Website Content
-- Create page_sections table for dynamic content management
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  section_key TEXT NOT NULL,
  section_type TEXT NOT NULL, -- 'hero', 'services', 'gallery', 'text', 'cta', etc.
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(page_name, section_key)
);

-- Enable RLS on page_sections
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active sections"
ON public.page_sections FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Admins can manage sections"
ON public.page_sections FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_page_sections_updated_at
BEFORE UPDATE ON public.page_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_categories_updated_at
BEFORE UPDATE ON public.media_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create service_media table for linking media to services
CREATE TABLE IF NOT EXISTS public.service_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_key TEXT NOT NULL,
  media_type TEXT NOT NULL, -- 'image', 'video'
  media_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on service_media
ALTER TABLE public.service_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view service media"
ON public.service_media FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage service media"
ON public.service_media FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_service_media_updated_at
BEFORE UPDATE ON public.service_media
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();