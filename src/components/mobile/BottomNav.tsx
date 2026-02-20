import { useLocation, useNavigate } from 'react-router-dom';
import { Home, CalendarDays, ShoppingBag, MessageCircle, User } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/book', icon: CalendarDays, label: 'Book' },
  { path: '/shop', icon: ShoppingBag, label: 'Shop' },
  { path: '/messages', icon: MessageCircle, label: 'Chat' },
  { path: '/profile', icon: User, label: 'Me' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = useAppStore((s) => s.cart.itemCount);
  const unreadMessages = useAppStore((s) => s.notifications.unreadMessages);
  const unreadNotifs = useAppStore((s) => s.notifications.unreadCount);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom px-4 pb-4">
      <div className="app-container">
        <div
          className="flex items-center justify-around h-16 rounded-[28px] bg-card/90 backdrop-blur-xl border border-[hsl(0_0%_100%/0.08)]"
          style={{ boxShadow: '0 8px 32px hsl(0 0% 0% / 0.6)' }}
        >
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            const Icon = tab.icon;
            let badge = 0;
            if (tab.path === '/shop') badge = cartCount;
            if (tab.path === '/messages') badge = unreadMessages;
            if (tab.path === '/') badge = unreadNotifs;

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 tap-target relative transition-all duration-200',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div className="relative">
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute -inset-2 rounded-full bg-primary/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className={cn('h-5 w-5 relative z-10', active && 'nav-tab-active')} />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-destructive text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 z-20">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  'text-[10px] font-medium transition-all duration-200',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
