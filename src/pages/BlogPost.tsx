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
    author: 'Amaka Okonkwo',
    publishedAt: '2025-09-10',
    image: portfolioLogoDesign,
    body: `From responsive identities to motion-first brand systems, 2024 is the year logos become living assets. Brands are embracing variable logos that adapt across platforms, bold geometry for instant recognition, and ultra-clean typographic marks that scale beautifully from favicons to billboards.\n\nWhy it matters:\n- Responsive logos ensure clarity on every screen size\n- High-contrast shapes and smart negative space improve accessibility\n- Motion adds personality and recall across social and video\n\nHow to apply it to your brand:\n1) Start with a simple core mark that works in one color\n2) Build a flexible system (stacked, horizontal, icon-only)\n3) Document usage in a lightweight style guide\n\nAt Soundzy World Global, we craft identities that perform in the real world — from Instagram to event screens. Want a quick audit of your current logo? Chat with us on WhatsApp for a free consultation.`,
  },
  {
    slug: 'social-media-strategy-for-musicians',
    title: 'Social Media Strategy for Musicians',
    category: 'Marketing',
    author: 'Tunde Adebayo',
    publishedAt: '2025-09-09',
    image: portfolioDigitalMarketing,
    body: `Make your music discoverable with a consistent, story-led content plan. The winning formula in 2025 blends authenticity with structure: behind-the-scenes clips, live performance snippets, fan duets, and strategic collaborations.\n\nWeekly cadence idea:\n- Mon: Studio vlog (60–90s)\n- Wed: Chorus snippet with captions\n- Fri: Collab or duet with related artist\n- Sun: Live session highlight + CTA to WhatsApp for bookings\n\nPro tips:\n- Use hook-first captions and on-screen text\n- Batch content on a single day to stay consistent\n- Capture vertical video at 4K for repurposing across platforms\n\nNeed help building a release plan? Our team can manage your content calendar and growth.`,
  },
  {
    slug: 'mobile-first-design-principles',
    title: 'Mobile-First Design Principles',
    category: 'Web Design',
    author: 'Chidera Nwosu',
    publishedAt: '2025-09-08',
    image: portfolioWebDesign,
    body: `Designing mobile-first forces clarity. By prioritising small screens, your layout stays focused, fast, and conversion-oriented. Start with a single column, generous spacing, and a clear hierarchy — then progressively enhance for tablet and desktop.\n\nBest practices:\n- Use a 4–8px spacing scale and fluid typography\n- Optimise images with modern formats and lazy loading\n- Keep primary CTAs sticky on mobile where appropriate\n\nWe build sites that feel premium and perform flawlessly, with analytics and SEO baked in from day one.`,
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
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-6">
              <span>{post.category}</span>
              {post.author && <><span>•</span><span>By {post.author}</span></>}
              {post.publishedAt && <><span>•</span><span>{new Date(post.publishedAt).toLocaleDateString()}</span></>}
              <span>•</span>
              <span>5–7 min read</span>
            </div>
            <div className="prose prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
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
