import { HeroSection } from "@/components/HeroSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Speaker, Mic, Lightbulb, Settings, Headphones, Monitor } from "lucide-react";

export default function Shop() {
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
      image: "/api/placeholder/300/200",
      category: "Speakers",
      inStock: true,
      features: ["2000W Power", "Wireless Connectivity", "Built-in Mixer"]
    },
    {
      name: "Wireless Microphone Set",
      price: "₦85,000",
      originalPrice: null,
      image: "/api/placeholder/300/200", 
      category: "Microphones",
      inStock: true,
      features: ["UHF Technology", "100m Range", "Dual Channel"]
    },
    {
      name: "LED Stage Light Kit",
      price: "₦120,000",
      originalPrice: "₦150,000",
      image: "/api/placeholder/300/200",
      category: "Lighting",
      inStock: false,
      features: ["RGB Colors", "DMX Control", "Sound Active"]
    },
    {
      name: "DJ Controller Pro",
      price: "₦280,000",
      originalPrice: null,
      image: "/api/placeholder/300/200",
      category: "DJ Equipment",
      inStock: true,
      features: ["4-Channel", "Touch Strips", "Built-in Interface"]
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        backgroundImage="/images/hero-shop.jpg"
        headline="Buy Pro Audio and Stage Gear"
        subheadline="Speakers. Mixers. Lights. Full installs available. Premium equipment for professionals and enthusiasts."
      />

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground">
              Find the perfect equipment for your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="group hover:shadow-brand transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="h-12 w-12 mb-4 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{category.description}</p>
                    <Badge variant="outline">{category.count}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Products</h2>
            <p className="text-lg text-muted-foreground">
              Hand-picked equipment from top brands
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card key={index} className="group hover:shadow-brand transition-all duration-300">
                <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  <span className="text-muted-foreground">Product Image</span>
                  {product.originalPrice && (
                    <Badge variant="destructive" className="absolute top-2 left-2">
                      Sale
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="outline" className="absolute top-2 right-2 bg-background">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2 text-xs">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-primary">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-1 w-1 bg-primary rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant={product.inStock ? "default" : "outline"} 
                    size="sm" 
                    className="w-full"
                    disabled={!product.inStock}
                  >
                    {product.inStock ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    ) : (
                      "Notify When Available"
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
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <span>System design and consultation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Speaker className="h-4 w-4 text-secondary" />
                  </div>
                  <span>Professional installation and calibration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <Headphones className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <span>Training and ongoing support</span>
                </div>
              </div>
              
              <Button variant="hero" size="lg">
                Request Installation Quote
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
                  <p className="text-muted-foreground">
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
                  <p className="text-muted-foreground">
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
                  <p className="text-muted-foreground">
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
                <div className="h-12 w-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Flexible Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Cash, bank transfer, and installment options available
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Settings className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Technical Support</h3>
                <p className="text-sm text-muted-foreground">
                  Ongoing maintenance and technical assistance
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Warranty Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive warranty on all equipment sales
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="whatsapp" size="xl" asChild>
              <a 
                href="https://wa.me/2348166687167" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Shop via WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="mailto:soundzybeatz@gmail.com">
                Request Quote
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}