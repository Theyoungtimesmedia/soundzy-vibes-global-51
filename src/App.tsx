import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import Home from "./pages/Home";
import DJ from "./pages/DJ";
import Creative from "./pages/Creative";
import Shop from "./pages/Shop";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get the secret admin slug from environment or use a default for development
const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || 'secret-admin-2024';

const App = () => (
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
            <Route path="/community" element={<Community />} />
            <Route path={`/admin-console-${ADMIN_SLUG}`} element={<Admin />} />
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
);

export default App;
