import { HeroSection } from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoogleBusinessCTA } from "@/components/GoogleBusinessCTA";
import { MessageCircle, ArrowRight, Award, Sparkles, Headphones, Palette, ShoppingBag } from "lucide-react";
import heroMain from "@/assets/hero-main.jpg";
import officeEquipment from "@/assets/office-equipment.jpg";
import officeInterior from "@/assets/office-interior.jpg";
import teamMember from "@/assets/team-member.jpg";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        backgroundImage={heroMain}
        preHeadline="Experience the"
        headline="SOUND OF EXCELLENCE"
        subheadline="Premium DJ Services & Creative Design Solutions in Port Harcourt"
      />

      {/* Services Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-3d-gold uppercase">Our Professional Services</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              DJ Services • Graphics & Logo Design • Sound Equipment
              <br />
              Port Harcourt Based | Online Creative Services Worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Headphones className="h-8 w-8" />,
                title: "🎵 Professional DJ Services",
                description: "Wedding DJs from ₦50,000 • Corporate Events from ₦80,000 • Premium sound systems & lighting included",
                image: "/images/dj-equipment.jpg",
                price: "From ₦50,000",
                whatsapp: "https://wa.me/2348166687167?text=Hi!%20I%20need%20a%20DJ%20for%20my%20event.%20Can%20you%20send%20me%20pricing%20and%20packages?"
              },
              {
                icon: <Palette className="h-8 w-8" />,
                title: "🎨 Creative & Design Services",
                description: "Logo design from ₦15,000 • Website development from ₦150,000 • Complete branding packages available",
                image: "/images/creative-workspace.jpg",
                price: "From ₦15,000",
                whatsapp: "https://wa.me/2348166687167?text=Hi!%20I%20need%20creative%20design%20services.%20Can%20you%20share%20your%20portfolio%20and%20pricing?"
              },
              {
                icon: <ShoppingBag className="h-8 w-8" />,
                title: "🛒 Equipment Sales & Rental",
                description: "Speaker rental from ₦20,000/day • Professional microphones, mixers, and complete PA systems",
                image: "/images/sound-equipment.jpg",
                price: "From ₦20,000/day",
                whatsapp: "https://wa.me/2348166687167?text=Hi!%20I%20need%20to%20rent%20sound%20equipment.%20What%20packages%20do%20you%20have%20available?"
              }
            ].map((service, index) => (
              <Card key={index} className="group hover:shadow-glow hover:scale-105 transition-all duration-500 border-0 shadow-card overflow-hidden bg-gradient-card backdrop-blur-sm">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-primary group-hover:text-accent transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>
                <CardContent className="p-6 bg-card/95 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors uppercase tracking-wide">
                      {service.title}
                    </h3>
                    <Badge variant="outline" className="text-primary border-primary/30 font-semibold bg-primary/10">
                      {service.price}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                    {service.description}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-primary hover:shadow-accent text-black font-bold"
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
      <section className="bg-primary/5 py-12">
        <GoogleBusinessCTA />
      </section>

      {/* Office Gallery Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-3d-gold uppercase">Our Port Harcourt Studio</h2>
            <p className="text-lg text-muted-foreground">
              Professional facilities equipped with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="overflow-hidden group hover:shadow-glow transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={officeEquipment} 
                  alt="Professional sound equipment and DJ gear at Soundzy World Global Port Harcourt studio" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">Professional Equipment</h3>
                <p className="text-sm text-muted-foreground">Latest DJ gear and sound systems</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-glow transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={officeInterior} 
                  alt="Modern interior of Soundzy World Global creative studio in Port Harcourt" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">Creative Studio Space</h3>
                <p className="text-sm text-muted-foreground">Designed for innovation and creativity</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden group hover:shadow-glow transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={teamMember} 
                  alt="Professional team member at Soundzy World Global working on creative projects" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">Expert Team</h3>
                <p className="text-sm text-muted-foreground">Skilled professionals at your service</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-first">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-primary rounded-2xl blur-xl opacity-20" />
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/images/studio-interior.jpg" 
                    alt="Soundzy World Global Professional Studio"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </div>
            </div>
            
            <div>
              <Badge variant="outline" className="mb-6 border-primary/20 text-primary">
                <Sparkles className="h-4 w-4 mr-2" />
                Fully Licensed & Certified
              </Badge>
              
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-3d-gold uppercase">
                About Soundzy World Global
              </h2>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Based in Port Harcourt, Soundzy World Global is your trusted partner for professional DJ services, expert graphics & logo design, and premium sound equipment. We serve clients locally and offer remote creative services worldwide.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-muted-foreground">CAC Business Registration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-muted-foreground">Entertainment License</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-muted-foreground">Professional Insurance</span>
                </div>
              </div>
              
              <Button variant="default" size="lg" className="bg-gradient-primary hover:shadow-accent text-black font-bold">
                <Award className="h-5 w-5 mr-2" />
                Official Certificate
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-primary text-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="font-display text-5xl md:text-7xl font-bold">500+</div>
              <div className="text-black/80 text-lg font-semibold">Events Managed</div>
            </div>
            <div className="space-y-4">
              <div className="font-display text-5xl md:text-7xl font-bold">7+</div>
              <div className="text-black/80 text-lg font-semibold">Years Experience</div>
            </div>
            <div className="space-y-4">
              <div className="font-display text-5xl md:text-7xl font-bold">100%</div>
              <div className="text-black/80 text-lg font-semibold">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 text-3d-gold uppercase">
            Ready to Create Magic?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Let's bring your vision to life with our premium entertainment services. 
            Contact us today for a personalized consultation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="default" size="xl" className="bg-gradient-primary hover:shadow-accent text-black font-bold text-lg" asChild>
              <a href="https://wa.me/2348166687167?text=Hi!%20I%20need%20DJ%20services%20for%20my%20event.%20Can%20you%20send%20me%20packages%20and%20pricing?" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                📞 Get Free Quote: +234 816 668 7167
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

