import { AudioPlayer } from "@/components/AudioPlayer";
import { HeroSection } from "@/components/HeroSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Mic, Calendar, Award, Users, Volume2 } from "lucide-react";
import heroDj from "@/assets/hero-dj-premium.jpg";

export default function DJ() {
  const services = [
    {
      icon: Music,
      title: "Wedding DJ",
      description: "Perfect soundtrack for your special day"
    },
    {
      icon: Volume2,
      title: "Club Nights",
      description: "High-energy sets that keep the crowd moving"
    },
    {
      icon: Calendar,
      title: "Corporate Events",
      description: "Professional entertainment for business functions"
    },
    {
      icon: Mic,
      title: "MC / Hype Man",
      description: "Engaging crowd interaction and event hosting"
    },
    {
      icon: Award,
      title: "Live Sound Engineering",
      description: "Professional audio setup and management"
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        backgroundImage={heroDj}
        preHeadline="Feel the"
        headline="RHYTHM"
        subheadline="Professional DJ Services & Premium Sound Equipment in Port Harcourt"
      />

      {/* DJ Bio Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-3d-gold uppercase">Meet DJ Soundzy</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              With over 7 years of experience in the entertainment industry, DJ Soundzy 
              (aka Odogwu Na Vibes) has become one of the most sought-after DJs in the region. 
              Known for reading the crowd and creating unforgettable musical experiences, 
              he brings energy and professionalism to every event.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="h-16 w-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">500+ Events</h3>
                <p className="text-muted-foreground">Successfully entertained</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="h-16 w-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">50,000+ Fans</h3>
                <p className="text-muted-foreground">Across all platforms</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="h-16 w-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Award Winner</h3>
                <p className="text-muted-foreground">Industry recognition</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* DJ Services */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-3d-gold uppercase">DJ Services</h2>
            <p className="text-lg text-muted-foreground">
              Professional entertainment for every occasion
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="group hover:shadow-brand transition-all duration-300">
                  <CardHeader>
                    <div className="h-12 w-12 mb-4 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Gigs & Showreels */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-3d-gold uppercase">Recent Gigs & Showreels</h2>
            <p className="text-lg text-muted-foreground">
              Experience the energy of DJ Soundzy's performances
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Showreel Card 1 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/7U0ehmGE1G0"
                    title="DJ Soundzy Performance Highlights"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">Latest Performance Highlights</h3>
                  <p className="text-sm text-muted-foreground">
                    Watch DJ Soundzy in action at recent events and club performances
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Showreel Card 2 */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/myAHW7UuUDE"
                    title="DJ Soundzy Behind the Decks"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">Behind the Decks</h3>
                  <p className="text-sm text-muted-foreground">
                    Exclusive look at DJ techniques and crowd interaction skills
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* DJ Mixtapes Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background via-card/50 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-primary/10 border-primary/30 text-primary">
              🎧 Fresh Mixes
            </Badge>
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 text-3d-gold uppercase">
              Latest Mixtapes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the hottest Afrobeats, hip-hop, and party anthems. Listen, download, and share the vibes!
            </p>
          </div>
          
          <div className="space-y-8">
            <AudioPlayer
              src="/mixtapes/summer-vibes-2024.mp3"
              title="Summer Vibes Mix 2024"
              artist="DJ Soundzy (Odogwu Na Vibes)"
              genre="Afrobeats • Dancehall"
              downloadUrl="/mixtapes/summer-vibes-2024.mp3"
              albumArt="/lovable-uploads/908ec127-5e76-4301-84c0-34eddfc15eb2.png"
            />
            <AudioPlayer
              src="/mixtapes/club-bangers.mp3"
              title="Club Bangers Vol. 1"
              artist="DJ Soundzy (Odogwu Na Vibes)"
              genre="Hip-Hop • Trap"
              downloadUrl="/mixtapes/club-bangers.mp3"
              albumArt="/lovable-uploads/908ec127-5e76-4301-84c0-34eddfc15eb2.png"
            />
            <AudioPlayer
              src="/mixtapes/afrobeats-essentials.mp3"
              title="Afrobeats Essentials"
              artist="DJ Soundzy (Odogwu Na Vibes)"
              genre="Afrobeats • Amapiano"
              downloadUrl="/mixtapes/afrobeats-essentials.mp3"
              albumArt="/lovable-uploads/908ec127-5e76-4301-84c0-34eddfc15eb2.png"
            />
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-card to-card/80 border border-primary/30 shadow-glow">
              <h3 className="text-2xl font-bold mb-4">Want a Custom Mix?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Book DJ Soundzy for your next event and get a personalized mixtape tailored to your vibe!
              </p>
              <Button variant="default" size="lg" className="bg-gradient-primary hover:shadow-accent text-black font-bold" asChild>
                <a 
                  href="https://wa.me/2348166687167?text=Hi DJ Soundzy! I'm interested in booking you for an event and would love a custom mix!" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Now on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Press & Credentials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-3d-gold uppercase">Press & Nollywood Work</h2>
          <p className="text-lg text-muted-foreground mb-8">
            DJ Soundzy is officially licensed to work in Nollywood productions and 
            is a certified member of professional entertainment associations.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Award className="h-5 w-5" />
                  Nollywood Work Permit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src="/lovable-uploads/8145e5df-a0a6-4ad7-b79b-64dd23291a18.png" 
                  alt="Nollywood Work Permit"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Award className="h-5 w-5" />
                  Professional Membership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src="/lovable-uploads/a93d22b2-9d29-4935-8eb8-8b99f328cbd5.png" 
                  alt="AMPSOMI Certificate"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-3d-gold uppercase">Book DJ Soundzy</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ready to make your event unforgettable? Contact DJ Soundzy for professional 
            entertainment that will keep your guests talking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="default" size="xl" className="bg-gradient-primary hover:shadow-accent text-black font-bold" asChild>
              <a 
                href="https://wa.me/2348166687167" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                WhatsApp Booking
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="mailto:info@soundzyglobal.com">
                Email Inquiry
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
