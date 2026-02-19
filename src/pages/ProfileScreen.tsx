import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/useAppStore';
import {
  Calendar, ShoppingBag, Heart, Music, Star, Bell, Moon, Info, Phone, LogOut,
  ChevronRight, User, Award, Shield
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function ProfileScreen() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
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

  const menuItems = [
    { icon: Calendar, label: 'My Bookings', path: '/book', auth: true },
    { icon: ShoppingBag, label: 'My Orders', path: '/shop', auth: true },
    { icon: Heart, label: 'Saved Items', path: '/shop', auth: true },
    { icon: Music, label: 'Mixtapes', path: '/mixtapes', auth: false },
    { icon: Star, label: 'My Reviews', path: '/profile', auth: true },
    { icon: Bell, label: 'Notifications', path: '/notifications', auth: false },
    { icon: Info, label: 'About DJ Soundzy', path: '/about', auth: false },
    { icon: Phone, label: 'Contact & Support', path: 'https://wa.me/2348166687167', external: true, auth: false },
  ];

  return (
    <div className="px-4 py-6">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xl font-bold">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">{displayName}</h2>
            {isGuest && <Badge variant="outline" className="text-[9px] border-muted-foreground/30 text-muted-foreground">Guest</Badge>}
          </div>
          {user && <p className="text-xs text-muted-foreground">{user.email}</p>}
          {user && <p className="text-[10px] text-muted-foreground">Member since {new Date(user.created_at).toLocaleDateString()}</p>}
        </div>
      </div>

      {/* Guest upgrade CTA */}
      {isGuest && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm font-bold text-foreground mb-1">Create an account</p>
            <p className="text-xs text-muted-foreground mb-3">Save bookings, track orders, and get personalized vibes!</p>
            <Button onClick={() => navigate('/auth')} size="sm" className="h-9 bg-primary text-primary-foreground font-bold rounded-xl">
              Sign Up / Log In
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Menu items */}
      <div className="space-y-1">
        {menuItems.map((item) => {
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
              className="w-full flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-card transition-colors tap-target text-left"
            >
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm text-foreground">{item.label}</span>
              {locked ? (
                <Shield className="h-4 w-4 text-muted-foreground/50" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sign out */}
      {(user || isGuest) && (
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-destructive/10 transition-colors tap-target text-left mt-4"
        >
          <LogOut className="h-5 w-5 text-destructive" />
          <span className="text-sm text-destructive">Sign Out</span>
        </button>
      )}

      {/* About section */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="text-center">
          <img src="/favicon.png" alt="Soundzy" className="h-12 w-12 mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Soundzy World Global</p>
          <p className="text-[10px] text-muted-foreground">Port Harcourt, Nigeria</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">500+</p>
              <p className="text-[9px]">Events</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">7+</p>
              <p className="text-[9px]">Years</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">100%</p>
              <p className="text-[9px]">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
