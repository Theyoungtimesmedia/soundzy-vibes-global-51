import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import portfolioLogoDesign from '@/assets/portfolio-logo-design.jpg';
import portfolioDigitalMarketing from '@/assets/portfolio-digital-marketing.jpg';
import portfolioWebDesign from '@/assets/portfolio-web-design.jpg';

const posts = [
  {
    slug: 'modern-logo-design-trends-2024',
    title: 'Modern Logo Design Trends 2024',
    category: 'Design Tips',
    image: portfolioLogoDesign,
    body: `Discover the latest logo trends driving brand impact in 2024. From variable logos to minimal geometry and motion-first identities, we break down what works and how to apply it.\n\nKey takeaways:\n- Keep it simple and scalable\n- Prioritize contrast and accessibility\n- Design with motion in mind\n\nLooking to refresh your brand? Chat with us on WhatsApp for a free consultation.`,
  },
  {
    slug: 'social-media-strategy-for-musicians',
    title: 'Social Media Strategy for Musicians',
    category: 'Marketing',
    image: portfolioDigitalMarketing,
    body: `Build an audience with content that resonates. Consistency, storytelling, and cross-platform engagement are your allies. We'll show you how to plan a weekly content cadence that actually grows fans.`,
  },
  {
    slug: 'mobile-first-design-principles',
    title: 'Mobile-First Design Principles',
    category: 'Web Design',
    image: portfolioWebDesign,
    body: `Design for the smallest screen first to ensure focus and speed. We'll cover spacing, type scales, and performance patterns that translate beautifully to desktop.`,
  },
];

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="min-h-screen py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </main>
    );
  }

  const whatsappUrl = `https://wa.me/2348166687167?text=${encodeURIComponent(`Hi, I read "${post.title}" — I'd like more info / a quote.`)}`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://soundzy.lovable.app/blog/${post.slug}`;

  return (
    <main className="min-h-screen">
      <article className="relative">
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-3xl mx-auto px-4 -mt-12">
          <div className="bg-background rounded-lg shadow-xl p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{post.title}</h1>
            <p className="text-sm text-muted-foreground mb-6">{post.category} • 5–7 min read</p>
            <div className="prose prose-invert max-w-none text-foreground whitespace-pre-wrap">
              {post.body}
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button variant="whatsapp" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
              </Button>
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy Link</Button>
              <Button variant="outline" asChild>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">Share on Facebook</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer">Share on X</a>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <section className="max-w-3xl mx-auto px-4 mt-12">
        <h2 className="text-xl font-semibold mb-4">Other stories</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {posts.filter((p) => p.slug !== post.slug).slice(0,3).map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group">
              <Card className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
