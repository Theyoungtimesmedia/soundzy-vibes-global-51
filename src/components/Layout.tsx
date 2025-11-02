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
      </main>
      <footer className="bg-background border-t py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src="/favicon.png" alt="Soundzy World Global" className="h-16 w-auto" />
              </div>
              <h3 className="font-bold text-lg mb-3">Soundzy World Global</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Professional DJ services, graphics design, logo design, and premium sound equipment in Port Harcourt. Available online worldwide for creative services.
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
                <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="/dj" className="hover:text-primary transition-colors">DJ Services</a></li>
                <li><a href="/creative" className="hover:text-primary transition-colors">Creative Services</a></li>
                <li><a href="/shop" className="hover:text-primary transition-colors">Equipment Shop</a></li>
                <li><a href="https://share.google/nGWycgIcGOxhQx19d" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Google Business Profile</a></li>
              </ul>
            </div>
            
            {/* Contact & Social */}
            <div>
              <h3 className="font-semibold mb-6 text-lg">Contact</h3>
              <div className="space-y-4 text-sm text-muted-foreground mb-8">
                <div>
                  <p className="font-medium text-foreground">Location</p>
                  <p>Port Harcourt</p>
                  <p>Rivers State, Nigeria</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <p><a href="tel:+2348166687167" className="hover:text-primary transition-colors">+234 816 668 7167</a></p>
                 </div>
                 <div>
                   <p className="font-medium text-foreground">Email</p>
                   <p><a href="mailto:Info@soundzyworld.com.ng" className="hover:text-primary transition-colors text-white">Info@soundzyworld.com.ng</a></p>
                 </div>
                <div>
                  <p className="font-medium text-foreground">Google Business</p>
                  <p><a href="https://share.google/nGWycgIcGOxhQx19d" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                    Visit & Review Us
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                    </svg>
                  </a></p>
                </div>
              </div>
              
              {/* Social Media Icons */}
               <div>
                 <h4 className="font-semibold mb-4 text-sm">Follow Us</h4>
                 <div className="flex items-center gap-4">
                   <a href="https://www.youtube.com/@soundzyofficial6917?si=pYlzXM16pSDNONWZ" target="_blank" rel="noopener noreferrer" className="w-8 h-8 hover:scale-110 transition-transform">
                     <img src="/assets/icons/youtube.png" alt="YouTube" className="w-full h-full object-contain" />
                   </a>
                   <a href="https://www.tiktok.com/@soundzyofficial?_t=ZS-8zOWgJ6vZS4&_r=1" target="_blank" rel="noopener noreferrer" className="w-8 h-8 hover:scale-110 transition-transform">
                     <img src="/assets/icons/tiktok.png" alt="TikTok" className="w-full h-full object-contain" />
                   </a>
                   <a href="#" className="w-8 h-8 hover:scale-110 transition-transform opacity-50" title="Instagram - Coming Soon">
                     <img src="/assets/icons/instagram.png" alt="Instagram" className="w-full h-full object-contain" />
                   </a>
                   <a href="#" className="w-8 h-8 hover:scale-110 transition-transform opacity-50" title="Facebook - Coming Soon">
                     <img src="/assets/icons/facebook.png" alt="Facebook" className="w-full h-full object-contain" />
                   </a>
                   <a href="https://wa.me/2348166687167" target="_blank" rel="noopener noreferrer" className="w-8 h-8 hover:scale-110 transition-transform">
                     <img src="/assets/icons/whatsapp-alt.png" alt="WhatsApp" className="w-full h-full object-contain" />
                   </a>
                 </div>
               </div>
            </div>
          </div>
          
          {/* Newsletter Section */}
          <div className="border-t mt-12 pt-12">
            
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Soundzy World Global. All rights reserved. | Port Harcourt, Nigeria</p>
          </div>
        </div>
      </footer>
    </div>;
};