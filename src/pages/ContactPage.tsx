import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();

  const contacts = [
    { icon: MessageCircle, label: 'WhatsApp', value: '+234 816 668 7167', href: 'https://wa.me/2348166687167', color: 'hsl(142 70% 45%)' },
    { icon: Phone, label: 'Phone', value: '+234 816 668 7167', href: 'tel:+2348166687167', color: 'hsl(47 93% 54%)' },
    { icon: Mail, label: 'Email', value: 'info@soundzyworldglobal.com', href: 'mailto:info@soundzyworldglobal.com', color: 'hsl(200 80% 55%)' },
    { icon: MapPin, label: 'Location', value: 'Port Harcourt, Nigeria', href: '#', color: 'hsl(0 84% 60%)' },
  ];

  return (
    <div className="px-4 py-6 pb-28">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/profile')} className="tap-target flex items-center justify-center">
          <ArrowLeft className="h-6 w-6 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-bold">Contact & Support</h1>
      </div>

      <div className="text-center mb-8">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-lg font-bold mb-1">Get in Touch</h2>
        <p className="text-sm text-muted-foreground">We're here to help with bookings, orders, and support</p>
      </div>

      <div className="space-y-3 mb-8">
        {contacts.map(c => {
          const Icon = c.icon;
          return (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 card-premium tap-target"
            >
              <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: `${c.color}15` }}>
                <Icon className="h-6 w-6" style={{ color: c.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.value}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground/30" />
            </a>
          );
        })}
      </div>

      <Button asChild className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-full text-sm uppercase tracking-wide">
        <a href="https://wa.me/2348166687167" target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-5 w-5 mr-2" /> Message on WhatsApp
        </a>
      </Button>
    </div>
  );
}
