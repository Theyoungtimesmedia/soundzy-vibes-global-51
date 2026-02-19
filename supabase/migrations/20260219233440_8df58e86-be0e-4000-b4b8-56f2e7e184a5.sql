
-- Guest Sessions
CREATE TABLE IF NOT EXISTS public.guest_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create guest sessions" ON public.guest_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read own guest session" ON public.guest_sessions FOR SELECT USING (true);

-- Posts (Social Feed)
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  display_name text NOT NULL,
  is_guest boolean DEFAULT false,
  content text NOT NULL,
  media_urls text[] DEFAULT '{}',
  location text,
  event_tag uuid,
  likes_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Post Likes
CREATE TABLE IF NOT EXISTS public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated can like" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Post Comments
CREATE TABLE IF NOT EXISTS public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid,
  display_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comments" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can create comments" ON public.post_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete own comments" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  display_name text NOT NULL,
  phone text NOT NULL,
  email text,
  service_type text NOT NULL,
  event_date date,
  event_time time,
  venue text,
  guest_count integer,
  must_play text[] DEFAULT '{}',
  do_not_play text[] DEFAULT '{}',
  budget integer,
  special_requests text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  display_name text,
  last_message text,
  last_message_at timestamptz DEFAULT now(),
  unread_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all conversations" ON public.conversations FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users or admins can update conversations" ON public.conversations FOR UPDATE USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid,
  sender_name text NOT NULL,
  content text NOT NULL,
  media_url text,
  is_ai boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own conversation messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin')))
);

-- Mixtapes (separate from dj_tapes for the mobile app)
CREATE TABLE IF NOT EXISTS public.mixtapes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  genre text,
  artwork_url text,
  audio_url text,
  duration integer,
  likes_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mixtapes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view mixtapes" ON public.mixtapes FOR SELECT USING (true);
CREATE POLICY "Admins can manage mixtapes" ON public.mixtapes FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  display_name text NOT NULL,
  booking_id uuid REFERENCES public.bookings(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  read boolean DEFAULT false,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Wishlists
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wishlists" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- Add rental_price and is_rentable to products if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rental_price') THEN
    ALTER TABLE public.products ADD COLUMN rental_price integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_rentable') THEN
    ALTER TABLE public.products ADD COLUMN is_rentable boolean DEFAULT false;
  END IF;
END $$;

-- Storage buckets for new features
INSERT INTO storage.buckets (id, name, public) VALUES ('post-media', 'post-media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('mixtape-audio', 'mixtape-audio', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('mixtape-artwork', 'mixtape-artwork', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for new buckets
CREATE POLICY "Public read post-media" ON storage.objects FOR SELECT USING (bucket_id = 'post-media');
CREATE POLICY "Auth upload post-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-media' AND auth.role() = 'authenticated');
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Public read mixtape-audio" ON storage.objects FOR SELECT USING (bucket_id = 'mixtape-audio');
CREATE POLICY "Public read mixtape-artwork" ON storage.objects FOR SELECT USING (bucket_id = 'mixtape-artwork');
CREATE POLICY "Admin upload mixtape-audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'mixtape-audio' AND (SELECT has_role(auth.uid(), 'admin')));
CREATE POLICY "Admin upload mixtape-artwork" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'mixtape-artwork' AND (SELECT has_role(auth.uid(), 'admin')));

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
