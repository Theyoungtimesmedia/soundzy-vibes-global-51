import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/useAppStore';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarCheck, Clock, MessageCircle, Package, Heart, Music, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface Notif {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean | null;
  link: string | null;
  created_at: string;
}

const typeConfig: Record<string, { icon: any; color: string }> = {
  booking_confirmed: { icon: CalendarCheck, color: 'bg-[hsl(var(--app-success))]/20 text-[hsl(var(--app-success))]' },
  booking_pending: { icon: Clock, color: 'bg-primary/20 text-primary' },
  new_message: { icon: MessageCircle, color: 'bg-secondary/20 text-secondary' },
  order_update: { icon: Package, color: 'bg-blue-500/20 text-blue-400' },
  post_liked: { icon: Heart, color: 'bg-red-500/20 text-red-400' },
  new_mixtape: { icon: Music, color: 'bg-primary/20 text-primary' },
};

export default function NotificationsScreen() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const setUnreadCount = useAppStore(s => s.setUnreadCount);

  useEffect(() => { loadNotifs(); }, []);

  const loadNotifs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50);
    if (data) {
      setNotifs(data as Notif[]);
      setUnreadCount(data.filter(n => !n.read).length);
    }
    setLoading(false);
  };

  const markRead = async (n: Notif) => {
    if (!n.read) {
      await supabase.from('notifications').update({ read: true }).eq('id', n.id);
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
      setUnreadCount(notifs.filter(x => !x.read && x.id !== n.id).length);
    }
    if (n.link) navigate(n.link);
  };

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const groupByDate = (items: Notif[]) => {
    const groups: Record<string, Notif[]> = {};
    const now = new Date();
    items.forEach(n => {
      const d = new Date(n.created_at);
      const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
      const label = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : 'Earlier';
      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });
    return groups;
  };

  const groups = groupByDate(notifs);

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifs.some(n => !n.read) && (
          <button onClick={markAllRead} className="text-xs text-primary font-medium tap-target">Mark all read</button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : notifs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Bell className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-sm font-bold mb-1">No notifications yet</p>
          <p className="text-xs">We'll let you know when something happens</p>
        </div>
      ) : (
        Object.entries(groups).map(([label, items]) => (
          <div key={label} className="mb-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">{label}</p>
            <div className="space-y-1">
              {items.map((n, i) => {
                const cfg = typeConfig[n.type] || typeConfig.booking_pending;
                const Icon = cfg?.icon || Bell;
                return (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => markRead(n)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors tap-target ${
                      n.read ? 'bg-transparent' : 'bg-card'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${cfg.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>}
                      <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
