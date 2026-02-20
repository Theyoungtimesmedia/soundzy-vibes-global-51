import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, MapPin, CheckCircle, Clock, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      const { data } = await supabase.from('bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setBookings(data);
      setLoading(false);
    };
    load();
  }, []);

  const statusIcon = (s: string) => {
    if (s === 'confirmed') return <CheckCircle className="h-5 w-5 text-[hsl(var(--app-success))]" />;
    if (s === 'completed') return <Star className="h-5 w-5 text-primary" />;
    return <Clock className="h-5 w-5 text-primary" />;
  };

  return (
    <div className="px-4 py-6 pb-28">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/profile')} className="tap-target flex items-center justify-center">
          <ArrowLeft className="h-6 w-6 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-bold">My Bookings</h1>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-base font-bold mb-1">No bookings yet</p>
          <p className="text-sm text-muted-foreground">Book DJ Soundzy for your next event!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="card-premium p-4">
              <div className="flex items-center gap-3 mb-2">
                {statusIcon(b.status)}
                <span className="text-sm font-bold flex-1">{b.service_type?.replace('_', ' ')}</span>
                <Badge className="bg-primary/10 text-primary text-xs capitalize">{b.status}</Badge>
              </div>
              {b.event_date && <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(b.event_date).toLocaleDateString()}</p>}
              {b.venue && <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> {b.venue}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
