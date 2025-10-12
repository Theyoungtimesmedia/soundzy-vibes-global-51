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
      className={`relative min-h-[85vh] flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/50" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border-2 border-primary/20 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-primary/20 rounded-full animate-pulse delay-150" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 py-12">
        {preHeadline && (
          <p className="font-script text-4xl md:text-5xl lg:text-6xl text-primary mb-4 animate-fade-in">
            {preHeadline}
          </p>
        )}
        
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-none text-3d-gold uppercase tracking-wider animate-scale-in">
          {headline}
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl mb-10 text-white/90 font-medium max-w-3xl mx-auto tracking-wide">
          {subheadline}
        </p>
        
        {showPrimaryCta && (
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="default"
              size="xl"
              asChild
              className="bg-gradient-primary text-black font-bold text-lg px-8 py-6 rounded-full shadow-brand hover:scale-105 transition-transform"
            >
              <a 
                href="https://wa.me/2348166687167" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <MessageCircle className="h-6 w-6" />
                Get Started Now
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              asChild
              className="border-2 border-primary text-primary hover:bg-primary hover:text-black font-bold text-lg px-8 py-6 rounded-full transition-all"
            >
              <a 
                href="mailto:info@soundzyglobal.com"
                className="flex items-center gap-3"
              >
                <Phone className="h-6 w-6" />
                Contact Us
              </a>
            </Button>
          </div>
        )}
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
