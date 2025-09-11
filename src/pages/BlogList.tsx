import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">Blog</h1>
          <p className="text-muted-foreground">Insights, tips, and stories from Soundzy World Global</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group hover:shadow-brand transition-all duration-300">
              <Card className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <CardContent className="p-6">
                  <span className="text-xs uppercase text-muted-foreground">{post.category}</span>
                  <h3 className="font-semibold mb-2 mt-1">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
