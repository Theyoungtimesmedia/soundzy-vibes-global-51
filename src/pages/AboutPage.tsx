import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Award, Shield, FileText, MessageCircle } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  const stats = [
    { value: '500+', label: 'Events' },
    { value: '50K+', label: 'Fans' },
    { value: '7+', label: 'Years' },
    { value: '⭐', label: 'Top Rated' },
  ];

  const services = ['Wedding DJ', 'Corporate Events', 'Club Nights', 'MC / Hype Man', 'Sound Engineering', 'Graphics Design', 'Equipment Rental'];

  const certs = [
    { icon: '🎬', label: 'Nollywood Work Permit' },
    { icon: '🏆', label: 'Professional Membership' },
    { icon: '📋', label: 'CAC Business Registration' },
    { icon: '🛡️', label: 'Entertainment License' },
  ];

  return (
    <div className="pb-28">
      {/* Header image placeholder */}
      <div className="relative h-[200px] bg-gradient-to-b from-card to-background">
        <button onClick={() => navigate('/profile')} className="absolute top-4 left-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-lg flex items-center justify-center tap-target">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Avatar overlay */}
      <div className="px-4 -mt-12 relative z-10">
        <div
          className="h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4"
          style={{ background: 'var(--gradient-primary)', border: '4px solid hsl(47 93% 54%)', boxShadow: 'var(--shadow-glow)' }}
        >
          DJ
        </div>

        <h1 className="text-2xl font-bold mb-0.5">DJ Soundzy</h1>
        <p className="text-base text-primary italic mb-1">aka Odogwu Na Vibes</p>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-6"><MapPin className="h-4 w-4" /> Port Harcourt, Nigeria</p>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {stats.map(s => (
            <div key={s.label} className="card-premium p-3 text-center">
              <p className="text-xl font-bold text-primary">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm text-foreground/90 leading-relaxed mb-6">
          With over 7 years of experience in the entertainment industry, DJ Soundzy has delivered electrifying performances at over 500 events across Nigeria. From high-energy club nights to elegant wedding receptions, every event gets the premium Soundzy treatment.
        </p>

        {/* Services */}
        <h3 className="text-base font-bold mb-3">What I Do</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {services.map(s => (
            <Badge key={s} className="bg-primary/10 text-primary text-xs px-3 py-1.5">{s}</Badge>
          ))}
        </div>

        {/* Certifications */}
        <h3 className="text-base font-bold mb-3">Verified & Licensed</h3>
        <div className="grid grid-cols-2 gap-2 mb-8">
          {certs.map(c => (
            <div key={c.label} className="card-premium p-3 flex items-center gap-2">
              <span className="text-xl">{c.icon}</span>
              <span className="text-xs font-medium text-foreground">{c.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Button onClick={() => navigate('/book')} className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-full text-sm uppercase tracking-wide">
            Book Now
          </Button>
          <Button asChild variant="outline" className="w-full h-14 rounded-full text-sm font-bold" style={{ border: '1.5px solid hsl(47 93% 54% / 0.3)', color: 'hsl(47 93% 54%)' }}>
            <a href="https://wa.me/2348166687167" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" /> WhatsApp DJ Soundzy
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
