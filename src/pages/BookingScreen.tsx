import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones, Building2, PartyPopper, Mic, Volume2, Palette, Package,
  Loader2, CheckCircle, ArrowLeft, Calendar, Clock, MapPin, Users, Music, X, Plus, MessageCircle
} from 'lucide-react';

const services = [
  { key: 'wedding_dj', icon: Headphones, title: 'Wedding DJ', price: '₦50,000', desc: 'Sound, Lighting & Stage Included' },
  { key: 'corporate', icon: Building2, title: 'Corporate Event', price: '₦80,000', desc: 'Professional & Polished' },
  { key: 'party', icon: PartyPopper, title: 'Club Night / Party', price: '₦60,000', desc: 'High Energy Sets' },
  { key: 'mc', icon: Mic, title: 'MC / Hype Man', price: '₦40,000', desc: 'Crowd Interaction & Hosting' },
  { key: 'sound', icon: Volume2, title: 'Live Sound Engineering', price: '₦35,000', desc: 'Pro Audio Management' },
  { key: 'design', icon: Palette, title: 'Graphics & Design', price: '₦15,000', desc: 'Logos, Flyers & Branding' },
  { key: 'rental', icon: Package, title: 'Equipment Rental', price: '₦20,000/day', desc: 'PA Systems, Mics & Lights' },
];

type Screen = 'services' | 'form' | 'success' | 'bookings';

export default function BookingScreen() {
  const [screen, setScreen] = useState<Screen>('services');
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', date: '', time: '', venue: '', guests: '',
    mustPlay: [] as string[], doNotPlay: [] as string[], budget: 50000, special: '',
  });
  const [newSong, setNewSong] = useState('');
  const [newDnp, setNewDnp] = useState('');
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({ title: 'Missing info', description: 'Name and phone are required.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('bookings').insert({
      user_id: user?.id || null,
      display_name: form.name,
      phone: form.phone,
      email: form.email || null,
      service_type: selected,
      event_date: form.date || null,
      event_time: form.time || null,
      venue: form.venue || null,
      guest_count: form.guests ? parseInt(form.guests) : null,
      must_play: form.mustPlay,
      do_not_play: form.doNotPlay,
      budget: form.budget,
      special_requests: form.special || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setScreen('success');
  };

  const loadBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setMyBookings(data);
  };

  useEffect(() => { if (screen === 'bookings') loadBookings(); }, [screen]);

  const statusColor = (s: string) => {
    if (s === 'confirmed') return 'text-[hsl(var(--app-success))]';
    if (s === 'completed') return 'text-primary';
    return 'text-primary';
  };

  return (
    <div className="px-4 py-6">
      <AnimatePresence mode="wait">
        {screen === 'services' && (
          <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-primary">Book DJ Soundzy</h1>
              <button onClick={() => setScreen('bookings')} className="text-xs text-muted-foreground underline tap-target">My Bookings</button>
            </div>
            <div className="space-y-3">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    onClick={() => { setSelected(s.key); setScreen('form'); }}
                    className="w-full flex items-center gap-3 bg-card rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-colors text-left tap-target"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{s.title}</p>
                      <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary shrink-0">{s.price}</Badge>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {screen === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <button onClick={() => setScreen('services')} className="flex items-center gap-1 text-muted-foreground text-sm mb-4 tap-target">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h2 className="text-xl font-bold mb-1">
              {services.find((s) => s.key === selected)?.title}
            </h2>
            <p className="text-muted-foreground text-xs mb-6">Fill in your event details below</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Full Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl bg-card border-border mt-1" required />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone Number *</Label>
                <div className="flex gap-2 mt-1">
                  <div className="h-11 px-3 bg-card border border-border rounded-xl flex items-center text-xs text-muted-foreground">🇳🇬 +234</div>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="h-11 rounded-xl bg-card border-border flex-1" placeholder="816 668 7167" required />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-xl bg-card border-border mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Event Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="h-11 rounded-xl bg-card border-border mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Time</Label>
                  <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="h-11 rounded-xl bg-card border-border mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Venue / Location</Label>
                <Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="h-11 rounded-xl bg-card border-border mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Guest Count</Label>
                <Input type="number" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="h-11 rounded-xl bg-card border-border mt-1" />
              </div>

              {/* Must-Play Songs */}
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1"><Music className="h-3 w-3" /> Must-Play Songs</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={newSong} onChange={(e) => setNewSong(e.target.value)} placeholder="Add a song" className="h-9 rounded-xl bg-card border-border text-xs flex-1" />
                  <Button type="button" size="sm" variant="outline" className="h-9 rounded-xl" onClick={() => { if (newSong.trim()) { setForm({ ...form, mustPlay: [...form.mustPlay, newSong.trim()] }); setNewSong(''); } }}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.mustPlay.map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] gap-1">
                      {s} <X className="h-2.5 w-2.5 cursor-pointer" onClick={() => setForm({ ...form, mustPlay: form.mustPlay.filter((_, j) => j !== i) })} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <Label className="text-xs text-muted-foreground">Budget: ₦{form.budget.toLocaleString()}</Label>
                <input
                  type="range"
                  min={20000}
                  max={500000}
                  step={5000}
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: parseInt(e.target.value) })}
                  className="w-full mt-2 accent-[hsl(var(--primary))]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>₦20,000</span><span>₦500,000+</span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Special Requests</Label>
                <Textarea value={form.special} onChange={(e) => setForm({ ...form, special: e.target.value })} className="rounded-xl bg-card border-border mt-1 min-h-[80px]" />
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Booking Request
              </Button>
            </form>
          </motion.div>
        )}

        {screen === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center pt-20">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Booking Sent! 🎉</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs">DJ Soundzy will contact you within 24 hours to confirm your event.</p>
            <div className="space-y-3 w-full max-w-xs">
              <Button asChild className="w-full h-11 rounded-xl bg-[#25D366] text-white font-bold">
                <a href="https://wa.me/2348166687167" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" /> Message on WhatsApp
                </a>
              </Button>
              <Button variant="outline" onClick={() => { setScreen('bookings'); }} className="w-full h-11 rounded-xl">
                View My Bookings
              </Button>
            </div>
          </motion.div>
        )}

        {screen === 'bookings' && (
          <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={() => setScreen('services')} className="flex items-center gap-1 text-muted-foreground text-sm mb-4 tap-target">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h2 className="text-xl font-bold mb-4">My Bookings</h2>
            {myBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {myBookings.map((b) => (
                  <Card key={b.id} className="bg-card border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold">{services.find((s) => s.key === b.service_type)?.title || b.service_type}</p>
                        <Badge variant="outline" className={`text-[10px] ${statusColor(b.status)}`}>{b.status}</Badge>
                      </div>
                      {b.event_date && <p className="text-xs text-muted-foreground">{new Date(b.event_date).toLocaleDateString()}</p>}
                      {b.venue && <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {b.venue}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
