import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/stores/useAppStore';
import { ArrowLeft, Image, MapPin, Loader2, X } from 'lucide-react';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const guest = useAppStore((s) => s.guest);

  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    const displayName = user?.user_metadata?.full_name || guest.guestName || 'Anonymous';
    const isGuest = !user;

    let mediaUrls: string[] = [];
    if (mediaFile) {
      const ext = mediaFile.name.split('.').pop();
      const path = `${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('post-media').upload(path, mediaFile);
      if (!error) {
        const { data: urlData } = supabase.storage.from('post-media').getPublicUrl(path);
        mediaUrls = [urlData.publicUrl];
      }
    }

    const { error } = await supabase.from('posts').insert({
      user_id: user?.id || null,
      display_name: displayName,
      is_guest: isGuest,
      content: content.trim(),
      media_urls: mediaUrls,
      location: location || null,
    });

    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    navigate('/');
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="tap-target"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-lg font-bold flex-1">Share Your Vibes</h1>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          size="sm"
          className="h-9 bg-primary text-primary-foreground font-bold rounded-xl"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post 🎧'}
        </Button>
      </div>

      {guest.guestName && !guest.guestId && null}
      {guest.guestName && (
        <div className="text-xs text-muted-foreground mb-3">Posting as <span className="text-secondary font-bold">{guest.guestName}</span></div>
      )}

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your vibes from the event..."
        className="min-h-[120px] rounded-xl bg-card border-border text-sm resize-none mb-4"
        maxLength={1000}
      />

      {mediaPreview && (
        <div className="relative mb-4">
          <img src={mediaPreview} alt="" className="w-full rounded-xl max-h-60 object-cover" />
          <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} className="absolute top-2 right-2 bg-background/80 rounded-full p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors tap-target">
          <Image className="h-4 w-4" />
          Photo
          <input type="file" accept="image/*,video/*" onChange={handleMedia} className="hidden" />
        </label>
        <button
          onClick={() => setShowLocation(!showLocation)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs transition-colors tap-target ${showLocation ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-card border-border text-muted-foreground'}`}
        >
          <MapPin className="h-4 w-4" />
          Location
        </button>
      </div>

      {showLocation && (
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="📍 Port Harcourt"
          className="mt-3 h-10 rounded-xl bg-card border-border text-sm"
        />
      )}
    </div>
  );
}
