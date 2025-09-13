import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ArrowRight, Play, Award, Users, Phone, Mail, Sparkles, Headphones, Palette, ShoppingBag } from "lucide-react";
export default function Home() {
  return <main className="min-h-screen">
      {/* Hero Section - With Background Image */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/hero-home.jpg)' }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-hero">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
              🎵 SoundXY World Global
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              🇳🇬 Nigeria's #1 DJ & Entertainment Services Provider
              <br />
              Professional DJs • Sound Systems • Event Production • Creative Services • Equipment Sales
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="whatsapp" size="xl" asChild className="group">
                <a href="https://wa.me/2348166687167?text=Hi,%20I%20need%20a%20DJ%20for%20my%20event!%20Can%20you%20help%20with%20pricing%20and%20availability?" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <img src="/lovable-uploads/129af1b2-fe79-4aaf-8b75-413d18cea6ab.png" alt="WhatsApp" className="w-5 h-5" />
                  Book DJ Now - WhatsApp
                </a>
              </Button>
              
              <Button variant="premium" size="xl" className="group">
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                Explore Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Professional DJ Services Nigeria</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              🎧 Lagos • Abuja • Port Harcourt • Nationwide DJ Services
              <br />
              Wedding DJs • Corporate Events • Birthday Parties • Sound Equipment Rental
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[{
            icon: <Headphones className="h-8 w-8" />,
            title: "🎵 Professional DJ Services",
            description: "Wedding DJs from ₦50,000 • Corporate Events from ₦80,000 • Premium sound systems & lighting included",
            image: "/images/dj-equipment.jpg",
            price: "From ₦50,000",
            whatsapp: "https://wa.me/2348166687167?text=Hi!%20I%20need%20a%20DJ%20for%20my%20event.%20Can%20you%20send%20me%20pricing%20and%20packages?"
          }, {
            icon: <Palette className="h-8 w-8" />,
            title: "🎨 Creative & Design Services",
            description: "Logo design from ₦15,000 • Website development from ₦150,000 • Complete branding packages available",
            image: "/images/creative-workspace.jpg",
            price: "From ₦15,000",
            whatsapp: "https://wa.me/2348166687167?text=Hi!%20I%20need%20creative%20design%20services.%20Can%20you%20share%20your%20portfolio%20and%20pricing?"
          }, {
            icon: <ShoppingBag className="h-8 w-8" />,
            title: "🛒 Equipment Sales & Rental",
            description: "Speaker rental from ₦20,000/day • Professional microphones, mixers, and complete PA systems",
            image: "/images/sound-equipment.jpg",
            price: "From ₦20,000/day",
            whatsapp: "https://wa.me/2348166687167?text=Hi!%20I%20need%20to%20rent%20sound%20equipment.%20What%20packages%20do%20you%20have%20available?"
          }].map((service, index) => <Card key={index} className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 border-0 shadow-card overflow-hidden bg-gradient-card">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-500"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="text-white group-hover:text-accent transition-colors duration-300 mb-2">
                      {service.icon}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <Badge variant="outline" className="text-green-600 border-green-200 font-semibold">
                      {service.price}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                    {service.description}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      asChild
                    >
                      <a href={service.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <img src="/lovable-uploads/129af1b2-fe79-4aaf-8b75-413d18cea6ab.png" alt="WhatsApp" className="w-4 h-4" />
                        Book Now
                      </a>
                    </Button>
                    <Button variant="outline" size="sm">
                      Details <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* About SWG Section - With Professional Image */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image First */}
            <div className="lg:order-first">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-primary rounded-2xl blur-xl opacity-20"></div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/images/studio-interior.jpg" 
                    alt="Soundzy World Global Professional Studio"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              </div>
            </div>
            
            <div>
              <Badge variant="outline" className="mb-6 border-primary/20 text-primary">
                <Sparkles className="h-4 w-4 mr-2" />
                Fully Licensed & Certified
              </Badge>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                About SoundXY World Global
              </h2>
              
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                SoundXY World Global is Nigeria's leading DJ and entertainment service provider, officially registered with CAC 
                and trusted by 500+ satisfied clients across Lagos, Abuja, and nationwide.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">CAC Business Registration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Entertainment License</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">Professional Insurance</span>
                </div>
              </div>
              
              <Button variant="cta" size="lg" className="group">
                <Award className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Official Certificate
              </Button>
            </div>
            
            {/* Trust Badge Card */}
            <div className="lg:order-last">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-primary rounded-2xl blur-xl opacity-20"></div>
                <Card className="relative bg-white shadow-2xl border-0">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4">Official Certificate</h3>
                      <p className="text-muted-foreground mb-6">
                        Certificate details available upon request for verification purposes.
                      </p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">CAC RC:</span>
                          <span className="font-mono text-sm">7304047</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Status:</span>
                          <Badge variant="outline" className="text-green-600 border-green-200">Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Founded:</span>
                          <span className="text-sm">2017</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-primary text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl md:text-5xl font-bold">500+</div>
              <div className="text-white/80">Events Managed</div>
            </div>
            <div className="space-y-4">
              <div className="text-4xl md:text-5xl font-bold">7+</div>
              <div className="text-white/80">Years Experience</div>
            </div>
            <div className="space-y-4">
              <div className="text-4xl md:text-5xl font-bold">100%</div>
              <div className="text-white/80">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Matching Reference */}
      <section className="py-20 px-4 bg-accent text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Create Magic?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Let's bring your vision to life with our premium entertainment services. 
            Contact us today for a personalized consultation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="whatsapp" size="xl" asChild className="group">
              <a href="https://wa.me/2348166687167?text=Hi!%20I%20need%20DJ%20services%20for%20my%20event.%20Can%20you%20send%20me%20packages%20and%20pricing?" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                <img src="/lovable-uploads/129af1b2-fe79-4aaf-8b75-413d18cea6ab.png" alt="WhatsApp" className="w-5 h-5" />
                📞 Get Free Quote: +234 816 668 7167
              </a>
            </Button>
            
            <Button variant="premium" size="xl" asChild className="group">
              <a href="mailto:soundzybeatz@gmail.com" className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                soundzybeatz@gmail.com
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>;
}