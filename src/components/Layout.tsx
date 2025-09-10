import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { useServices } from '@/hooks/useServices';
interface LayoutProps {
  children: ReactNode;
}
export const Layout = ({
  children
}: LayoutProps) => {
  const { services: footerServices } = useServices('footer_services');
  return <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
        {/* WhatsApp Float Button */}
        <div className="relative">
          <div className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group">
            <a href="https://wa.me/2348166687167?text=Hi,%20I'm%20interested%20in%20Soundzy%20World%20Global%20services.%20Can%20you%20help%20me?" target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center" aria-label="Contact us on WhatsApp">
              <img src="/lovable-uploads/129af1b2-fe79-4aaf-8b75-413d18cea6ab.png" alt="WhatsApp" className="w-8 h-8 filter brightness-0 invert group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </main>
      <footer className="bg-background border-t py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src="/lovable-uploads/522535fe-b8e2-4598-aaa4-fe680d012385.png" alt="Soundzy World Global Logo" className="h-12 w-auto" />
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  SWG
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Premium Afro-global entertainment services that bring your events to life 
                with professional sound, lighting, and creative excellence.
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                CAC RC 7304047
              </p>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Services</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {footerServices.map((service) => (
                  <li key={service.id} className="hover:text-primary transition-colors cursor-pointer">
                    {service.title}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Quick Links</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-primary transition-colors">Soundzy Global</a></li>
                <li><a href="/dj" className="hover:text-primary transition-colors">Soundzy Entertainment</a></li>
                <li><a href="/creative" className="hover:text-primary transition-colors">Creative Services</a></li>
                <li><a href="/shop" className="hover:text-primary transition-colors">Equipment Shop</a></li>
              </ul>
            </div>
            
            {/* Contact & Social */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Contact</h3>
              <div className="space-y-4 text-sm text-muted-foreground mb-8">
                <div>
                  <p className="font-medium text-foreground">Address</p>
                  <p>Royal Paragon Street</p>
                  <p>by Iwofe Road, PH City</p>
                  <p>Rivers State, Nigeria</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <p>+234 816 668 7167</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p>soundzybeatz@gmail.com</p>
                </div>
              </div>
              
              {/* Social Media Icons */}
              <div>
                <h4 className="font-semibold mb-4 text-sm">Follow Us</h4>
                <div className="flex items-center gap-4">
                  <a href="https://www.youtube.com/@soundzyofficial6917?si=pYlzXM16pSDNONWZ" target="_blank" rel="noopener noreferrer" className="w-8 h-8 hover:scale-110 transition-transform">
                    <img src="/lovable-uploads/d473772a-e449-48b9-8ee9-d9eb33f959a6.png" alt="YouTube" className="w-full h-full object-contain" />
                  </a>
                  <a href="https://www.tiktok.com/@soundzyofficial?_t=ZS-8zOWgJ6vZS4&_r=1" target="_blank" rel="noopener noreferrer" className="w-8 h-8 hover:scale-110 transition-transform">
                    <img src="/lovable-uploads/a8477a7f-9c2f-4a55-99af-84fd482a5076.png" alt="TikTok" className="w-full h-full object-contain" />
                  </a>
                  <a href="#" className="w-8 h-8 hover:scale-110 transition-transform opacity-50" title="Instagram - Coming Soon">
                    <img src="/lovable-uploads/161d31ff-fdd9-4b31-bdb6-503ad5bf8f20.png" alt="Instagram" className="w-full h-full object-contain" />
                  </a>
                  <a href="#" className="w-8 h-8 hover:scale-110 transition-transform opacity-50" title="Facebook - Coming Soon">
                    <img src="/lovable-uploads/4343b4e2-4b11-4c0b-9f3d-5b271c7c1e8a.png" alt="Facebook" className="w-full h-full object-contain" />
                  </a>
                  <a href="https://wa.me/2348166687167" target="_blank" rel="noopener noreferrer" className="w-8 h-8 hover:scale-110 transition-transform">
                    <img src="/lovable-uploads/129af1b2-fe79-4aaf-8b75-413d18cea6ab.png" alt="WhatsApp" className="w-full h-full object-contain" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter Section */}
          <div className="border-t mt-12 pt-12">
            
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Soundzy World Global. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};