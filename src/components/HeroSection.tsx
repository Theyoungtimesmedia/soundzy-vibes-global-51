import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";

interface HeroSectionProps {
  backgroundImage: string;
  headline: string;
  subheadline: string;
  showPrimaryCta?: boolean;
  className?: string;
}

export const HeroSection = ({ 
  backgroundImage, 
  headline, 
  subheadline, 
  showPrimaryCta = true,
  className = "" 
}: HeroSectionProps) => {
  return (
    <section 
      className={`relative min-h-[70vh] flex items-center justify-center bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {headline}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
          {subheadline}
        </p>
        
        {showPrimaryCta && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="whatsapp" 
              size="xl"
              asChild
            >
              <a 
                href="https://wa.me/2348166687167" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <MessageCircle className="h-5 w-5" />
                Send WhatsApp Message
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              asChild
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <a 
                href="mailto:soundzybeatz@gmail.com"
                className="flex items-center gap-3"
              >
                <Phone className="h-5 w-5" />
                Email Us
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};