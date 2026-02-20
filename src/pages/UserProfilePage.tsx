import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MessageCircle, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

interface Post {
  id: string;
  content: string;
  media_urls: string[];
  likes_count: number;
  created_at: string;
}

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      const [{ data: p }, { data: userPosts }, { data: userReviews }] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId).single(),
        supabase.from('posts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
        supabase.from('reviews').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      ]);
      if (p) setProfile(p);
      if (userPosts) setPosts(userPosts);
      if (userReviews) setReviews(userReviews);
      setLoading(false);
    };
    load();
  }, [userId]);

  const isOwnProfile = currentUserId === userId;
  const displayName = profile?.full_name || 'Soundzy Fan';
  const initial = displayName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="px-4 py-6 space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-32">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-12 w-12 rounded-full bg-card flex items-center justify-center tap-target" style={{ border: '1px solid hsl(0 0% 100% / 0.06)' }}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold flex-1 truncate">{displayName}</h1>
      </div>

      {/* Profile Card */}
      <div className="px-4 mb-4">
        <div className="card-premium p-6 text-center" style={{ background: 'linear-gradient(180deg, hsl(40 30% 8%) 0%, hsl(var(--card)) 100%)', border: '1px solid hsl(47 93% 54% / 0.1)' }}>
          <div className="h-24 w-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold" style={{ background: 'linear-gradient(135deg, hsl(47 93% 54%), hsl(38 100% 50%))', border: '3px solid hsl(47 93% 54%)', boxShadow: 'var(--shadow-glow)' }}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-primary-foreground">{initial}</span>
            )}
          </div>
          <h2 className="text-xl font-bold mb-1">{displayName}</h2>
          <p className="text-sm text-muted-foreground mb-4">Soundzy Community Member</p>

          <div className="flex items-center justify-around pt-4" style={{ borderTop: '1px solid hsl(0 0% 100% / 0.06)' }}>
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{posts.length}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-primary">{reviews.length}</p>
              <p className="text-xs text-muted-foreground">Reviews</p>
            </div>
          </div>

          {!isOwnProfile && currentUserId && (
            <Button onClick={() => navigate('/messages')} className="mt-4 h-12 rounded-full bg-primary text-primary-foreground font-bold text-sm px-8">
              <MessageCircle className="h-5 w-5 mr-2" /> Message
            </Button>
          )}
          {isOwnProfile && (
            <Button onClick={() => navigate('/profile')} variant="outline" className="mt-4 h-12 rounded-full font-bold text-sm px-8 border-primary/20 text-primary">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="px-4">
        <h3 className="text-lg font-bold mb-3">Posts</h3>
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No posts yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium overflow-hidden">
                {post.media_urls?.length > 0 && (
                  <img src={post.media_urls[0]} alt="" className="w-full aspect-video object-cover" loading="lazy" />
                )}
                <div className="p-4">
                  <p className="text-sm text-foreground/90 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid hsl(0 0% 100% / 0.06)' }}>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Heart className="h-4 w-4" /> {post.likes_count || 0}
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
