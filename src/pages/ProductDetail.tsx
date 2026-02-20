import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShoppingCart, MessageCircle, Check, Plus, Minus, Star, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price_cents: number;
  original_price_cents: number | null;
  image_url: string | null;
  is_active: boolean | null;
  stock_quantity: number | null;
  rating: number | null;
  is_rentable: boolean | null;
  rental_price: number | null;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [mode, setMode] = useState<'buy' | 'rent'>('buy');
  const [rentalDays, setRentalDays] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('products').select('*').eq('id', id).single(),
      supabase.from('product_reviews').select('*').eq('product_id', id).order('created_at', { ascending: false }).limit(10),
    ]).then(([{ data: p }, { data: r }]) => {
      if (p) setProduct(p);
      if (r) setReviews(r);
      setLoading(false);
    });
  }, [id]);

  const addToCart = async () => {
    if (!product) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to add items to cart.', variant: 'destructive' });
      return;
    }
    setAdding(true);
    const { data: existing } = await supabase.from('cart_items').select('*').eq('user_id', user.id).eq('product_id', product.id).maybeSingle();
    if (existing) {
      await supabase.from('cart_items').update({ quantity: existing.quantity + 1 }).eq('id', existing.id);
    } else {
      await supabase.from('cart_items').insert({ user_id: user.id, product_id: product.id, quantity: 1 });
    }
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    toast({ title: 'Added to cart! 🛒' });
  };

  if (loading) {
    return (
      <div className="px-4 py-6 space-y-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-80 rounded-2xl" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-4 py-20 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
        <p className="text-lg font-bold mb-2">Product not found</p>
        <Button onClick={() => navigate('/shop')} variant="outline" className="rounded-full">Back to Shop</Button>
      </div>
    );
  }

  const inStock = (product.stock_quantity ?? 0) > 0;
  const totalRent = (product.rental_price || 0) * rentalDays;
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) : 0;

  return (
    <div className="flex flex-col pb-32">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-12 w-12 rounded-full bg-card flex items-center justify-center tap-target" style={{ border: '1px solid hsl(0 0% 100% / 0.06)' }}>
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold flex-1 truncate">{product.category}</h1>
      </div>

      {/* Image */}
      <div className="px-4 mb-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="aspect-square rounded-[24px] overflow-hidden bg-card" style={{ border: '1px solid hsl(0 0% 100% / 0.06)' }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ShoppingCart className="h-20 w-20 opacity-10" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Info */}
      <div className="px-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge className="text-[10px] bg-primary/10 text-primary font-bold uppercase tracking-wider mb-2">{product.category}</Badge>
            <h2 className="text-2xl font-bold leading-tight">{product.name}</h2>
          </div>
          <Badge className={`shrink-0 ${inStock ? 'bg-[hsl(160_84%_39%)]/10 text-[hsl(160_84%_39%)]' : 'bg-destructive/10 text-destructive'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>

        {/* Price */}
        <div>
          <p className="text-3xl font-bold text-foreground">₦{(product.price_cents / 100).toLocaleString()}</p>
          {product.is_rentable && product.rental_price && (
            <p className="text-sm text-muted-foreground mt-1">or rent from ₦{(product.rental_price / 100).toLocaleString()}/day</p>
          )}
        </div>

        {/* Buy/Rent Toggle */}
        {product.is_rentable && product.rental_price && (
          <div className="space-y-3">
            <div className="flex gap-2 p-1 bg-card rounded-full" style={{ border: '1px solid hsl(0 0% 100% / 0.06)' }}>
              <button onClick={() => setMode('buy')} className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${mode === 'buy' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                Buy
              </button>
              <button onClick={() => setMode('rent')} className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${mode === 'rent' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                Rent
              </button>
            </div>
            {mode === 'rent' && (
              <div className="card-premium p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold">Rental Duration</p>
                  <p className="text-lg font-bold text-primary">₦{(totalRent / 100).toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => setRentalDays(Math.max(1, rentalDays - 1))} className="h-12 w-12 rounded-full bg-card flex items-center justify-center tap-target" style={{ border: '1px solid hsl(0 0% 100% / 0.06)' }}>
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="text-2xl font-bold w-16 text-center">{rentalDays}</span>
                  <button onClick={() => setRentalDays(rentalDays + 1)} className="h-12 w-12 rounded-full bg-card flex items-center justify-center tap-target" style={{ border: '1px solid hsl(0 0% 100% / 0.06)' }}>
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">{rentalDays} day{rentalDays > 1 ? 's' : ''}</p>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div>
            <h3 className="text-base font-bold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-base font-bold">Reviews</h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-bold">{avgRating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">({reviews.length})</span>
            </div>
            <div className="space-y-2">
              {reviews.slice(0, 3).map(r => (
                <div key={r.id} className="card-premium p-3">
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 ${i <= r.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />)}
                  </div>
                  {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-[calc(96px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 px-4">
        <div className="app-container flex gap-3">
          <Button asChild variant="outline" className="h-14 px-6 rounded-full font-bold text-sm border-primary/20 text-primary">
            <a href={`https://wa.me/2348166687167?text=Hi! I'm interested in ${product.name}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" /> Ask
            </a>
          </Button>
          <Button onClick={addToCart} disabled={!inStock || adding} className="flex-1 h-14 rounded-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wide">
            {added ? <><Check className="h-5 w-5 mr-2" /> Added!</> : <><ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
