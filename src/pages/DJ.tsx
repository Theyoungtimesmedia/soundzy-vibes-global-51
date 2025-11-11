import { useState, useEffect } from 'react';
import { AudioPlayer } from "@/components/AudioPlayer";
import { HeroSection } from "@/components/HeroSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Mic, Calendar, Award, Users, Volume2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import heroDj from "@/assets/hero-dj-premium.jpg";

interface DJTape {
  id: string;
  title: string;
  artist_name: string;
  audio_url?: string;
  cover_image?: string;
  genre?: string;
  status: string;
}

interface VideoEmbed {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  video_type: string;
  thumbnail_url: string | null;
}

export default function DJ() {
  const [djTapes, setDjTapes] = useState<DJTape[]>([]);
  const [videos, setVideos] = useState<VideoEmbed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load DJ Tapes
      const { data: tapesData } = await supabase
        .from('dj_tapes')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Load Videos (including local uploads)
      const { data: videosData } = await supabase
        .from('video_embeds')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      setDjTapes(tapesData || []);
      setVideos(videosData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Announcement Banner */}
      <AnnouncementBanner />
      
      {/* Hero Section */}
      <HeroSection 
        backgroundImage={heroDj}
        preHeadline="Professional"
        headline="DJ SERVICES"
        subheadline="Weddings, Corporate Events & Club Nights in Port Harcourt"
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
            {videos.filter(v => v.video_type !== 'upload').length > 0 ? (
              videos.filter(v => v.video_type !== 'upload').map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video">
                      <iframe
                        src={video.video_url}
                        title={video.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold mb-2">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* Local Videos Section */}
      {videos.filter(v => v.video_type === 'upload').length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-3d-gold uppercase">Local Videos</h2>
              <p className="text-lg text-muted-foreground">
                Exclusive content from DJ Soundzy
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.filter(v => v.video_type === 'upload').map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-video">
                      <video
                        controls
                        poster={video.thumbnail_url || undefined}
                        className="w-full h-full"
                      >
                        <source src={video.video_url} />
                        Your browser does not support video playback.
                      </video>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold mb-2">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading mixtapes...
              </div>
            ) : djTapes.length > 0 ? (
              djTapes.map((tape) => (
                <AudioPlayer
                  key={tape.id}
                  src={tape.audio_url || ''}
                  title={tape.title}
                  artist={tape.artist_name}
                  genre={tape.genre}
                  downloadUrl={tape.audio_url}
                  albumArt={tape.cover_image || '/assets/images/dj-album-art.png'}
                />
              ))
            ) : (
              <>
                <AudioPlayer
                  src="/mixtapes/summer-vibes-2024.mp3"
                  title="Summer Vibes Mix 2024"
                  artist="DJ Soundzy (Odogwu Na Vibes)"
                  genre="Afrobeats • Dancehall"
                  downloadUrl="/mixtapes/summer-vibes-2024.mp3"
                  albumArt="/assets/images/dj-album-art.png"
                />
                <AudioPlayer
                  src="/mixtapes/club-bangers.mp3"
                  title="Club Bangers Vol. 1"
                  artist="DJ Soundzy (Odogwu Na Vibes)"
                  genre="Hip-Hop • Trap"
                  downloadUrl="/mixtapes/club-bangers.mp3"
                  albumArt="/assets/images/dj-album-art.png"
                />
                <AudioPlayer
                  src="/mixtapes/afrobeats-essentials.mp3"
                  title="Afrobeats Essentials"
                  artist="DJ Soundzy (Odogwu Na Vibes)"
                  genre="Afrobeats • Amapiano"
                  downloadUrl="/mixtapes/afrobeats-essentials.mp3"
                  albumArt="/assets/images/dj-album-art.png"
                />
              </>
            )}
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
                  src="/assets/certifications/nollywood-permit.png" 
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
                  src="/assets/certifications/ampsomi-cert.png" 
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
