import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";

interface HeroSectionProps {
  backgroundImage: string;
  preHeadline?: string;
  headline: string;
  subheadline: string;
  showPrimaryCta?: boolean;
  className?: string;
}

export const HeroSection = ({ 
  backgroundImage, 
  preHeadline,
  headline, 
  subheadline, 
  showPrimaryCta = true,
  className = "" 
}: HeroSectionProps) => {
  return (
    <section 
      className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Content */}
      <div className="relative z-10 text-left max-w-7xl mx-auto px-8 py-20 w-full">
        <div className="max-w-2xl">
          {preHeadline && (
            <p className="text-2xl md:text-3xl text-white/80 mb-4 font-light italic animate-fade-in">
              {preHeadline}
            </p>
          )}
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none tracking-tight animate-scale-in">
            <span className="block text-white">{headline.split(' ')[0]}</span>
            <span className="block text-primary drop-shadow-[0_0_30px_rgba(218,165,32,0.5)]">
              {headline.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg mb-12 text-white/70 font-normal max-w-xl leading-relaxed">
            {subheadline}
          </p>
          
          {showPrimaryCta && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90 text-black font-bold text-base px-10 py-6 rounded-md transition-all hover:scale-105"
              >
                <a 
                  href="https://wa.me/2348166687167" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <MessageCircle className="h-5 w-5" />
                  Get Started Now
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="border-2 border-white/30 bg-white/5 text-white hover:bg-white hover:text-black font-semibold text-base px-10 py-6 rounded-md transition-all backdrop-blur-sm"
              >
                <a 
                  href="mailto:info@soundzyglobal.com"
                  className="flex items-center gap-3"
                >
                  <Phone className="h-5 w-5" />
                  Contact Us
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
