import { Bell, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';

export function AppHeader() {
  const navigate = useNavigate();
  const unread = useAppStore((s) => s.notifications.unreadCount);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg px-4 py-3 flex items-center justify-between safe-top">
      <div className="flex items-center gap-2">
        <img src="/favicon.png" alt="Soundzy" className="h-8 w-8" />
        <span className="font-bold text-sm text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          SOUNDZY
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => navigate('/notifications')}
          className="tap-target flex items-center justify-center relative text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 bg-destructive text-white text-[9px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </button>
        <button
          onClick={() => navigate('/messages')}
          className="tap-target flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
