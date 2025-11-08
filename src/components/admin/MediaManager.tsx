import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Upload, Copy, Trash2, Image, Music, Video, FileImage } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MediaItem {
  name: string;
  id: string;
  created_at: string;
  metadata: Record<string, any>;
  bucket_id: string;
}

export function MediaManager() {
  const [mediaItems, setMediaItems] = useState<Record<string, MediaItem[]>>({
    'audio-files': [],
    'video-files': [],
    'site-images': [],
    'cover-art': []
  });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ bucket: string; path: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAllMedia();
  }, []);

  const loadAllMedia = async () => {
    const buckets = ['audio-files', 'video-files', 'site-images', 'cover-art'];
    const newMediaItems: Record<string, MediaItem[]> = {};

    for (const bucket of buckets) {
      const { data, error } = await supabase.storage.from(bucket).list();
      if (!error && data) {
        newMediaItems[bucket] = data.filter(item => item.name !== '.emptyFolderPlaceholder');
      }
    }

    setMediaItems(newMediaItems);
  };

  const handleFileUpload = async (bucket: string, file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const fileName = `${Date.now()}-${file.name}`;

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      setUploadProgress(100);
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded to ${bucket}`,
      });

      await loadAllMedia();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getPublicUrl = (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "The public URL has been copied to clipboard",
    });
  };

  const deleteFile = async () => {
    if (!deleteItem) return;

    try {
      const { error } = await supabase.storage
        .from(deleteItem.bucket)
        .remove([deleteItem.path]);

      if (error) throw error;

      toast({
        title: "File deleted",
        description: "The file has been removed",
      });

      await loadAllMedia();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteItem(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const renderMediaGrid = (bucket: string, icon: any) => {
    const items = mediaItems[bucket] || [];

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept={
              bucket === 'audio-files' ? 'audio/*' :
              bucket === 'video-files' ? 'video/*' :
              'image/*'
            }
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(bucket, file);
            }}
            disabled={isUploading}
            className="flex-1"
          />
          <Button disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>

        {isUploading && (
          <Progress value={uploadProgress} className="w-full" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const url = getPublicUrl(bucket, item.name);
            const IconComponent = icon;

            return (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <IconComponent className="h-8 w-8 text-primary" />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyUrl(url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteItem({ bucket, path: item.name })}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(bucket === 'site-images' || bucket === 'cover-art') && (
                      <img
                        src={url}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    )}
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(item.metadata?.size || 0)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono break-all">
                      {url}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No files uploaded yet. Upload your first file to get started.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>
            Manage all media files used across the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="images" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="images">
                <Image className="h-4 w-4 mr-2" />
                Images
              </TabsTrigger>
              <TabsTrigger value="cover-art">
                <FileImage className="h-4 w-4 mr-2" />
                Cover Art
              </TabsTrigger>
              <TabsTrigger value="audio">
                <Music className="h-4 w-4 mr-2" />
                Audio
              </TabsTrigger>
              <TabsTrigger value="video">
                <Video className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="images">
              {renderMediaGrid('site-images', Image)}
            </TabsContent>

            <TabsContent value="cover-art">
              {renderMediaGrid('cover-art', FileImage)}
            </TabsContent>

            <TabsContent value="audio">
              {renderMediaGrid('audio-files', Music)}
            </TabsContent>

            <TabsContent value="video">
              {renderMediaGrid('video-files', Video)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteFile}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
