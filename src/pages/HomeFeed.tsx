import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AppHeader } from '@/components/mobile/AppHeader';
import { StoriesBar } from '@/components/mobile/StoriesBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, MessageCircle, Share2, MapPin, Music, Plus } from 'lucide-react';
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

      {/* Book CTA */}
      <div className="px-4 py-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-primary/20 p-4"
          style={{ background: 'linear-gradient(135deg, hsl(270 30% 8%) 0%, hsl(0 0% 4%) 40%, hsl(40 30% 8%) 100%)', boxShadow: 'var(--app-gold-shadow)' }}>
          <div className="relative z-10">
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Available for Events</p>
            <p className="text-foreground font-bold text-lg mb-0.5">Book DJ Soundzy</p>
            <p className="text-muted-foreground text-xs mb-3">Weddings · Clubs · Corporate</p>
            <Button onClick={() => navigate('/book')} size="sm" className="h-9 bg-primary text-primary-foreground font-bold text-xs rounded-full px-5">
              Book Now →
            </Button>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/10">
            <Music className="h-24 w-24" />
          </div>
        </motion.div>
      </div>

      {/* Stories */}
      <StoriesBar />

      {/* Latest Mixtape */}
      <MixtapeCard />

      {/* Section header */}
      <div className="px-4 pt-2 pb-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Community Vibes ✨</h2>
            <p className="text-[10px] text-muted-foreground">Events, reviews, and memories</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => navigate('/create-post')} className="h-8 text-primary text-xs gap-1">
            <Plus className="h-3.5 w-3.5" /> Post
          </Button>
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 pb-4">
        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Music className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No posts yet</p>
            <p className="text-xs mt-1">Be the first to share your vibes!</p>
          </div>
        ) : (
          <div className="space-y-4">
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
      <button onClick={() => navigate('/mixtapes')} className="w-full bg-card rounded-2xl border border-secondary/20 p-3 flex items-center gap-3 text-left">
        {mixtape.artwork_url && <img src={mixtape.artwork_url} alt={mixtape.title} className="h-14 w-14 rounded-xl object-cover" />}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground truncate">{mixtape.title}</p>
          <p className="text-[10px] text-muted-foreground">By DJ Soundzy</p>
          {mixtape.genre && <Badge variant="outline" className="text-[9px] h-4 mt-1 border-secondary/30 text-secondary">{mixtape.genre}</Badge>}
        </div>
        <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
          <Music className="h-4 w-4" />
        </div>
      </button>
    </div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = post.content.length > 150;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }}>
      <Card className="overflow-hidden border-border/50 bg-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-xs font-bold">
              {post.display_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground truncate">{post.display_name}</span>
                {post.is_guest && <Badge variant="outline" className="text-[9px] h-4 border-muted-foreground/30 text-muted-foreground">Guest</Badge>}
              </div>
              <span className="text-[10px] text-muted-foreground">{timeAgo(post.created_at)}</span>
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed mb-3">
            {isLong && !expanded ? post.content.slice(0, 150) + '...' : post.content}
            {isLong && !expanded && <button onClick={() => setExpanded(true)} className="text-primary text-xs ml-1">Read more</button>}
          </p>

          {post.media_urls?.length > 0 && (
            <div className="rounded-xl overflow-hidden mb-3">
              <img src={post.media_urls[0]} alt="" className="w-full aspect-video object-cover" loading="lazy" />
            </div>
          )}

          {post.location && (
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] mb-3">
              <MapPin className="h-3 w-3" /> {post.location}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2 border-t border-border/50">
            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors tap-target">
              <Heart className="h-4 w-4" /><span className="text-xs">{post.likes_count || 0}</span>
            </button>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-secondary transition-colors tap-target">
              <MessageCircle className="h-4 w-4" /><span className="text-xs">0</span>
            </button>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors tap-target ml-auto">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
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
