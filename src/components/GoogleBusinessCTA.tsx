import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, ExternalLink } from "lucide-react";

export const GoogleBusinessCTA = () => {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 shadow-glow">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
              <svg className="h-10 w-10 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Find Us on Google
            </h3>
            <p className="text-muted-foreground mb-4">
              Visit our Google Business Profile to see reviews, photos, and get directions to our Port Harcourt location.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm font-semibold">Rated by our clients</span>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Button 
              size="lg" 
              variant="default"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              asChild
            >
              <a 
                href="https://share.google/nGWycgIcGOxhQx19d" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                View Business Profile
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
