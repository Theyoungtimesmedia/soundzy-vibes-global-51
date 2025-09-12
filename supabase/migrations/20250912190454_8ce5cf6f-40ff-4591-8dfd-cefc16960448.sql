-- Create leads table for lead management
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT NOT NULL,
  event_date DATE,
  budget_range TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  priority TEXT NOT NULL DEFAULT 'medium',
  assigned_to UUID,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table for blog management
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_name TEXT NOT NULL,
  author_email TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  tags JSONB DEFAULT '[]',
  meta_title TEXT,
  meta_description TEXT,
  read_time INTEGER DEFAULT 5,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table for blog comments
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dj_tapes table for DJ tape management
CREATE TABLE public.dj_tapes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  cover_image TEXT,
  duration INTEGER,
  genre TEXT,
  tags JSONB DEFAULT '[]',
  play_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create announcements table for news/announcements
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'draft',
  target_audience TEXT DEFAULT 'all',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_sessions table for chat management
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  visitor_info JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dj_tapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access and public reading where appropriate
CREATE POLICY "leads_admin_all" ON public.leads FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "blog_posts_admin_all" ON public.blog_posts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "blog_posts_public_read" ON public.blog_posts FOR SELECT USING (status = 'published');

CREATE POLICY "comments_admin_all" ON public.comments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "comments_public_insert" ON public.comments FOR INSERT WITH CHECK (true);

CREATE POLICY "comments_public_read_approved" ON public.comments FOR SELECT USING (status = 'approved');

CREATE POLICY "dj_tapes_admin_all" ON public.dj_tapes FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "dj_tapes_public_read_active" ON public.dj_tapes FOR SELECT USING (status = 'active');

CREATE POLICY "announcements_admin_all" ON public.announcements FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "announcements_public_read_published" ON public.announcements FOR SELECT USING (
  status = 'published' AND (expires_at IS NULL OR expires_at > now())
);

CREATE POLICY "chat_sessions_admin_all" ON public.chat_sessions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'super_admin')
  )
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dj_tapes_updated_at
  BEFORE UPDATE ON public.dj_tapes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.leads (name, email, phone, service_type, message, status) VALUES
('John Doe', 'john@example.com', '+234-801-234-5678', 'Wedding DJ', 'Need DJ for wedding on Dec 15th', 'new'),
('Sarah Wilson', 'sarah@example.com', '+234-802-345-6789', 'Sound Rental', 'Looking for PA system rental', 'contacted'),
('Mike Johnson', 'mike@example.com', '+234-803-456-7890', 'Event Planning', 'Corporate event sound setup', 'qualified');

INSERT INTO public.blog_posts (title, slug, excerpt, content, author_name, status) VALUES
('Ultimate Guide to Wedding DJ Services', 'ultimate-guide-wedding-dj-services', 'Everything you need to know about hiring a wedding DJ', 'Complete guide content here...', 'DJ Soundzy', 'published'),
('Top 10 Sound Equipment for Events', 'top-10-sound-equipment-events', 'Professional sound equipment recommendations', 'Detailed equipment guide content...', 'Audio Expert', 'draft');

INSERT INTO public.dj_tapes (title, artist_name, description, genre, status) VALUES
('Summer Vibes Mix 2024', 'DJ Soundzy', 'Perfect summer party playlist', 'Afrobeats', 'active'),
('Wedding Reception Classics', 'DJ Soundzy', 'Timeless wedding reception music', 'Mixed', 'active');

INSERT INTO public.announcements (title, content, type, status) VALUES
('New Equipment Arrivals', 'We have just received the latest LED stage lights and wireless microphone systems!', 'product', 'published'),
('Holiday Season Discounts', 'Special pricing on all DJ services for December events. Book now!', 'promotion', 'published');