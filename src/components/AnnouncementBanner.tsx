import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  media_type: string;
  media_url: string | null;
  pinned: boolean;
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAnnouncements();
    
    const channel = supabase
      .channel('announcements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        loadAnnouncements();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 'published')
      .order('pinned', { ascending: false })
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(3);

    if (data) {
      setAnnouncements(data);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const toggleMute = (id: string) => {
    setMuted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-primary text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const visibleAnnouncements = announcements.filter(a => !dismissed.has(a.id));

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {visibleAnnouncements.map((announcement) => (
        <Card key={announcement.id} className={`${getPriorityColor(announcement.priority)} p-4 relative`}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{announcement.title}</h3>
              <p className="text-sm mb-3">{announcement.content}</p>
              
              {announcement.media_type === 'image' && announcement.media_url && (
                <img 
                  src={announcement.media_url} 
                  alt={announcement.title}
                  className="rounded-lg max-h-64 object-cover w-full"
                />
              )}
              
              {announcement.media_type === 'video' && announcement.media_url && (
                <video 
                  src={announcement.media_url} 
                  controls
                  className="rounded-lg max-h-64 w-full"
                  muted={muted.has(announcement.id)}
                />
              )}
              
              {announcement.media_type === 'audio' && announcement.media_url && (
                <div className="flex items-center gap-2">
                  <audio 
                    src={announcement.media_url} 
                    controls
                    className="flex-1"
                    muted={muted.has(announcement.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMute(announcement.id)}
                  >
                    {muted.has(announcement.id) ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
            
            {!announcement.pinned && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(announcement.id)}
                className="hover:bg-background/20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
