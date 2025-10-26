import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Phone, MessageCircle, User, LogOut, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);
  const navItems = [
  { href: "/", label: "Home" },
  { href: "/dj", label: "Entertainment & DJ Services" },
  { href: "/creative", label: "General Services" },
  { href: "/shop", label: "Shop" }
];
  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  const ContactButtons = () => <div className="flex items-center gap-2">
      <Button variant="whatsapp" size="sm" asChild>
        <a href="https://wa.me/2348166687167" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      <Button variant="premium" size="sm" asChild>
        <a href="mailto:soundzybeatz@gmail.com" className="flex items-center gap-2 text-white">
          <Phone className="h-4 w-4 text-white" />
          <span className="text-white">soundzybeatz@gmail.com</span>
        </a>
      </Button>
    </div>;
  return <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 md:h-24 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 md:space-x-3">
          <img src="/favicon.png" alt="Soundzy World Global Logo" className="h-12 w-auto md:h-16 lg:h-20" />
          <div className="flex flex-col">
            <span className="font-bold text-base md:text-xl lg:text-2xl bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Soundzy World Global
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Port Harcourt | Online Services
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map(item => <Link key={item.href} to={item.href} className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.href) ? "text-primary font-semibold" : "text-white"}`}>
              {item.label}
            </Link>)}
        </div>

        {/* Desktop Auth & Contact */}
        <div className="hidden md:flex items-center gap-4">
          {user ? <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>{user.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ContactButtons />
            </div> : <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/auth" className="text-white hover:text-primary">Sign In</Link>
              </Button>
              <Button variant="cta" asChild>
                <Link to="/auth" className="text-black">Get Started</Link>
              </Button>
              <ContactButtons />
            </div>}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-6">
              {navItems.map(item => <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)} className={`text-lg font-medium transition-colors hover:text-primary ${isActive(item.href) ? "text-primary font-semibold" : "text-white"}`}>
                  {item.label}
                </Link>)}
              
              <div className="pt-4 border-t space-y-3">
                {user ? <>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </> : <>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button variant="cta" asChild className="w-full justify-start">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>}
                <div className="pt-2">
                  <ContactButtons />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>;
};
