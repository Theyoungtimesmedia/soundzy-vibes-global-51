import { create } from 'zustand';

interface GuestState {
  guestName: string | null;
  guestId: string | null;
}

interface CartState {
  itemCount: number;
}

interface NotificationState {
  unreadCount: number;
  unreadMessages: number;
}

interface AppState {
  guest: GuestState;
  cart: CartState;
  notifications: NotificationState;
  setGuest: (name: string, id: string) => void;
  clearGuest: () => void;
  setCartCount: (count: number) => void;
  setUnreadCount: (count: number) => void;
  setUnreadMessages: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  guest: {
    guestName: localStorage.getItem('guest_name'),
    guestId: localStorage.getItem('guest_id'),
  },
  cart: { itemCount: 0 },
  notifications: { unreadCount: 0, unreadMessages: 0 },
  setGuest: (name, id) => {
    localStorage.setItem('guest_name', name);
    localStorage.setItem('guest_id', id);
    set({ guest: { guestName: name, guestId: id } });
  },
  clearGuest: () => {
    localStorage.removeItem('guest_name');
    localStorage.removeItem('guest_id');
    set({ guest: { guestName: null, guestId: null } });
  },
  setCartCount: (count) => set({ cart: { itemCount: count } }),
  setUnreadCount: (count) => set((s) => ({ notifications: { ...s.notifications, unreadCount: count } })),
  setUnreadMessages: (count) => set((s) => ({ notifications: { ...s.notifications, unreadMessages: count } })),
}));
