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

const services = [
  {
    icon: Music,
    title: "DJ Services",
    description: "Professional DJ sets for all events"
  },
  {
    icon: Mic,
    title: "Sound Engineering",
    description: "Expert audio production and mixing"
  },
  {
    icon: Settings,
    title: "Event Production",
    description: "Full-scale event planning and execution"
  },
  {
    icon: Music,
    title: "Music Production",
    description: "Recording, mixing, and mastering services"
  },
  {
    icon: Lightbulb,
    title: "Stage Lights & Equipment",
    description: "Professional lighting and stage setup"
  },
  {
    icon: Speaker,
    title: "Sound Installation",
    description: "Permanent and temporary audio systems"
  },
  {
    icon: Film,
    title: "Film Making & Video Editing",
    description: "Complete video production services"
  },
  {
    icon: Megaphone,
    title: "Online Promotion",
    description: "Digital marketing and social media"
  },
  {
    icon: Palette,
    title: "Web & Graphic Design",
    description: "Creative design solutions"
  },
  {
    icon: Printer,
    title: "Printing & Press",
    description: "Professional printing services"
  }
];

export const ServiceGrid = () => {
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
            const Icon = service.icon;
            return (
              <Card key={index} className="group hover:shadow-brand transition-all duration-300 cursor-pointer">
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