-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('audio-files', 'audio-files', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']),
  ('video-files', 'video-files', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('site-images', 'site-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('cover-art', 'cover-art', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- RLS Policies for storage buckets - Public read access
CREATE POLICY "Public Access to Media" ON storage.objects 
FOR SELECT USING (bucket_id IN ('audio-files', 'video-files', 'site-images', 'cover-art'));

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload Media" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id IN ('audio-files', 'video-files', 'site-images', 'cover-art') 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update media
CREATE POLICY "Authenticated Update Media" ON storage.objects 
FOR UPDATE USING (
  bucket_id IN ('audio-files', 'video-files', 'site-images', 'cover-art')
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete media
CREATE POLICY "Authenticated Delete Media" ON storage.objects 
FOR DELETE USING (
  bucket_id IN ('audio-files', 'video-files', 'site-images', 'cover-art')
  AND auth.role() = 'authenticated'
);

-- Create video embeds table
CREATE TABLE public.video_embeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_type TEXT NOT NULL CHECK (video_type IN ('youtube', 'facebook', 'tiktok', 'upload')),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on video_embeds
ALTER TABLE public.video_embeds ENABLE ROW LEVEL SECURITY;

-- Public can view active videos
CREATE POLICY "Public can view active videos" 
ON public.video_embeds 
FOR SELECT 
USING (status = 'active');

-- Authenticated users can manage videos
CREATE POLICY "Authenticated users can insert videos" 
ON public.video_embeds 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update videos" 
ON public.video_embeds 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videos" 
ON public.video_embeds 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER update_video_embeds_updated_at
BEFORE UPDATE ON public.video_embeds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add site settings for image management if not exists
INSERT INTO public.site_settings (key, value, description) VALUES
  ('hero_images', '{"home": "/images/hero-home.jpg", "dj": "/images/hero-dj.jpg", "creative": "/images/hero-creative.jpg", "shop": "/images/hero-shop.jpg"}', 'Hero section background images'),
  ('service_banners', '{"banner_1": "/assets/images/services-banner.png"}', 'Service section banners')
ON CONFLICT (key) DO NOTHING;