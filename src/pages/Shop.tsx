import { HeroSection } from "@/components/HeroSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Speaker, Mic, Lightbulb, Settings, Headphones, Monitor, MessageCircle } from "lucide-react";
import { useServices } from '@/hooks/useServices';
import heroShop from "@/assets/hero-shop-premium.jpg";
import paSystemImage from "@/assets/pa-system.jpg";
import wirelessMicImage from "@/assets/wireless-mic-set.jpg";
import ledLightsImage from "@/assets/led-stage-lights.jpg";
import djControllerImage from "@/assets/dj-controller.jpg";
import studioEquipmentImage from "@/assets/studio-equipment.jpg";

export default function Shop() {
  const { services: shopServices, loading: servicesLoading } = useServices('shop_services');
  
  const categories = [
    {
      icon: Speaker,
      title: "Professional Speakers",
      description: "High-quality PA systems and monitors",
      count: "25+ products"
    },
    {
      icon: Mic,
      title: "Microphones & Audio",
      description: "Wireless and wired microphone systems",
      count: "40+ products"
    },
    {
      icon: Lightbulb,
      title: "Stage Lighting",
      description: "LED lights, spots, and effects",
      count: "30+ products"
    },
    {
      icon: Settings,
      title: "Mixing & DJ Equipment",
      description: "Mixers, controllers, and DJ gear",
      count: "35+ products"
    },
    {
      icon: Headphones,
      title: "Studio Equipment",
      description: "Recording and production gear",
      count: "20+ products"
    },
    {
      icon: Monitor,
      title: "Installation Services",
      description: "Complete system setup and installation",
      count: "Full service"
    }
  ];

  const featuredProducts = [
    {
      name: "Professional PA System",
      price: "₦450,000",
      originalPrice: "₦500,000",
      image: paSystemImage,
      category: "Speakers",
      inStock: true,
      features: ["2000W Power", "Wireless Connectivity", "Built-in Mixer"]
    },
    {
      name: "Wireless Microphone Set",
      price: "₦85,000",
      originalPrice: null,
      image: wirelessMicImage, 
      category: "Microphones",
      inStock: true,
      features: ["UHF Technology", "100m Range", "Dual Channel"]
    },
    {
      name: "LED Stage Light Kit",
      price: "₦120,000",
      originalPrice: "₦150,000",
      image: ledLightsImage,
      category: "Lighting",
      inStock: false,
      features: ["RGB Colors", "DMX Control", "Sound Active"]
    },
    {
      name: "DJ Controller Pro",
      price: "₦280,000",
      originalPrice: null,
      image: djControllerImage,
      category: "DJ Equipment",
      inStock: true,
      features: ["4-Channel", "Touch Strips", "Built-in Interface"]
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        backgroundImage={heroShop}
        preHeadline="Shop"
        headline="PREMIUM GEAR"
        subheadline="Professional Audio Equipment & Sound Solutions"
      />

      {/* Categories */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Shop by Category</h2>
            <p className="text-lg text-muted-foreground font-light">
              Find the perfect equipment for your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const title = category.title.toLowerCase();
              let catImage = djControllerImage;
              if (title.includes('light')) catImage = ledLightsImage;
              else if (title.includes('mic')) catImage = wirelessMicImage;
              else if (title.includes('speaker') || title.includes('sound')) catImage = paSystemImage;
              else if (title.includes('dj') || title.includes('mix')) catImage = djControllerImage;
              return (
                <Card key={index} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-border/50">
                  <div className="aspect-video overflow-hidden">
                    <img src={catImage} alt={category.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                  <CardHeader className="p-6">
                    <div className="h-12 w-12 mb-4 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Icon className="h-6 w-6 text-primary group-hover:text-black transition-colors" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors text-lg">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <p className="text-white/90 mb-2 text-sm">{category.description}</p>
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">{category.count}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Services Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From equipment rental to complete event solutions, we've got you covered
              </p>
            </div>
            
            {servicesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted h-48 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {shopServices.map((service, index) => {
                   const title = (service.title || '').toLowerCase();
                   let displayImage = djControllerImage;
                   if (title.includes('light')) displayImage = ledLightsImage;
                   else if (title.includes('mic')) displayImage = wirelessMicImage;
                   else if (title.includes('microphone')) displayImage = wirelessMicImage;
                   else if (title.includes('speaker') || title.includes('sound')) displayImage = paSystemImage;
                   else if (title.includes('dj') || title.includes('mix')) displayImage = djControllerImage;
                   else if (title.includes('studio') || title.includes('recording') || title.includes('production')) displayImage = studioEquipmentImage;
                   const img = service.image || displayImage;
                  return (
                    <Card key={service.id || index} className="text-center hover:shadow-lg transition-shadow">
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={img}
                          alt={service.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle>{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/90">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Featured Products</h2>
            <p className="text-lg text-muted-foreground font-light">
              Hand-picked equipment from top brands
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card key={index} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/50 overflow-hidden">
                <div className="aspect-square bg-muted/30 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.originalPrice && (
                    <Badge className="absolute top-3 left-3 bg-destructive text-white">
                      Sale
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="outline" className="absolute top-3 right-3 bg-background">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3 text-xs border-primary/30">
                    {product.category}
                  </Badge>
                  <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-black text-primary">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                    disabled={!product.inStock}
                    asChild={product.inStock}
                  >
                    {product.inStock ? (
                      <a 
                        href={`https://wa.me/2348166687167?text=Hi! I'm interested in the ${product.name} (${product.price}). Please provide more details.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Buy Now
                      </a>
                    ) : (
                      "Notify Me"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Services */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Professional Installation Services</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Don't just buy equipment – get it properly installed by our certified technicians. 
                We offer complete system design, installation, and ongoing support to ensure your 
                investment delivers maximum performance.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-white/90">System design and consultation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Speaker className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-white/90">Professional installation and calibration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-accent/20 rounded-full flex items-center justify-center">
                    <Headphones className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <span className="text-white/90">Training and ongoing support</span>
                </div>
              </div>
              
              <Button variant="hero" size="lg" asChild>
                <a 
                  href="https://wa.me/2348166687167?text=Hi! I'd like to request an installation quote." 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Request Installation Quote
                </a>
              </Button>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Venue Sound Systems
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90">
                    Complete audio solutions for restaurants, clubs, and event venues
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Recording Studios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90">
                    Professional studio setup with acoustic treatment and monitoring
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Stage & Lighting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90">
                    Complete stage lighting design and installation services
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Payment & Support */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Easy Shopping & Support</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Flexible payment options and comprehensive support for all your equipment needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Flexible Payment</h3>
                <p className="text-sm text-white/90">
                  Cash, bank transfer, and installment options available
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Settings className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Technical Support</h3>
                <p className="text-sm text-white/90">
                  Ongoing maintenance and technical assistance
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Warranty Coverage</h3>
                <p className="text-sm text-white/90">
                  Comprehensive warranty on all equipment sales
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="whatsapp" size="xl" asChild>
              <a 
                href="https://wa.me/2348166687167?text=Hi! I'd like to shop for equipment." 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Shop via WhatsApp
              </a>
            </Button>
            <Button variant="premium" size="xl" asChild>
              <a href="mailto:soundzybeatz@gmail.com?subject=Equipment Quote Request&body=Hi, I'd like to request a quote for equipment." className="text-white">
                Request Quote
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}