import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Volume2, Video, Image as ImageIcon, FileText } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  pinned: boolean;
  media_type: string | null;
  media_url: string | null;
  created_at: string;
}

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadAnnouncement();
  }, []);

  const loadAnnouncement = async () => {
    const dismissedId = sessionStorage.getItem('dismissed-announcement');
    
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 'published')
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return;
    
    if (dismissedId === data.id) {
      setDismissed(true);
      return;
    }

    setAnnouncement(data);
  };

  const handleDismiss = () => {
    if (announcement) {
      sessionStorage.setItem('dismissed-announcement', announcement.id);
      setDismissed(true);
    }
  };

  if (!announcement || dismissed) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      default: return 'secondary';
    }
  };

  const renderMedia = () => {
    if (!announcement.media_url || !announcement.media_type) return null;

    switch (announcement.media_type) {
      case 'image':
        return (
          <div className="mt-4">
            <img
              src={announcement.media_url}
              alt={announcement.title}
              className="max-w-full h-auto rounded-lg max-h-96 object-cover"
            />
          </div>
        );
      case 'audio':
        return (
          <div className="mt-4">
            <audio controls className="w-full">
              <source src={announcement.media_url} />
              Your browser does not support audio playback.
            </audio>
          </div>
        );
      case 'video':
        return (
          <div className="mt-4 aspect-video">
            <video controls className="w-full h-full rounded-lg">
              <source src={announcement.media_url} />
              Your browser does not support video playback.
            </video>
          </div>
        );
      default:
        return null;
    }
  };

  const getIcon = () => {
    if (!announcement.media_type) return <FileText className="h-5 w-5" />;
    
    switch (announcement.media_type) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'audio': return <Volume2 className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-full px-4 py-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
      <Card className="max-w-7xl mx-auto border-2 border-primary/30">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-primary">
                  {getIcon()}
                </div>
                <Badge variant={getPriorityColor(announcement.priority)}>
                  {announcement.type}
                </Badge>
                {announcement.pinned && (
                  <Badge variant="outline">📌 Pinned</Badge>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{announcement.title}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
              
              {renderMedia()}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
