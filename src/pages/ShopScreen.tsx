import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/stores/useAppStore';
import { ShoppingCart, Plus, Minus, X, Heart, MessageCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  is_rentable?: boolean;
  rental_price?: number;
}

const categories = ['All', 'Speakers', 'Microphones', 'Stage Lighting', 'DJ Equipment', 'Studio', 'Bundles'];

export default function ShopScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { toast } = useToast();
  const setCartCount = useAppStore((s) => s.setCartCount);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (data) setProducts(data as Product[]);
    setLoading(false);
  };

  const loadCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('cart_items').select('*, products(*)').eq('user_id', user.id);
    if (data) {
      setCartItems(data);
      setCartCount(data.reduce((acc: number, item: any) => acc + item.quantity, 0));
    }
  };

  const addToCart = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to add items to cart.', variant: 'destructive' });
      return;
    }
    const existing = cartItems.find((ci) => ci.product_id === productId);
    if (existing) {
      await supabase.from('cart_items').update({ quantity: existing.quantity + 1 }).eq('id', existing.id);
    } else {
      await supabase.from('cart_items').insert({ user_id: user.id, product_id: productId, quantity: 1 });
    }
    // Checkmark animation
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 1500);
    loadCart();
    toast({ title: 'Added to cart! 🛒' });
  };

  const removeFromCart = async (itemId: string) => {
    await supabase.from('cart_items').delete().eq('id', itemId);
    loadCart();
  };

  const updateQty = async (itemId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(itemId); return; }
    await supabase.from('cart_items').update({ quantity: qty }).eq('id', itemId);
    loadCart();
  };

  const filtered = activeCategory === 'All' ? products : products.filter((p) => p.category.toLowerCase().includes(activeCategory.toLowerCase()));
  const cartTotal = cartItems.reduce((acc: number, ci: any) => acc + (ci.products?.price_cents || 0) * ci.quantity, 0);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Premium Gear 🎵</h1>
            <p className="text-sm text-muted-foreground">Pro Audio Equipment & Sound Solutions</p>
          </div>
          <button onClick={() => setShowCart(true)} className="relative tap-target flex items-center justify-center">
            <ShoppingCart className="h-7 w-7 text-muted-foreground" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {cartItems.reduce((a: number, ci: any) => a + ci.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors tap-target ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="px-4 pb-32">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product, idx) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className="overflow-hidden bg-card" style={{ border: '1px solid hsl(0 0% 100% / 0.06)' }}>
                  <div className="aspect-square bg-muted/20 relative">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ShoppingCart className="h-10 w-10 opacity-20" />
                      </div>
                    )}
                    {product.category === 'Bundles' && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold">Bundle</Badge>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5">{product.category}</p>
                    <p className="text-sm font-bold text-foreground line-clamp-2 mb-1.5 leading-tight">{product.name}</p>
                    <p className="text-lg font-bold text-foreground mb-0.5">₦{(product.price_cents / 100).toLocaleString()}</p>
                    {product.is_rentable && product.rental_price && (
                      <p className="text-xs text-muted-foreground mb-2">Rent: ₦{(product.rental_price / 100).toLocaleString()}/day</p>
                    )}
                    <Button
                      size="sm"
                      onClick={() => addToCart(product.id)}
                      disabled={(product.stock_quantity ?? 0) <= 0}
                      className="w-full h-11 text-xs rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-wide"
                    >
                      {addedId === product.id ? (
                        <><Check className="h-4 w-4 mr-1" /> Added!</>
                      ) : (
                        <><Plus className="h-4 w-4 mr-1" /> Add to Cart</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cart bar — positioned above bottom nav with proper spacing */}
      {cartItems.length > 0 && !showCart && (
        <div className="fixed bottom-[calc(88px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40">
          <div className="app-container px-4">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-primary text-primary-foreground rounded-2xl p-4 flex items-center justify-between font-bold text-sm"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <span>🛒 {cartItems.reduce((a: number, ci: any) => a + ci.quantity, 0)} items</span>
              <span>₦{(cartTotal / 100).toLocaleString()} → Checkout</span>
            </button>
          </div>
        </div>
      )}

      {/* Cart sheet */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="app-container h-full flex flex-col">
              <div className="flex items-center justify-between p-4">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <button onClick={() => setShowCart(false)} className="tap-target flex items-center justify-center">
                  <X className="h-6 w-6 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <p className="text-base font-bold mb-1">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Browse our premium gear collection</p>
                  </div>
                ) : (
                  cartItems.map((ci: any) => (
                    <div key={ci.id} className="flex items-center gap-3 bg-card rounded-2xl p-3" style={{ border: '1px solid hsl(0 0% 100% / 0.06)' }}>
                      {ci.products?.image_url && (
                        <img src={ci.products.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{ci.products?.name}</p>
                        <p className="text-sm text-primary font-bold">₦{((ci.products?.price_cents || 0) / 100).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(ci.id, ci.quantity - 1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{ci.quantity}</span>
                        <button onClick={() => updateQty(ci.id, ci.quantity + 1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="p-4 space-y-4" style={{ background: 'hsl(240 14% 6%)' }}>
                  <div className="flex items-center justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary text-xl">₦{(cartTotal / 100).toLocaleString()}</span>
                  </div>
                  <Button asChild className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-full text-sm uppercase tracking-wide">
                    <a href={`https://wa.me/2348166687167?text=Hi! I'd like to order: ${cartItems.map((ci: any) => `${ci.products?.name} x${ci.quantity}`).join(', ')}. Total: ₦${(cartTotal / 100).toLocaleString()}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5 mr-2" /> Complete via WhatsApp
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
