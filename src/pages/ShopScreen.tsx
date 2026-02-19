import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/stores/useAppStore';
import { ShoppingCart, Plus, Minus, X, Heart, MessageCircle } from 'lucide-react';
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
    loadCart();
    toast({ title: 'Added to cart! 🛒' });
  };

  const filtered = activeCategory === 'All' ? products : products.filter((p) => p.category.toLowerCase().includes(activeCategory.toLowerCase()));
  const cartTotal = cartItems.reduce((acc: number, ci: any) => acc + (ci.products?.price_cents || 0) * ci.quantity, 0);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-2xl font-bold text-foreground">Premium Gear</h1>
        <p className="text-xs text-muted-foreground">Pro Audio Equipment & Sound Solutions</p>
      </div>

      {/* Category filter */}
      <div className="px-4 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors tap-target ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="px-4 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <Card key={product.id} className="overflow-hidden border-border/50 bg-card">
                <div className="aspect-square bg-muted/30 relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ShoppingCart className="h-8 w-8 opacity-30" />
                    </div>
                  )}
                  {product.original_price_cents && (
                    <Badge className="absolute top-2 left-2 bg-destructive text-white text-[9px]">Sale</Badge>
                  )}
                  {(product.stock_quantity ?? 0) <= 0 && (
                    <Badge variant="outline" className="absolute top-2 right-2 bg-background text-[9px]">Out of Stock</Badge>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="text-xs font-bold text-foreground truncate mb-1">{product.name}</p>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm font-bold text-primary">₦{(product.price_cents / 100).toLocaleString()}</span>
                    {product.original_price_cents && (
                      <span className="text-[10px] text-muted-foreground line-through">₦{(product.original_price_cents / 100).toLocaleString()}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addToCart(product.id)}
                    disabled={(product.stock_quantity ?? 0) <= 0}
                    className="w-full h-8 text-[10px] rounded-xl bg-primary text-primary-foreground font-bold"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cart bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-[calc(60px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40">
          <div className="app-container px-4 pb-2">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-primary text-primary-foreground rounded-2xl p-3 flex items-center justify-between font-bold text-sm shadow-lg"
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
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="app-container h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-bold">Your Cart</h2>
                <button onClick={() => setShowCart(false)} className="tap-target"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.map((ci: any) => (
                  <div key={ci.id} className="flex items-center gap-3 bg-card rounded-xl p-3">
                    {ci.products?.image_url && (
                      <img src={ci.products.image_url} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{ci.products?.name}</p>
                      <p className="text-xs text-primary font-bold">₦{((ci.products?.price_cents || 0) / 100).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-6 text-center">{ci.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Total</span>
                  <span className="text-primary">₦{(cartTotal / 100).toLocaleString()}</span>
                </div>
                <Button asChild className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl">
                  <a href={`https://wa.me/2348166687167?text=Hi! I'd like to order: ${cartItems.map((ci: any) => `${ci.products?.name} x${ci.quantity}`).join(', ')}. Total: ₦${(cartTotal / 100).toLocaleString()}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" /> Complete via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
