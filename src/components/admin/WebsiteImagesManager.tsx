import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Image, Upload, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WebsiteImage {
  key: string;
  url: string;
  page: string;
  section: string;
  description: string | null;
  updated_at: string;
}

const SEED_IMAGES: Omit<WebsiteImage, 'updated_at'>[] = [
  { key: 'home.hero_background', url: '/src/assets/hero-main.jpg', page: 'home', section: 'hero', description: 'Homepage hero background' },
  { key: 'home.services.dj_image', url: '/images/dj-equipment.jpg', page: 'home', section: 'services', description: 'DJ services card image' },
  { key: 'home.services.creative_image', url: '/images/creative-workspace.jpg', page: 'home', section: 'services', description: 'Creative services card image' },
  { key: 'home.services.sound_image', url: '/images/sound-equipment.jpg', page: 'home', section: 'services', description: 'Sound equipment card image' },
  { key: 'home.studio.gallery_equipment', url: '/src/assets/office-equipment.jpg', page: 'home', section: 'studio', description: 'Studio equipment gallery' },
  { key: 'home.studio.gallery_interior', url: '/src/assets/office-interior.jpg', page: 'home', section: 'studio', description: 'Studio interior gallery' },
  { key: 'home.studio.gallery_team', url: '/src/assets/team-member.jpg', page: 'home', section: 'studio', description: 'Team member gallery' },
  { key: 'home.about.studio_interior', url: '/images/studio-interior.jpg', page: 'home', section: 'about', description: 'About section studio' },
  { key: 'dj.hero_background', url: '/src/assets/hero-dj-premium.jpg', page: 'dj', section: 'hero', description: 'DJ page hero' },
  { key: 'dj.album_fallback', url: '/assets/images/dj-album-art.png', page: 'dj', section: 'audio', description: 'Default album art' },
  { key: 'dj.certs.nollywood_permit', url: '/assets/certifications/nollywood-permit.png', page: 'dj', section: 'certifications', description: 'Nollywood permit' },
  { key: 'dj.certs.ampsomi_cert', url: '/assets/certifications/ampsomi-cert.png', page: 'dj', section: 'certifications', description: 'AMPSOMI certificate' },
  { key: 'creative.hero_background', url: '/src/assets/hero-creative-premium.jpg', page: 'creative', section: 'hero', description: 'Creative page hero' },
  { key: 'creative.services_banner', url: '/assets/images/services-banner.png', page: 'creative', section: 'services', description: 'Services banner' },
  { key: 'social.icons.whatsapp_alt', url: '/assets/icons/whatsapp-alt.png', page: 'general', section: 'social', description: 'WhatsApp icon' },
];

export default function WebsiteImagesManager() {
  const [images, setImages] = useState<WebsiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPage, setFilterPage] = useState<string>('all');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase
        .from('website_images')
        .select('*')
        .order('page', { ascending: true })
        .order('section', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading images',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const seedImages = async () => {
    try {
      for (const img of SEED_IMAGES) {
        const { error } = await supabase
          .from('website_images')
          .upsert(img, { onConflict: 'key', ignoreDuplicates: false });
        
        if (error) throw error;
      }
      
      toast({
        title: 'Images seeded',
        description: 'All default images have been registered',
      });
      
      loadImages();
    } catch (error: any) {
      toast({
        title: 'Seed failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = async (key: string, file: File) => {
    try {
      setUploadingFile(true);
      const fileName = `${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName);
      
      await updateImageUrl(key, data.publicUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'File uploaded and saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploadingFile(false);
      setEditingKey(null);
      setNewUrl('');
    }
  };

  const updateImageUrl = async (key: string, url: string) => {
    try {
      const { error } = await supabase
        .from('website_images')
        .update({ url, updated_at: new Date().toISOString() })
        .eq('key', key);

      if (error) throw error;

      toast({
        title: 'Image updated',
        description: 'Image URL has been saved',
      });
      
      loadImages();
      setEditingKey(null);
      setNewUrl('');
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const filteredImages = filterPage === 'all' 
    ? images 
    : images.filter(img => img.page === filterPage);

  const pages = ['all', ...Array.from(new Set(images.map(img => img.page)))];

  if (loading) {
    return <div className="p-6">Loading images...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Website Images Manager</CardTitle>
              <CardDescription>
                Manage images across all pages - replace by upload or paste URL
              </CardDescription>
            </div>
            <Button onClick={seedImages} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Seed/Refresh Registry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={filterPage} onValueChange={setFilterPage} className="w-full">
            <TabsList className="mb-4 flex-wrap h-auto">
              {pages.map(page => (
                <TabsTrigger key={page} value={page} className="capitalize">
                  {page}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="grid gap-4">
              {filteredImages.map(image => (
                <Card key={image.key}>
                  <CardContent className="p-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.key}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="font-semibold text-sm">{image.key}</p>
                          <p className="text-xs text-muted-foreground">
                            {image.page} / {image.section}
                          </p>
                          {image.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {image.description}
                            </p>
                          )}
                        </div>
                        
                        {editingKey === image.key ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                type="url"
                                placeholder="Paste image URL"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                onClick={() => updateImageUrl(image.key, newUrl)}
                                disabled={!newUrl}
                              >
                                <LinkIcon className="h-4 w-4 mr-1" />
                                Save URL
                              </Button>
                            </div>
                            
                            <div className="flex gap-2 items-center">
                              <Label htmlFor={`file-${image.key}`} className="cursor-pointer">
                                <div className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-accent">
                                  <Upload className="h-4 w-4" />
                                  Upload File
                                </div>
                              </Label>
                              <input
                                id={`file-${image.key}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingFile}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(image.key, file);
                                }}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingKey(null);
                                  setNewUrl('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingKey(image.key);
                                setNewUrl(image.url);
                              }}
                            >
                              <Image className="h-4 w-4 mr-1" />
                              Replace
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                navigator.clipboard.writeText(image.url);
                                toast({ title: 'URL copied!' });
                              }}
                            >
                              Copy URL
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No images found. Click "Seed/Refresh Registry" to populate with defaults.
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
