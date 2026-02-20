import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppShell } from "@/components/mobile/AppShell";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AuthScreen = lazy(() => import("./pages/AuthScreen"));
const HomeFeed = lazy(() => import("./pages/HomeFeed"));
const BookingScreen = lazy(() => import("./pages/BookingScreen"));
const ShopScreen = lazy(() => import("./pages/ShopScreen"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const MessagesScreen = lazy(() => import("./pages/MessagesScreen"));
const ProfileScreen = lazy(() => import("./pages/ProfileScreen"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const MixtapesScreen = lazy(() => import("./pages/MixtapesScreen"));
const NotificationsScreen = lazy(() => import("./pages/NotificationsScreen"));
const Admin = lazy(() => import("./pages/Admin"));
const MyBookingsPage = lazy(() => import("./pages/MyBookingsPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const SavedItemsPage = lazy(() => import("./pages/SavedItemsPage"));
const MyReviewsPage = lazy(() => import("./pages/MyReviewsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000 },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="p-4 space-y-4">
      <div className="skeleton-pulse h-8 w-48 rounded-xl" />
      <div className="skeleton-pulse h-40 rounded-2xl" />
      <div className="skeleton-pulse h-32 rounded-2xl" />
    </div>
  );
}

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15, ease: [0.42, 0, 1, 1] as const } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAuth = location.pathname === '/auth';
  const isAdmin = location.pathname.includes('admin');

  if (isAuth) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/auth" element={<AuthScreen />} />
        </Routes>
      </Suspense>
    );
  }

  if (isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><HomeFeed /></AnimatedPage>} />
            <Route path="/book" element={<AnimatedPage><BookingScreen /></AnimatedPage>} />
            <Route path="/shop" element={<AnimatedPage><ShopScreen /></AnimatedPage>} />
            <Route path="/product/:id" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
            <Route path="/user/:userId" element={<AnimatedPage><UserProfilePage /></AnimatedPage>} />
            <Route path="/messages" element={<AnimatedPage><MessagesScreen /></AnimatedPage>} />
            <Route path="/profile" element={<AnimatedPage><ProfileScreen /></AnimatedPage>} />
            <Route path="/create-post" element={<AnimatedPage><CreatePost /></AnimatedPage>} />
            <Route path="/mixtapes" element={<AnimatedPage><MixtapesScreen /></AnimatedPage>} />
            <Route path="/notifications" element={<AnimatedPage><NotificationsScreen /></AnimatedPage>} />
            <Route path="/my-bookings" element={<AnimatedPage><MyBookingsPage /></AnimatedPage>} />
            <Route path="/my-orders" element={<AnimatedPage><MyOrdersPage /></AnimatedPage>} />
            <Route path="/saved-items" element={<AnimatedPage><SavedItemsPage /></AnimatedPage>} />
            <Route path="/my-reviews" element={<AnimatedPage><MyReviewsPage /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
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
