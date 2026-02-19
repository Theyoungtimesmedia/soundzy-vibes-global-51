import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppShell } from "@/components/mobile/AppShell";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useEffect } from "react";

import AuthScreen from "./pages/AuthScreen";
import HomeFeed from "./pages/HomeFeed";
import BookingScreen from "./pages/BookingScreen";
import ShopScreen from "./pages/ShopScreen";
import MessagesScreen from "./pages/MessagesScreen";
import ProfileScreen from "./pages/ProfileScreen";
import CreatePost from "./pages/CreatePost";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const ADMIN_SLUG = 'secret-admin-2024';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  const location = useLocation();
  const isAuth = location.pathname === '/auth';
  const isAdmin = location.pathname.includes('admin');

  if (isAuth) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthScreen />} />
      </Routes>
    );
  }

  if (isAdmin) {
    return (
      <Routes>
        <Route path={`/admin-console-${ADMIN_SLUG}`} element={<Admin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/book" element={<BookingScreen />} />
        <Route path="/shop" element={<ShopScreen />} />
        <Route path="/messages" element={<MessagesScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
