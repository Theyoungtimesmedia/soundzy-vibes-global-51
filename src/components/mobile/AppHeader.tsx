import { Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';

export function AppHeader() {
  const navigate = useNavigate();
  const unread = useAppStore((s) => s.notifications.unreadCount);

  return (
    <header className="sticky top-0 z-40 safe-top">
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: 'hsl(240 14% 4% / 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <img src="/favicon.png" alt="Soundzy" className="h-7 w-7" />
          <span
            className="font-extrabold text-sm tracking-wide text-primary"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SOUNDZY
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => navigate('/notifications')}
            className="tap-target flex items-center justify-center relative text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-destructive text-white text-[9px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5 animate-pulse">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>
          <button
            className="tap-target flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
