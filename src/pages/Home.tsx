import { HeroSection } from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoogleBusinessCTA } from "@/components/GoogleBusinessCTA";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { MessageCircle, Award, Sparkles, Headphones, Palette, ShoppingBag } from "lucide-react";
import heroMain from "@/assets/hero-main.jpg";
import officeEquipment from "@/assets/office-equipment.jpg";
import officeInterior from "@/assets/office-interior.jpg";
import teamMember from "@/assets/team-member.jpg";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Announcements */}
      <div className="container mx-auto px-4 pt-6">
        <AnnouncementBanner />
      </div>
      
      {/* Hero Section */}
      <HeroSection
        backgroundImage={heroMain}
        preHeadline="Welcome to"
        headline="SOUNDZY WORLD GLOBAL"
        subheadline="(SWG) - Professional Entertainment & DJ Services, Creative Design & Premium Sound Equipment in Port Harcourt"
      />

      {/* Services Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Our Services</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Professional solutions for events, branding, and audio needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Headphones className="h-8 w-8" />,
                title: "Professional Entertainment & DJ Services",
                description: "Wedding DJs from ₦50,000 • Corporate Events from ₦80,000 • Complete sound, lighting & stage setup included",
                image: "/images/dj-equipment.jpg",
                price: "From ₦50,000",
                whatsapp: "https://wa.me/2348166687167?text=Hi!%20I%20need%20Entertainment%20and%20DJ%20services%20for%20my%20event.%20Can%20you%20send%20me%20pricing%20and%20packages?"
              },
              {
                icon: <Palette className="h-8 w-8" />,
                title: "Creative & Design Services",
                description: "Logo design from ₦15,000 • Website development from ₦150,000 • Complete branding packages available",
                image: "/images/creative-workspace.jpg",
                price: "From ₦15,000",
                whatsapp: "https://wa.me/2348166687167?text=Hi!%20I%20need%20creative%20design%20services.%20Can%20you%20share%20your%20portfolio%20and%20pricing?"
              },
              {
                icon: <ShoppingBag className="h-8 w-8" />,
                title: "Equipment Sales & Rental",
                description: "Speaker rental from ₦20,000/day • Professional microphones, mixers, and complete PA systems",
                image: "/images/sound-equipment.jpg",
                price: "From ₦20,000/day",
                whatsapp: "https://wa.me/2348166687167?text=Hi!%20I%20need%20to%20rent%20sound%20equipment.%20What%20packages%20do%20you%20have%20available?"
              }
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/50 overflow-hidden bg-card">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <CardContent className="p-8">
                  <div className="mb-4 text-primary">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-primary border-primary/30 font-semibold">
                      {service.price}
                    </Badge>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-black font-bold"
                      asChild
                    >
                      <a href={service.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Book Now
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Google Business CTA */}
      <section className="bg-card/30 py-16">
        <GoogleBusinessCTA />
      </section>

      {/* Office Gallery Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Our Port Harcourt Studio</h2>
            <p className="text-lg text-muted-foreground font-light">
              Professional facilities equipped with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/50">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={officeEquipment} 
                  alt="Professional sound equipment and DJ gear at Soundzy World Global Port Harcourt studio" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Professional Equipment</h3>
                <p className="text-sm text-muted-foreground">Latest DJ gear and sound systems</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/50">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={officeInterior} 
                  alt="Modern interior of Soundzy World Global creative studio in Port Harcourt" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Creative Studio Space</h3>
                <p className="text-sm text-muted-foreground">Designed for innovation and creativity</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/50">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={teamMember} 
                  alt="Professional team member at Soundzy World Global working on creative projects" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Expert Team</h3>
                <p className="text-sm text-muted-foreground">Skilled professionals at your service</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="lg:order-first">
              <div className="relative">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src="/images/studio-interior.jpg" 
                    alt="Soundzy World Global Professional Studio"
                    className="w-full h-96 object-cover"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
                <Sparkles className="h-4 w-4 mr-2" />
                Fully Licensed & Certified
              </Badge>
              
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                About Soundzy World Global
              </h2>
              
              <p className="text-lg text-white/90 mb-8 leading-relaxed font-light">
                Based in Port Harcourt, Soundzy World Global is your trusted partner for professional entertainment & DJ services, expert graphics & logo design, and premium sound equipment. We offer complete event solutions including DJ services, sound systems, lighting, stage setup, and more. We serve clients locally and offer remote creative services worldwide.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span className="text-white/90">CAC Business Registration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span className="text-white/90">Entertainment License</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <span className="text-white/90">Professional Insurance</span>
                </div>
              </div>
              
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold">
                <Award className="h-5 w-5 mr-2" />
                View Certificate
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4 bg-primary text-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl md:text-7xl font-black">500+</div>
              <div className="text-black/70 text-lg font-medium">Events Managed</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl md:text-7xl font-black">7+</div>
              <div className="text-black/70 text-lg font-medium">Years Experience</div>
            </div>
            <div className="space-y-4">
              <div className="text-6xl md:text-7xl font-black">100%</div>
              <div className="text-black/70 text-lg font-medium">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Ready to Elevate Your Experience?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light">
            Let's bring your vision to life with our premium services. 
            Contact us today for a personalized consultation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold text-lg px-10" asChild>
              <a href="https://wa.me/2348166687167?text=Hi!%20I%20need%20services.%20Can%20you%20send%20me%20more%20information?" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                Get Free Quote
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

