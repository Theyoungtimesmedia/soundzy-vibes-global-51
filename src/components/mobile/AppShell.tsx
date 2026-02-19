import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="app-container min-h-screen pb-[calc(60px+env(safe-area-inset-bottom,0px))]">
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  );
}
