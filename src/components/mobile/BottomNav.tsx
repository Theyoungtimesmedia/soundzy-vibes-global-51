import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, ShoppingBag, MessageCircle, User } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/book', icon: Calendar, label: 'Book' },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="app-container flex items-center justify-around h-[60px]">
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
                'flex flex-col items-center justify-center gap-0.5 tap-target relative transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {active && (
                <span className="absolute -top-0 w-8 h-0.5 rounded-full bg-primary" />
              )}
              <div className="relative">
                <Icon className="h-5 w-5" />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-destructive text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
