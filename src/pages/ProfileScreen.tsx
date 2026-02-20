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
      title: 'MY ACTIVITY',
      items: [
        { icon: Calendar, label: 'My Bookings', path: '/my-bookings', auth: true },
        { icon: ShoppingBag, label: 'My Orders', path: '/my-orders', auth: true },
        { icon: Heart, label: 'Saved Items', path: '/saved-items', auth: true },
        { icon: Star, label: 'My Reviews', path: '/my-reviews', auth: true },
      ],
    },
    {
      title: 'SOUNDZY WORLD',
      items: [
        { icon: Music, label: 'All Mixtapes', path: '/mixtapes', auth: false },
        { icon: Info, label: 'About DJ Soundzy', path: '/about', auth: false },
        { icon: Phone, label: 'Contact & Support', path: '/contact', auth: false },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { icon: Bell, label: 'Notifications', path: '/notifications', auth: false },
      ],
    },
  ];

  return (
    <div className="px-4 py-6 pb-28">
      {/* Profile header */}
      <div
        className="rounded-[20px] p-5 mb-5"
        style={{ background: 'linear-gradient(180deg, hsl(40 30% 8%) 0%, hsl(var(--background)) 100%)', border: '1px solid hsl(47 93% 54% / 0.1)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              background: 'linear-gradient(135deg, hsl(47 93% 54%), hsl(38 100% 50%))',
              border: '3px solid hsl(47 93% 54%)',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-primary-foreground">{initial}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{displayName}</h2>
              {isGuest && <Badge className="text-[10px] bg-muted text-muted-foreground">Guest</Badge>}
              {isAdmin && <Badge className="bg-primary/10 text-primary text-[10px]">Admin</Badge>}
            </div>
            {user && <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>}
            {user && <p className="text-xs text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</p>}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around mt-5 pt-4" style={{ borderTop: '1px solid hsl(0 0% 100% / 0.06)' }}>
          {[{ label: 'Events', value: '500+' }, { label: 'Years', value: '7+' }, { label: 'Rating', value: '100%' }].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin link */}
      {isAdmin && (
        <button
          onClick={() => navigate('/admin')}
          className="w-full flex items-center gap-3 p-4 rounded-[20px] mb-5 text-left"
          style={{
            background: 'hsl(47 93% 54% / 0.06)',
            border: '1px solid hsl(47 93% 54% / 0.15)',
          }}
        >
          <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-primary">Admin Dashboard</p>
            <p className="text-xs text-muted-foreground">Manage bookings, messages & more</p>
          </div>
          <ChevronRight className="h-5 w-5 text-primary" />
        </button>
      )}

      {/* Guest upgrade CTA */}
      {isGuest && (
        <div className="card-premium p-5 mb-5">
          <p className="text-base font-bold text-foreground mb-1">Create an account</p>
          <p className="text-sm text-muted-foreground mb-4">Save bookings, track orders, and get personalized vibes!</p>
          <Button onClick={() => navigate('/auth')} className="h-12 bg-primary text-primary-foreground font-bold rounded-full uppercase text-xs tracking-wide px-8">
            Sign Up / Log In
          </Button>
        </div>
      )}

      {/* Menu sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="mb-5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">{section.title}</p>
          <div className="card-premium overflow-hidden">
            {section.items.map((item, i) => {
              const Icon = item.icon;
              const locked = item.auth && !user;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (locked) { navigate('/auth'); return; }
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-3 py-4 px-4 tap-target text-left transition-colors hover:bg-[hsl(0_0%_100%/0.02)] ${
                    i < section.items.length - 1 ? 'border-b' : ''
                  }`}
                  style={{ borderColor: 'hsl(0 0% 100% / 0.04)' }}
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                  {locked ? (
                    <Shield className="h-5 w-5 text-muted-foreground/30" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground/30" />
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
          className="w-full flex items-center gap-3 py-4 px-4 rounded-[20px] tap-target text-left mt-2"
          style={{ border: '1px solid hsl(0 84% 60% / 0.1)' }}
        >
          <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut className="h-5 w-5 text-destructive" />
          </div>
          <span className="text-sm text-destructive font-medium">Sign Out</span>
        </button>
      )}

      {/* Footer */}
      <div className="mt-10 text-center">
        <img src="/favicon.png" alt="Soundzy" className="h-12 w-12 mx-auto mb-2 opacity-40" />
        <p className="text-sm text-muted-foreground">Soundzy World Global</p>
        <p className="text-xs text-muted-foreground/60">Port Harcourt, Nigeria</p>
      </div>
    </div>
  );
}
