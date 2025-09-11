import { HeroSection } from "@/components/HeroSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Globe, Megaphone, Film, Printer, Camera } from "lucide-react";
import { useServices } from '@/hooks/useServices';
import { Link } from 'react-router-dom';

// Portfolio images
import portfolioWebDesign from "@/assets/portfolio-web-design.jpg";
import portfolioBrandIdentity from "@/assets/portfolio-brand-identity.jpg";
import portfolioVideoProduction from "@/assets/portfolio-video-production.jpg";
import portfolioPrintDesign from "@/assets/portfolio-print-design.jpg";
import portfolioDigitalMarketing from "@/assets/portfolio-digital-marketing.jpg";
import portfolioLogoDesign from "@/assets/portfolio-logo-design.jpg";

export default function Creative() {
  const { services: creativeServices, loading: servicesLoading } = useServices('creative_services');

  const portfolioItems = [
    {
      category: "Web Design",
      title: "Entertainment Website",
      description: "Modern website for event management company",
      image: portfolioWebDesign
    },
    {
      category: "Graphic Design",
      title: "Brand Identity",
      description: "Complete branding package for music artist",
      image: portfolioBrandIdentity
    },
    {
      category: "Video Production",
      title: "Music Video",
      description: "Professional music video production and editing",
      image: portfolioVideoProduction
    },
    {
      category: "Print Design",
      title: "Event Flyers",
      description: "Eye-catching promotional materials",
      image: portfolioPrintDesign
    },
    {
      category: "Digital Marketing",
      title: "Social Media Campaign",
      description: "Successful online promotion strategy",
      image: portfolioDigitalMarketing
    },
    {
      category: "Logo Design",
      title: "Corporate Branding",
      description: "Professional logo and brand guidelines",
      image: portfolioLogoDesign
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        backgroundImage="/images/hero-creative.jpg"
        headline="Design, Promotion, Print and Web"
        subheadline="Full creative stack for brands and artists. From concept to execution, we bring your vision to life."
      />

      {/* Services Overview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Creative Services</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive creative solutions for modern businesses and artists
            </p>
          </div>
          
          {servicesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-48 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creativeServices.map((service, index) => {
                const fallbackImages = [
                  portfolioWebDesign,
                  portfolioBrandIdentity,
                  portfolioVideoProduction,
                  portfolioPrintDesign,
                  portfolioDigitalMarketing,
                  portfolioLogoDesign,
                ];
                const displayImage = service.image || fallbackImages[index % fallbackImages.length];
                return (
                  <Card key={service.id || index} className="group hover:shadow-brand transition-all duration-300">
                    {displayImage && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={displayImage}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Services Showcase with Company Flyer */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Full Service Range</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We provide 24/7 service availability for all your creative and promotional needs. 
                From initial concept to final delivery, our team ensures quality and professionalism 
                at every step.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span>Available 24 hours for urgent projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-secondary rounded-full"></div>
                  <span>Professional quality guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-accent rounded-full"></div>
                  <span>Competitive pricing for all services</span>
                </div>
              </div>
              
              <Button variant="hero" size="lg">
                View Our Work
              </Button>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/3931db77-5e3e-47bc-aebb-1b0fb9113a3f.png" 
                alt="Soundzy World Global Services"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Portfolio</h2>
            <p className="text-lg text-muted-foreground">
              Showcasing our latest creative projects and successful campaigns
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="group hover:shadow-brand transition-all duration-300 overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={`${item.title} - ${item.description}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3">
                    {item.category}
                  </Badge>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Blog & Insights</h2>
            <p className="text-lg text-muted-foreground">
              Latest trends and tips in creative design and digital marketing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                slug: 'modern-logo-design-trends-2024',
                category: 'Design Tips',
                title: 'Modern Logo Design Trends 2024',
                excerpt: 'Discover the latest trends shaping logo design this year and how to apply them to your brand.',
                image: portfolioLogoDesign,
              },
              {
                slug: 'social-media-strategy-for-musicians',
                category: 'Marketing',
                title: 'Social Media Strategy for Musicians',
                excerpt: 'Essential tips for building your online presence and growing your fanbase organically.',
                image: portfolioDigitalMarketing,
              },
              {
                slug: 'mobile-first-design-principles',
                category: 'Web Design',
                title: 'Mobile-First Design Principles',
                excerpt: 'Why mobile-first approach is crucial for modern website design and user experience.',
                image: portfolioWebDesign,
              },
            ].map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group hover:shadow-brand transition-all duration-300">
                <Card className="overflow-hidden">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3">{post.category}</Badge>
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>5–7 min read</span>
                      <span>•</span>
                      <span>{post.category}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Creative Project</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ready to bring your vision to life? Let's discuss your creative needs and 
            create something amazing together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="whatsapp" size="xl" asChild>
              <a 
                href="https://wa.me/2348166687167" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Start Project on WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="mailto:soundzybeatz@gmail.com">
                Email Project Brief
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}