import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Package, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    };
    load();
  }, []);

  const statusColor = (s: string) => {
    if (s === 'delivered') return 'bg-[hsl(var(--app-success))]/10 text-[hsl(var(--app-success))]';
    if (s === 'processing') return 'bg-primary/10 text-primary';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="px-4 py-6 pb-28">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/profile')} className="tap-target flex items-center justify-center">
          <ArrowLeft className="h-6 w-6 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-bold">My Orders</h1>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-base font-bold mb-1">No orders yet</p>
          <p className="text-sm text-muted-foreground">Browse our premium gear collection</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold">Order</span>
                </div>
                <Badge className={`text-xs capitalize ${statusColor(o.status)}`}>{o.status || 'pending'}</Badge>
              </div>
              <p className="text-lg font-bold text-primary">₦{(o.total_amount / 100).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
