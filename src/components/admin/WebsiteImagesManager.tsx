import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, ExternalLink, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WebsiteImage {
  key: string;
  page: string;
  section: string;
  description: string;
  url: string;
  updated_at: string;
}

const IMAGE_REGISTRY = [
  // Home Page
  { key: 'home-hero', page: 'home', section: 'hero', description: 'Main hero background image' },
  { key: 'home-about', page: 'home', section: 'about', description: 'About section image' },
  { key: 'home-feature-1', page: 'home', section: 'features', description: 'First feature image' },
  { key: 'home-feature-2', page: 'home', section: 'features', description: 'Second feature image' },
  { key: 'home-feature-3', page: 'home', section: 'features', description: 'Third feature image' },
  
  // DJ Page
  { key: 'dj-hero', page: 'dj', section: 'hero', description: 'DJ page hero background' },
  { key: 'dj-equipment-1', page: 'dj', section: 'equipment', description: 'Equipment showcase 1' },
  { key: 'dj-equipment-2', page: 'dj', section: 'equipment', description: 'Equipment showcase 2' },
  
  // Creative Page
  { key: 'creative-hero', page: 'creative', section: 'hero', description: 'Creative services hero' },
  { key: 'creative-portfolio-1', page: 'creative', section: 'portfolio', description: 'Portfolio item 1' },
  { key: 'creative-portfolio-2', page: 'creative', section: 'portfolio', description: 'Portfolio item 2' },
  
  // Shop Page
  { key: 'shop-hero', page: 'shop', section: 'hero', description: 'Shop page hero background' },
  { key: 'shop-banner', page: 'shop', section: 'banner', description: 'Promotional banner' },
];

export default function WebsiteImagesManager() {
  const [images, setImages] = useState<WebsiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('home');
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .order('page')
      .order('section');

    if (error) {
      toast({
        title: 'Error loading images',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const seedRegistry = async () => {
    const { error } = await supabase
      .from('website_images')
      .upsert(
        IMAGE_REGISTRY.map(img => ({
          ...img,
          url: `/lovable-uploads/placeholder.png`,
        })),
        { onConflict: 'key' }
      );

    if (error) {
      toast({
        title: 'Error seeding registry',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Registry seeded',
        description: 'All image placeholders have been created',
      });
      loadImages();
    }
  };

  const handleFileUpload = async (key: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${key}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('site-images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: 'Upload failed',
        description: uploadError.message,
        variant: 'destructive',
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('website_images')
      .update({ url: publicUrl })
      .eq('key', key);

    if (updateError) {
      toast({
        title: 'Update failed',
        description: updateError.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Image updated',
        description: 'Website image has been updated',
      });
      loadImages();
    }
  };

  const handleUrlPaste = async (key: string, url: string) => {
    const { error } = await supabase
      .from('website_images')
      .update({ url })
      .eq('key', key);

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'URL updated',
        description: 'Image URL has been updated',
      });
      loadImages();
    }
  };

  const pages = ['home', 'dj', 'creative', 'shop'];
  const filteredImages = images.filter(img => img.page === selectedPage);

  if (loading) return <div>Loading images...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Website Images Manager</h2>
          <p className="text-muted-foreground">Manage all images across your website by page and section</p>
        </div>
        <Button onClick={seedRegistry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Seed Registry
        </Button>
      </div>

      <Tabs value={selectedPage} onValueChange={setSelectedPage}>
        <TabsList className="grid w-full grid-cols-4">
          {pages.map(page => (
            <TabsTrigger key={page} value={page} className="capitalize">
              {page}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages.map(page => (
          <TabsContent key={page} value={page} className="space-y-4">
            {filteredImages.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No images found for this page. Click "Seed Registry" to create placeholders.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredImages.map(img => (
                <Card key={img.key}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{img.description}</span>
                      <span className="text-sm font-normal text-muted-foreground">{img.section}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <img 
                          src={img.url} 
                          alt={img.description}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Upload New Image</label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(img.key, file);
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Or Paste Image URL</label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://..."
                              defaultValue={img.url}
                              onBlur={(e) => {
                                if (e.target.value && e.target.value !== img.url) {
                                  handleUrlPaste(img.key, e.target.value);
                                }
                              }}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(img.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Key: <code>{img.key}</code>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
