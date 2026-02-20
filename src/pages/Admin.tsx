import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart3, MessageSquare, Users, ShoppingCart, FileText, Music,
  Shield, TrendingUp, Send, ArrowLeft, Phone, CheckCircle,
  XCircle, Clock, Star, Trash2, Edit, Plus, Calendar, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/auth'); return; }
      setUser(session.user);
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      if (!roleData) {
        toast({ title: 'Access Denied', description: 'You do not have admin privileges.', variant: 'destructive' });
        navigate('/'); return;
      }
      setIsAdmin(true);
    } catch { navigate('/auth'); } finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-[hsl(0_0%_100%/0.06)] bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center px-4 h-14 gap-3">
          <button onClick={() => navigate('/')} className="tap-target flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-base font-bold flex-1">Admin Console</h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Admin</Badge>
        </div>
      </div>

      <div className="p-3">
        <Tabs defaultValue="overview" className="space-y-3">
          <div className="overflow-x-auto no-scrollbar -mx-3 px-3">
            <TabsList className="inline-flex gap-1 h-auto p-1 bg-card/50 rounded-2xl">
              {[
                { value: 'overview', icon: BarChart3, label: 'Overview' },
                { value: 'messages', icon: MessageSquare, label: 'Messages' },
                { value: 'bookings', icon: Calendar, label: 'Bookings' },
                { value: 'reviews', icon: Star, label: 'Reviews' },
                { value: 'posts', icon: FileText, label: 'Posts' },
                { value: 'products', icon: ShoppingCart, label: 'Products' },
                { value: 'mixtapes', icon: Music, label: 'Mixtapes' },
              ].map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-3 py-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5">
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview"><AdminOverview /></TabsContent>
          <TabsContent value="messages"><AdminMessages /></TabsContent>
          <TabsContent value="bookings"><AdminBookings /></TabsContent>
          <TabsContent value="reviews"><AdminReviews /></TabsContent>
          <TabsContent value="posts"><AdminPosts /></TabsContent>
          <TabsContent value="products"><AdminProducts /></TabsContent>
          <TabsContent value="mixtapes"><AdminMixtapes /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ─── Overview ─── */
function AdminOverview() {
  const [stats, setStats] = useState({ bookings: 0, messages: 0, orders: 0, products: 0 });
  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split('T')[0];
      const [b, m, o, p] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('conversations').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      ]);
      setStats({ bookings: b.count || 0, messages: m.count || 0, orders: o.count || 0, products: p.count || 0 });
    };
    load();
  }, []);
  const cards = [
    { label: 'Pending Bookings', value: stats.bookings, icon: Calendar, color: 'text-primary' },
    { label: 'Conversations', value: stats.messages, icon: MessageSquare, color: 'text-secondary' },
    { label: 'Orders Today', value: stats.orders, icon: Package, color: 'text-[hsl(var(--app-success))]' },
    { label: 'Active Products', value: stats.products, icon: ShoppingCart, color: 'text-[hsl(199_89%_48%)]' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(c => (
        <Card key={c.label} className="card-premium">
          <CardContent className="p-4">
            <c.icon className={`h-5 w-5 ${c.color} mb-2`} />
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-[11px] text-muted-foreground">{c.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ─── Messages ─── */
function AdminMessages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from('conversations').select('*').order('last_message_at', { ascending: false })
      .then(({ data }) => { if (data) setConversations(data); });
  }, []);

  const openConvo = async (conv: any) => {
    setSelected(conv);
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', conv.id).order('created_at');
    if (data) setMessages(data);
    // Subscribe
    supabase.channel(`admin-msgs-${conv.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conv.id}` },
        (payload) => setMessages(prev => [...prev, payload.new as any]))
      .subscribe();
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 100);
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    await supabase.from('messages').insert({
      conversation_id: selected.id, sender_name: 'DJ Soundzy', content: reply.trim(), is_admin: true,
    });
    await supabase.from('conversations').update({ last_message: reply.trim(), last_message_at: new Date().toISOString() }).eq('id', selected.id);
    setReply('');
    setSending(false);
  };

  if (selected) {
    return (
      <div className="flex flex-col" style={{ height: 'calc(100dvh - 160px)' }}>
        <div className="flex items-center gap-3 pb-3 border-b border-[hsl(0_0%_100%/0.06)]">
          <button onClick={() => setSelected(null)} className="tap-target"><ArrowLeft className="h-5 w-5" /></button>
          <div className="h-9 w-9 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-bold text-secondary">
            {(selected.display_name || 'U').charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold">{selected.display_name || 'User'}</p>
            <p className="text-[10px] text-muted-foreground">Conversation</p>
          </div>
          {selected.user_id && (
            <a href={`tel:+234`} className="ml-auto tap-target flex items-center justify-center">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </a>
          )}
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-3 space-y-2">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                msg.is_admin ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-card border border-[hsl(0_0%_100%/0.06)] rounded-bl-md'
              }`}>
                <p>{msg.content}</p>
                <p className="text-[9px] mt-1 opacity-50">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Quick replies */}
        <div className="pb-2 overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5">
            {['Thank you!', "I'll confirm shortly", 'Your event is confirmed! 🎉', "I'll call you"].map(qr => (
              <button key={qr} onClick={() => setReply(qr)} className="shrink-0 px-2.5 py-1.5 rounded-full text-[10px] bg-card border border-[hsl(0_0%_100%/0.06)] text-muted-foreground">
                {qr}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-[hsl(0_0%_100%/0.06)]">
          <Input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendReply(); }}
            placeholder="Reply as DJ Soundzy..." className="flex-1 h-10 rounded-xl bg-card text-sm" />
          <Button onClick={sendReply} disabled={!reply.trim() || sending} size="icon" className="h-10 w-10 rounded-xl bg-primary text-primary-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-muted-foreground mb-3">All Conversations</h3>
      {conversations.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No conversations yet</p>
      ) : conversations.map(conv => (
        <button key={conv.id} onClick={() => openConvo(conv)}
          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-[hsl(0_0%_100%/0.06)] hover:border-primary/20 transition-colors text-left">
          <div className="h-11 w-11 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-bold text-secondary shrink-0">
            {(conv.display_name || 'U').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{conv.display_name || 'User'}</p>
            <p className="text-[11px] text-muted-foreground truncate">{conv.last_message || 'No messages'}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-muted-foreground">{conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString() : ''}</p>
            {(conv.unread_count || 0) > 0 && (
              <Badge className="bg-primary text-primary-foreground text-[9px] h-5 mt-1">{conv.unread_count}</Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ─── Bookings ─── */
function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (data) setBookings(data);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    toast({ title: `Booking ${status}` });
    load();
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const statusIcon = (s: string) => s === 'confirmed' ? <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--app-success))]" /> : s === 'completed' ? <Star className="h-3.5 w-3.5 text-primary" /> : <Clock className="h-3.5 w-3.5 text-primary" />;

  return (
    <div>
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
        {['all', 'pending', 'confirmed', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-[hsl(0_0%_100%/0.06)]'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(b => (
          <Card key={b.id} className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {statusIcon(b.status)}
                <span className="text-sm font-bold flex-1">{b.display_name}</span>
                <Badge variant="outline" className="text-[10px] capitalize">{b.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{b.service_type?.replace('_', ' ')}</p>
              {b.event_date && <p className="text-[11px] text-muted-foreground">📅 {new Date(b.event_date).toLocaleDateString()}</p>}
              {b.venue && <p className="text-[11px] text-muted-foreground">📍 {b.venue}</p>}
              {b.phone && <p className="text-[11px] text-muted-foreground">📞 {b.phone}</p>}
              {b.must_play?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {b.must_play.map((s: string, i: number) => <Badge key={i} className="bg-[hsl(var(--app-success))]/10 text-[hsl(var(--app-success))] text-[9px]">{s}</Badge>)}
                </div>
              )}
              {b.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => updateStatus(b.id, 'confirmed')} className="flex-1 h-8 text-xs rounded-xl bg-[hsl(var(--app-success))] text-white">
                    <CheckCircle className="h-3 w-3 mr-1" /> Confirm
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, 'cancelled')} className="h-8 text-xs rounded-xl text-destructive border-destructive/30">
                    <XCircle className="h-3 w-3 mr-1" /> Decline
                  </Button>
                </div>
              )}
              {b.status === 'confirmed' && (
                <Button size="sm" onClick={() => updateStatus(b.id, 'completed')} className="mt-3 h-8 text-xs rounded-xl bg-primary text-primary-foreground w-full">
                  <Star className="h-3 w-3 mr-1" /> Mark Complete
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No bookings</p>}
      </div>
    </div>
  );
}

/* ─── Reviews ─── */
function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('reviews').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setReviews(data); });
  }, []);
  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '0';
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl font-bold text-primary">{avg}</div>
        <div>
          <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className={`h-4 w-4 ${i <= Math.round(Number(avg)) ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />)}</div>
          <p className="text-[11px] text-muted-foreground">{reviews.length} reviews</p>
        </div>
      </div>
      <div className="space-y-2">
        {reviews.map(r => (
          <Card key={r.id} className="card-premium">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className={`h-3 w-3 ${i <= r.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />)}</div>
                <span className="text-xs text-muted-foreground ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm font-bold mb-1">{r.display_name}</p>
              {r.content && <p className="text-xs text-muted-foreground">{r.content}</p>}
            </CardContent>
          </Card>
        ))}
        {reviews.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No reviews yet</p>}
      </div>
    </div>
  );
}

/* ─── Posts ─── */
function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    supabase.from('posts').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setPosts(data); });
  }, []);
  const deletePost = async (id: string) => {
    await supabase.from('posts').delete().eq('id', id);
    setPosts(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Post deleted' });
  };
  return (
    <div className="space-y-2">
      {posts.map(p => (
        <Card key={p.id} className="card-premium">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold">{p.display_name}</span>
              {p.is_guest && <Badge variant="outline" className="text-[9px]">Guest</Badge>}
              <span className="text-[10px] text-muted-foreground ml-auto">{new Date(p.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{p.content}</p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
              <span>❤️ {p.likes_count || 0}</span>
              <button onClick={() => deletePost(p.id)} className="ml-auto text-destructive tap-target flex items-center gap-1">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
      {posts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No posts</p>}
    </div>
  );
}

/* ─── Products ─── */
function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const { toast } = useToast();
  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };
  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('products').update({ is_active: !active }).eq('id', id);
    toast({ title: active ? 'Product deactivated' : 'Product activated' });
    load();
  };
  return (
    <div className="space-y-2">
      {products.map(p => (
        <Card key={p.id} className="card-premium">
          <CardContent className="p-3 flex items-center gap-3">
            {p.image_url ? (
              <img src={p.image_url} alt="" className="h-14 w-14 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{p.name}</p>
              <p className="text-xs text-primary font-bold">₦{(p.price_cents / 100).toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Stock: {p.stock_quantity ?? 0}</p>
            </div>
            <Button size="sm" variant={p.is_active ? 'outline' : 'default'} onClick={() => toggleActive(p.id, p.is_active)}
              className="h-8 text-[10px] rounded-xl shrink-0">
              {p.is_active ? 'Active' : 'Inactive'}
            </Button>
          </CardContent>
        </Card>
      ))}
      {products.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No products</p>}
    </div>
  );
}

/* ─── Mixtapes ─── */
function AdminMixtapes() {
  const [mixtapes, setMixtapes] = useState<any[]>([]);
  const { toast } = useToast();
  useEffect(() => {
    supabase.from('mixtapes').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setMixtapes(data); });
  }, []);
  const deleteMixtape = async (id: string) => {
    await supabase.from('mixtapes').delete().eq('id', id);
    setMixtapes(prev => prev.filter(m => m.id !== id));
    toast({ title: 'Mixtape deleted' });
  };
  return (
    <div className="space-y-2">
      {mixtapes.map(m => (
        <Card key={m.id} className="card-premium">
          <CardContent className="p-3 flex items-center gap-3">
            {m.artwork_url ? (
              <img src={m.artwork_url} alt="" className="h-14 w-14 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Music className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{m.title}</p>
              <p className="text-[11px] text-muted-foreground">{m.genre} · ❤️ {m.likes_count || 0}</p>
            </div>
            <button onClick={() => deleteMixtape(m.id)} className="tap-target text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      ))}
      {mixtapes.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No mixtapes</p>}
    </div>
  );
}
