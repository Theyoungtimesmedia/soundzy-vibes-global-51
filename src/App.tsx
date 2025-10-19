import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Home from "./pages/Home";
import DJ from "./pages/DJ";
import Creative from "./pages/Creative";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

import NotFound from "./pages/NotFound";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Secret admin slug - do not rely on env vars in Lovable
const ADMIN_SLUG = 'secret-admin-2024';

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dj" element={<DJ />} />
              <Route path="/creative" element={<Creative />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Admin routes */}
              <Route path={`/admin-console-${ADMIN_SLUG}`} element={<Admin />} />
              <Route path="/admin" element={<Admin />} />
              {/* Blog routes */}
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          
          {/* Global Components */}
          <ChatWidget />
          <WhatsAppCTA />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
