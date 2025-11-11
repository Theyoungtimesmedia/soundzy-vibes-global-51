import { HeroSection } from "@/components/HeroSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Globe, Megaphone, Film, Printer, Camera } from "lucide-react";
import { useServices } from '@/hooks/useServices';
import { Link } from 'react-router-dom';
import heroCreative from "@/assets/hero-creative-premium.jpg";

// Portfolio images
import portfolioWebDesign from "@/assets/portfolio-web-design.jpg";
import portfolioBrandIdentity from "@/assets/portfolio-brand-identity.jpg";
import portfolioVideoProduction from "@/assets/portfolio-video-production.jpg";
import portfolioPrintDesign from "@/assets/portfolio-print-design.jpg";
import portfolioDigitalMarketing from "@/assets/portfolio-digital-marketing.jpg";
import portfolioLogoDesign from "@/assets/portfolio-logo-design.jpg";

// Service images
import serviceGraphicDesign from "@/assets/service-graphic-design.jpg";
import serviceWebDevelopment from "@/assets/service-web-development.jpg";
import serviceBrandIdentity from "@/assets/service-brand-identity.jpg";
import serviceVideoProduction from "@/assets/service-video-production.jpg";
import serviceDigitalMarketing from "@/assets/service-digital-marketing.jpg";
import servicePrintDesign from "@/assets/service-print-design.jpg";

// Professional service images
import serviceLogoDesign from "@/assets/service-logo-design.jpg";
import serviceBrandIdentityPro from "@/assets/service-brand-identity-pro.jpg";
import serviceWebDesignPro from "@/assets/service-web-design-pro.jpg";
import servicePrintDesignPro from "@/assets/service-print-design-pro.jpg";
import serviceDigitalMarketingPro from "@/assets/service-digital-marketing-pro.jpg";
import serviceVideoProductionPro from "@/assets/service-video-production-pro.jpg";

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
        backgroundImage={heroCreative}
        preHeadline="Creative"
        headline="DESIGN SOLUTIONS AND GENERAL SERVICES"
        subheadline="Professional Graphics & Logo Design | Port Harcourt & Online Worldwide"
      />

      {/* Services Overview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Creative Services - Port Harcourt & Online</h2>
            <p className="text-lg text-muted-foreground">
              Professional graphics design, logo design, and creative solutions available remotely. Based in Port Harcourt, serving clients worldwide.
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
                // Enhanced service-specific images and pricing
                const getServiceImageAndPrice = (title: string, index: number) => {
                  const titleLower = title.toLowerCase();
                  
                  // Service-specific configurations
                  const serviceConfigs = {
                    'logo_design': { image: serviceLogoDesign, basePrice: 30000 },
                    'graphic_design': { image: serviceGraphicDesign, basePrice: 25000 },
                    'web_development': { image: serviceWebDesignPro, basePrice: 150000 },
                    'web_design': { image: serviceWebDesignPro, basePrice: 150000 },
                    'brand_identity': { image: serviceBrandIdentityPro, basePrice: 75000 },
                    'video_production': { image: serviceVideoProductionPro, basePrice: 200000 },
                    'digital_marketing': { image: serviceDigitalMarketingPro, basePrice: 45000 },
                    'print_design': { image: servicePrintDesignPro, basePrice: 15000 }
                  };
                  
                  // Match service type
                  let config;
                  if (titleLower.includes('logo')) {
                    config = serviceConfigs.logo_design;
                  } else if (titleLower.includes('graphic') || titleLower.includes('design')) {
                    config = serviceConfigs.graphic_design;
                  } else if (titleLower.includes('web')) {
                    config = serviceConfigs.web_design;
                  } else if (titleLower.includes('brand') || titleLower.includes('identity')) {
                    config = serviceConfigs.brand_identity;
                  } else if (titleLower.includes('video') || titleLower.includes('production')) {
                    config = serviceConfigs.video_production;
                  } else if (titleLower.includes('marketing') || titleLower.includes('digital')) {
                    config = serviceConfigs.digital_marketing;
                  } else if (titleLower.includes('print')) {
                    config = serviceConfigs.print_design;
                  } else {
                    // Default configurations for other services
                    const fallbackConfigs = [
                      { image: portfolioWebDesign, basePrice: 50000 },
                      { image: portfolioBrandIdentity, basePrice: 80000 },
                      { image: portfolioVideoProduction, basePrice: 120000 },
                      { image: portfolioPrintDesign, basePrice: 20000 },
                      { image: portfolioDigitalMarketing, basePrice: 35000 },
                      { image: portfolioLogoDesign, basePrice: 40000 },
                    ];
                    config = fallbackConfigs[index % fallbackConfigs.length];
                  }
                  
                  return config;
                };
                
                const serviceConfig = getServiceImageAndPrice(service.title, index);
                const displayImage = service.image || serviceConfig.image;
                
                // Dynamic pricing with market adjustments (simulating real-time pricing)
                const marketMultiplier = 0.8 + (Math.sin(Date.now() / 86400000 + index) * 0.4); // Daily variation
                const adjustedPrice = Math.round(serviceConfig.basePrice * marketMultiplier);
                
                return (
                  <Card key={service.id || index} className="group hover:shadow-brand transition-all duration-300">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={displayImage}
                        alt={`${service.title} - Professional service by Soundzy World Global`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {service.title}
                        <div className="flex flex-col items-end">
                          <Badge variant="outline" className="text-xs mb-1">
                            From ₦{adjustedPrice.toLocaleString('en-NG')}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Negotiable
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-white/90">{service.description}</p>
                      <div className="flex gap-2">
                        <Button 
                          variant="cta" 
                          size="sm" 
                          className="flex-1"
                          asChild
                        >
                          <a
                            href={`https://wa.me/2348166687167?text=Hi! I'm interested in ${service.title} services. Can you provide more details and pricing?`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <img src="/assets/icons/whatsapp-alt.png" alt="WhatsApp" className="w-4 h-4" />
                            Get Quote
                          </a>
                        </Button>
                        <Button variant="premium" size="sm" asChild>
                          <a href={`mailto:soundzybeatz@gmail.com?subject=Inquiry about ${service.title}&body=Hi, I'm interested in your ${service.title} services. Please provide more information.`} className="text-white">
                            Email
                          </a>
                        </Button>
                      </div>
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
                  <span className="text-white/90">Available 24 hours for urgent projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-secondary rounded-full"></div>
                  <span className="text-white/90">Professional quality guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-accent rounded-full"></div>
                  <span className="text-white/90">Competitive pricing for all services</span>
                </div>
              </div>
              
              <Button variant="hero" size="lg">
                View Our Work
              </Button>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="/assets/images/services-banner.png" 
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
          <p className="text-lg text-white/80 mb-8">
            Ready to bring your vision to life? Let's discuss your creative needs and 
            create something amazing together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="whatsapp" size="xl" asChild>
              <a 
                href="https://wa.me/2348166687167?text=Hi! I'd like to start a creative project with Soundzy World Global." 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Start Project on WhatsApp
              </a>
            </Button>
            <Button variant="premium" size="xl" asChild>
              <a href="mailto:soundzybeatz@gmail.com?subject=Creative Project Brief&body=Hi, I'd like to discuss a creative project." className="text-white">
                Email Project Brief
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}