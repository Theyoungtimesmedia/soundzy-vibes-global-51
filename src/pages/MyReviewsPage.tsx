import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      const { data } = await supabase.from('reviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setReviews(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="px-4 py-6 pb-28">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/profile')} className="tap-target flex items-center justify-center">
          <ArrowLeft className="h-6 w-6 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-bold">My Reviews</h1>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-base font-bold mb-1">No reviews yet</p>
          <p className="text-sm text-muted-foreground mb-6">After your event with DJ Soundzy, share your experience!</p>
          <Button onClick={() => navigate('/book')} className="h-12 px-8 bg-primary text-primary-foreground rounded-full font-bold text-sm uppercase">
            Book an Event
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="card-premium p-4">
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-5 w-5 ${i <= r.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              {r.content && <p className="text-sm text-foreground">{r.content}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
