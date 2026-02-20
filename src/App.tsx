import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppShell } from "@/components/mobile/AppShell";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const AuthScreen = lazy(() => import("./pages/AuthScreen"));
const HomeFeed = lazy(() => import("./pages/HomeFeed"));
const BookingScreen = lazy(() => import("./pages/BookingScreen"));
const ShopScreen = lazy(() => import("./pages/ShopScreen"));
const MessagesScreen = lazy(() => import("./pages/MessagesScreen"));
const ProfileScreen = lazy(() => import("./pages/ProfileScreen"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const MixtapesScreen = lazy(() => import("./pages/MixtapesScreen"));
const NotificationsScreen = lazy(() => import("./pages/NotificationsScreen"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000 },
  },
});

const ADMIN_SLUG = 'secret-admin-2024';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-48 rounded-xl" />
      <Skeleton className="h-40 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAuth = location.pathname === '/auth';
  const isAdmin = location.pathname.includes('admin');

  if (isAuth) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
        </Routes>
      </Suspense>
    );
  }

  if (isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path={`/admin-console-${ADMIN_SLUG}`} element={<Admin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/book" element={<BookingScreen />} />
          <Route path="/shop" element={<ShopScreen />} />
          <Route path="/messages" element={<MessagesScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/mixtapes" element={<MixtapesScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
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
