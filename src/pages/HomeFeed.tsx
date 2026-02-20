import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AppHeader } from '@/components/mobile/AppHeader';
import { StoriesBar } from '@/components/mobile/StoriesBar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MapPin, Music, Plus, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface Post {
  id: string;
  display_name: string;
  is_guest: boolean;
  content: string;
  media_urls: string[];
  location: string | null;
  likes_count: number;
  created_at: string;
}

export default function HomeFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => loadPosts())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(50);
    if (data) setPosts(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <AppHeader />

      {/* Book CTA Hero */}
      <div className="px-4 py-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[20px] p-5"
          style={{
            background: 'var(--gradient-hero)',
            border: '1px solid hsl(47 93% 54% / 0.2)',
            boxShadow: 'var(--shadow-gold)',
          }}
        >
          <div className="relative z-10">
            <p className="text-xs text-primary font-bold uppercase tracking-[0.15em] mb-1.5">
              Available for Events
            </p>
            <h2 className="text-2xl font-bold text-foreground mb-1">Book DJ Soundzy</h2>
            <p className="text-sm text-muted-foreground mb-4">Weddings · Clubs · Corporate</p>
            <Button
              onClick={() => navigate('/book')}
              className="h-12 bg-primary text-primary-foreground font-bold text-sm rounded-full px-8 uppercase tracking-wide"
            >
              Book Now →
            </Button>
          </div>
          {/* Decorative SVG wave */}
          <svg className="absolute right-0 top-0 h-full w-32 opacity-10 text-primary" viewBox="0 0 100 100" fill="none">
            <path d="M50 0 C55 20, 70 30, 60 50 C50 70, 80 80, 50 100" stroke="currentColor" strokeWidth="2" />
            <path d="M70 0 C75 25, 90 35, 80 55 C70 75, 95 85, 70 100" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="80" cy="30" r="3" fill="currentColor" opacity="0.3" />
            <circle cx="90" cy="60" r="2" fill="currentColor" opacity="0.2" />
          </svg>
        </motion.div>
      </div>

      <StoriesBar />
      <MixtapeCard />

      {/* Section header */}
      <div className="px-4 pt-3 pb-1.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Community Vibes ✨</h2>
            <p className="text-xs text-muted-foreground">Events, reviews, and memories</p>
          </div>
          <Button onClick={() => navigate('/create-post')} className="h-10 px-4 bg-primary text-primary-foreground text-xs font-bold gap-1.5 rounded-full">
            <Plus className="h-4 w-4" /> Post
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 pb-4">
        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton-pulse h-40 rounded-[20px]" />)}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <svg className="h-20 w-20 mx-auto mb-4 opacity-20" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="1.5" />
              <path d="M30 55 C30 35, 50 30, 50 45 C50 55, 30 60, 30 55Z" fill="currentColor" opacity="0.3" />
              <circle cx="35" cy="32" r="4" fill="currentColor" opacity="0.4" />
              <path d="M25 45 L35 35 L40 40 L55 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-base font-bold">No posts yet</p>
            <p className="text-sm mt-1">Be the first to share your vibes!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function MixtapeCard() {
  const [mixtape, setMixtape] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('mixtapes').select('*').order('created_at', { ascending: false }).limit(1).single()
      .then(({ data }) => { if (data) setMixtape(data); });
  }, []);

  if (!mixtape) return null;

  return (
    <div className="px-4 py-2">
      <button
        onClick={() => navigate('/mixtapes')}
        className="w-full rounded-[20px] p-4 flex items-center gap-3 text-left"
        style={{
          background: 'hsl(var(--app-bg-elevated))',
          border: '1px solid hsl(47 93% 54% / 0.12)',
        }}
      >
        {mixtape.artwork_url && <img src={mixtape.artwork_url} alt={mixtape.title} className="h-[64px] w-[64px] rounded-xl object-cover" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{mixtape.title}</p>
          <p className="text-xs text-muted-foreground">By DJ Soundzy</p>
          {mixtape.genre && <Badge className="text-[10px] mt-1 bg-primary/10 text-primary">{mixtape.genre}</Badge>}
        </div>
        <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0" style={{ boxShadow: 'var(--shadow-gold)' }}>
          <Music className="h-5 w-5" />
        </div>
      </button>
    </div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const isLong = post.content.length > 150;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="card-premium overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 pb-2">
          <div className="h-11 w-11 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold">
            {post.display_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-foreground truncate">{post.display_name}</span>
              {post.is_guest && <Badge className="text-[10px] bg-muted text-muted-foreground">Guest</Badge>}
            </div>
            <span className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</span>
          </div>
          <button className="tap-target flex items-center justify-center text-muted-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Media */}
        {post.media_urls?.length > 0 && (
          <div className="overflow-hidden">
            <img src={post.media_urls[0]} alt="" className="w-full aspect-video object-cover" loading="lazy" />
          </div>
        )}

        {/* Content */}
        <div className="px-4 py-3">
          <p className="text-sm text-foreground/90 leading-relaxed">
            {isLong && !expanded ? post.content.slice(0, 150) + '...' : post.content}
            {isLong && !expanded && (
              <button onClick={() => setExpanded(true)} className="text-primary text-sm ml-1 font-medium">Read more</button>
            )}
          </p>

          {post.location && (
            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
              <MapPin className="h-3.5 w-3.5" /> {post.location}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-5 px-4 py-3" style={{ borderTop: '1px solid hsl(0 0% 100% / 0.06)' }}>
          <motion.button
            whileTap={{ scale: 1.4 }}
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 transition-colors tap-target ${liked ? 'text-destructive' : 'text-muted-foreground'}`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current heart-burst' : ''}`} />
            <span className="text-sm">{(post.likes_count || 0) + (liked ? 1 : 0)}</span>
          </motion.button>
          <button className="flex items-center gap-1.5 text-muted-foreground tap-target">
            <MessageCircle className="h-5 w-5" /><span className="text-sm">0</span>
          </button>
          <button className="flex items-center gap-1.5 text-muted-foreground tap-target ml-auto">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}
