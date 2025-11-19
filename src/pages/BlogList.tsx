import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import portfolioLogoDesign from '@/assets/portfolio-logo-design.jpg';
import portfolioDigitalMarketing from '@/assets/portfolio-digital-marketing.jpg';
import portfolioWebDesign from '@/assets/portfolio-web-design.jpg';

const posts = [
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
];

export default function BlogList() {
  return (
    <main className="min-h-screen py-20 px-4 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-semibold">
            📖 Our Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Insights & Stories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert tips, industry trends, and creative inspiration from the Soundzy World Global team
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
              <Card className="overflow-hidden h-full hover:shadow-brand transition-all duration-300 border-2 hover:border-primary/50">
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy" 
                  />
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
