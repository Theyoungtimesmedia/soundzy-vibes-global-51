import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Video, Link, Upload, Trash2, Edit, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoEmbed {
  id: string;
  title: string;
  description: string | null;
  video_type: 'youtube' | 'facebook' | 'tiktok' | 'upload';
  video_url: string;
  thumbnail_url: string | null;
  duration: number | null;
  status: string;
  created_at: string;
}

export function VideoManager() {
  const [videos, setVideos] = useState<VideoEmbed[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoEmbed | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    video_type: 'youtube' | 'facebook' | 'tiktok' | 'upload';
    video_url: string;
    thumbnail_url: string;
  }>({
    title: '',
    description: '',
    video_type: 'youtube',
    video_url: '',
    thumbnail_url: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const { data, error } = await supabase
      .from('video_embeds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading videos",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setVideos((data || []) as VideoEmbed[]);
  };

  const parseVideoUrl = (url: string, type: string) => {
    let embedUrl = url;

    if (type === 'youtube') {
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (youtubeMatch) {
        embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }
    } else if (type === 'facebook') {
      embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
    } else if (type === 'tiktok') {
      const tiktokMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
      if (tiktokMatch) {
        embedUrl = `https://www.tiktok.com/embed/${tiktokMatch[1]}`;
      }
    }

    return embedUrl;
  };

  const generateAILayout = async (videoData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-ui-layout', {
        body: { 
          contentType: 'video',
          contentData: videoData
        }
      });

      if (error) throw error;
      return data.uiVariant;
    } catch (error) {
      console.error('Error generating AI layout:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const embedUrl = parseVideoUrl(formData.video_url, formData.video_type);

    const videoData: any = {
      title: formData.title,
      description: formData.description || null,
      video_type: formData.video_type,
      video_url: embedUrl,
      thumbnail_url: formData.thumbnail_url || null,
      status: 'active',
    };

    try {
      // Generate AI layout
      const aiLayout = await generateAILayout(videoData);
      if (aiLayout) {
        videoData.ui_variant = aiLayout;
      }

      if (editingVideo) {
        const { error } = await supabase
          .from('video_embeds')
          .update(videoData)
          .eq('id', editingVideo.id);

        if (error) throw error;

        toast({
          title: "Video updated",
          description: "Video updated with AI-optimized layout",
        });
      } else {
        const { error } = await supabase
          .from('video_embeds')
          .insert([videoData]);

        if (error) throw error;

        toast({
          title: "Video added",
          description: "Video added with AI-optimized layout",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadVideos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('video_embeds')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Video deleted",
        description: "The video has been removed",
      });

      loadVideos();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (video: VideoEmbed) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      video_type: video.video_type,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      video_type: 'youtube',
      video_url: '',
      thumbnail_url: '',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Video Manager</CardTitle>
              <CardDescription>
                Add and manage video embeds from YouTube, Facebook, TikTok, or direct uploads
              </CardDescription>
            </div>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Video className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground uppercase">
                        {video.video_type}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(video)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(video.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {video.thumbnail_url && (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    <p className="font-medium">{video.title}</p>
                    {video.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary flex items-center gap-1 hover:underline"
                    >
                      View Video <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No videos added yet. Click "Add Video" to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Edit Video' : 'Add Video'}</DialogTitle>
            <DialogDescription>
              Add video embeds from external platforms or upload directly
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_type">Video Source</Label>
                <Select
                  value={formData.video_type}
                  onValueChange={(value: any) => setFormData({ ...formData, video_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="upload">Direct Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.video_type === 'upload' ? (
                <div className="space-y-2">
                  <Label htmlFor="video_file">Upload Video File</Label>
                  <Input
                    id="video_file"
                    type="file"
                    accept="video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 100 * 1024 * 1024) {
                          toast({ title: "File too large", description: "Max 100MB", variant: "destructive" });
                          return;
                        }
                        const fileName = `${Date.now()}-${file.name}`;
                        const { error } = await supabase.storage.from('video-files').upload(fileName, file);
                        if (!error) {
                          const { data } = supabase.storage.from('video-files').getPublicUrl(fileName);
                          setFormData({ ...formData, video_url: data.publicUrl });
                          toast({ title: "Video uploaded successfully" });
                        } else {
                          toast({ title: "Upload failed", description: error.message, variant: "destructive" });
                        }
                      }
                    }}
                  />
                  {formData.video_url && <p className="text-xs text-muted-foreground truncate">{formData.video_url}</p>}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder={
                      formData.video_type === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                      formData.video_type === 'facebook' ? 'https://www.facebook.com/watch/?v=...' :
                      'https://www.tiktok.com/@user/video/...'
                    }
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="thumbnail_file">Thumbnail Image</Label>
                <Input
                  id="thumbnail_file"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const fileName = `thumb-${Date.now()}-${file.name}`;
                      const { error } = await supabase.storage.from('site-images').upload(fileName, file);
                      if (!error) {
                        const { data } = supabase.storage.from('site-images').getPublicUrl(fileName);
                        setFormData({ ...formData, thumbnail_url: data.publicUrl });
                        toast({ title: "Thumbnail uploaded" });
                      } else {
                        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
                      }
                    }
                  }}
                />
                {formData.thumbnail_url && (
                  <img src={formData.thumbnail_url} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingVideo ? 'Update' : 'Add'} Video
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
