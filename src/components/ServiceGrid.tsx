import { Card, CardContent } from "@/components/ui/card";
import { 
  Music, 
  Mic, 
  Settings, 
  Film, 
  Lightbulb, 
  Speaker, 
  Palette, 
  Megaphone,
  Globe,
  Printer
} from "lucide-react";
import { useServices } from '@/hooks/useServices';

const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case 'music':
      return Music;
    case 'mic':
    case 'speaker':
      return Mic;
    case 'palette':
      return Palette;
    case 'megaphone':
      return Megaphone;
    case 'settings':
      return Settings;
    case 'film':
      return Film;
    case 'lightbulb':
      return Lightbulb;
    case 'globe':
      return Globe;
    case 'printer':
      return Printer;
    default:
      return Music;
  }
};

export const ServiceGrid = () => {
  const { services, loading } = useServices('homepage_services');

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Services</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive entertainment and creative solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-32 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Services</h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive entertainment and creative solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => {
            const Icon = getIconComponent(service.icon);
            return (
              <Card key={service.id || index} className="group hover:shadow-brand transition-all duration-300 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};