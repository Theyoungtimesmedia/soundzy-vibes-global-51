import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/useAppStore';
import {
  Calendar, ShoppingBag, Heart, Music, Star, Bell, Info, Phone, LogOut,
  ChevronRight, Shield, Settings as SettingsIcon
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function ProfileScreen() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const guest = useAppStore((s) => s.guest);
  const clearGuest = useAppStore((s) => s.clearGuest);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u || null);
      if (u) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', u.id).single();
        if (data) setProfile(data);
        const { data: role } = await supabase.from('user_roles').select('role').eq('user_id', u.id).eq('role', 'admin').maybeSingle();
        if (role) setIsAdmin(true);
      }
    };
    load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearGuest();
    navigate('/auth');
  };

  const isGuest = !user && guest.guestName;
  const displayName = profile?.full_name || user?.user_metadata?.full_name || guest.guestName || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const menuSections = [
    {
      title: 'My Activity',
      items: [
        { icon: Calendar, label: 'My Bookings', path: '/book', auth: true },
        { icon: ShoppingBag, label: 'My Orders', path: '/shop', auth: true },
        { icon: Heart, label: 'Saved Items', path: '/shop', auth: true },
        { icon: Star, label: 'My Reviews', path: '/profile', auth: true },
      ],
    },
    {
      title: 'Soundzy World',
      items: [
        { icon: Music, label: 'All Mixtapes', path: '/mixtapes', auth: false },
        { icon: Info, label: 'About DJ Soundzy', path: '/profile', auth: false },
        { icon: Phone, label: 'Contact & Support', path: 'https://wa.me/2348166687167', external: true, auth: false },
      ],
    },
    {
      title: 'Settings',
      items: [
        { icon: Bell, label: 'Notifications', path: '/notifications', auth: false },
      ],
    },
  ];

  return (
    <div className="px-4 py-6">
      {/* Profile header */}
      <div
        className="rounded-[20px] p-5 mb-4"
        style={{ background: 'linear-gradient(180deg, hsl(270 30% 10%) 0%, hsl(var(--background)) 100%)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="h-[72px] w-[72px] rounded-full flex items-center justify-center text-xl font-bold"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--primary)))',
              border: '3px solid hsl(var(--primary))',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-white">{initial}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">{displayName}</h2>
              {isGuest && <Badge variant="outline" className="text-[9px] border-muted-foreground/30 text-muted-foreground">Guest</Badge>}
              {isAdmin && <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px]">Admin</Badge>}
            </div>
            {user && <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>}
            {user && <p className="text-[10px] text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</p>}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around mt-4 pt-4 border-t border-[hsl(0_0%_100%/0.06)]">
          {[{ label: 'Events', value: '500+' }, { label: 'Years', value: '7+' }, { label: 'Rating', value: '100%' }].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-bold text-primary">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin link */}
      {isAdmin && (
        <button
          onClick={() => navigate('/admin')}
          className="w-full flex items-center gap-3 p-3.5 rounded-[16px] mb-4 text-left"
          style={{
            background: 'hsl(var(--primary) / 0.08)',
            border: '1px solid hsl(var(--primary) / 0.2)',
          }}
        >
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-primary">Admin Dashboard</p>
            <p className="text-[10px] text-muted-foreground">Manage bookings, messages & more</p>
          </div>
          <ChevronRight className="h-4 w-4 text-primary" />
        </button>
      )}

      {/* Guest upgrade CTA */}
      {isGuest && (
        <div className="card-premium p-4 mb-4" style={{ borderColor: 'hsl(var(--primary) / 0.15)' }}>
          <p className="text-sm font-bold text-foreground mb-1">Create an account</p>
          <p className="text-xs text-muted-foreground mb-3">Save bookings, track orders, and get personalized vibes!</p>
          <Button onClick={() => navigate('/auth')} size="sm" className="h-10 bg-primary text-primary-foreground font-bold rounded-full uppercase text-xs tracking-wide">
            Sign Up / Log In
          </Button>
        </div>
      )}

      {/* Menu sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">{section.title}</p>
          <div className="card-premium overflow-hidden">
            {section.items.map((item, i) => {
              const Icon = item.icon;
              const locked = item.auth && !user;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (locked) { navigate('/auth'); return; }
                    if (item.external) { window.open(item.path, '_blank'); return; }
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-3 py-3.5 px-4 tap-target text-left transition-colors hover:bg-[hsl(0_0%_100%/0.02)] ${
                    i < section.items.length - 1 ? 'border-b border-[hsl(0_0%_100%/0.04)]' : ''
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] text-muted-foreground" />
                  <span className="flex-1 text-sm text-foreground">{item.label}</span>
                  {locked ? (
                    <Shield className="h-4 w-4 text-muted-foreground/30" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Sign out */}
      {(user || isGuest) && (
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 py-3.5 px-4 rounded-[16px] tap-target text-left mt-2 border border-destructive/10 hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="h-[18px] w-[18px] text-destructive" />
          <span className="text-sm text-destructive font-medium">Sign Out</span>
        </button>
      )}

      {/* Footer */}
      <div className="mt-8 text-center">
        <img src="/favicon.png" alt="Soundzy" className="h-10 w-10 mx-auto mb-2 opacity-40" />
        <p className="text-[11px] text-muted-foreground">Soundzy World Global</p>
        <p className="text-[10px] text-muted-foreground/60">Port Harcourt, Nigeria</p>
      </div>
    </div>
  );
}
