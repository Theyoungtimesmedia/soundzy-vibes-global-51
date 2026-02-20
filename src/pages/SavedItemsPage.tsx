import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function SavedItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      const { data } = await supabase.from('wishlists').select('*, products(*)').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setItems(data);
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
        <h1 className="text-xl font-bold">Saved Items</h1>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-base font-bold mb-1">No saved items</p>
          <p className="text-sm text-muted-foreground mb-6">Save products you love for later</p>
          <Button onClick={() => navigate('/shop')} className="h-12 px-8 bg-primary text-primary-foreground rounded-full font-bold text-sm uppercase">
            Browse Shop
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="card-premium p-3 flex items-center gap-3">
              {item.products?.image_url ? (
                <img src={item.products.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{item.products?.name}</p>
                <p className="text-sm text-primary font-bold">₦{((item.products?.price_cents || 0) / 100).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
