import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceMedia {
  id: string;
  service_key: string;
  media_type: string;
  media_url: string;
  title?: string;
  description?: string;
  order_index: number;
}

export const ServiceMediaManager = () => {
  const [media, setMedia] = useState<ServiceMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<ServiceMedia | null>(null);
  const [selectedService, setSelectedService] = useState('graphic_design');
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    service_key: 'graphic_design',
    media_type: 'image',
    media_url: '',
    title: '',
    description: '',
    file: null as File | null,
  });

  useEffect(() => {
    loadMedia();
  }, [selectedService]);

  const loadMedia = async () => {
    const { data, error } = await supabase
      .from('service_media')
      .select('*')
      .eq('service_key', selectedService)
      .order('order_index');

    if (error) {
      console.error(error);
      toast.error('Failed to load media');
    } else {
      setMedia(data || []);
    }
    setLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    const bucket = formData.media_type === 'video' ? 'video-files' : 'site-images';
    const filePath = `service-media/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      let mediaUrl = formData.media_url;

      if (formData.file) {
        mediaUrl = await handleFileUpload(formData.file);
      }

      if (!mediaUrl) {
        toast.error('Please provide a file or URL');
        return;
      }

      if (editingMedia) {
        const { error } = await supabase
          .from('service_media')
          .update({
            media_url: mediaUrl,
            title: formData.title,
            description: formData.description,
          })
          .eq('id', editingMedia.id);

        if (error) throw error;
        toast.success('Media updated');
      } else {
        const maxOrder = media.reduce((max, m) => Math.max(max, m.order_index), -1);
        const { error } = await supabase
          .from('service_media')
          .insert({
            service_key: formData.service_key,
            media_type: formData.media_type,
            media_url: mediaUrl,
            title: formData.title,
            description: formData.description,
            order_index: maxOrder + 1,
          });

        if (error) throw error;
        toast.success('Media added');
      }

      setDialogOpen(false);
      resetForm();
      loadMedia();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media?')) return;

    const { error } = await supabase
      .from('service_media')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Media deleted');
      loadMedia();
    }
  };

  const resetForm = () => {
    setFormData({
      service_key: selectedService,
      media_type: 'image',
      media_url: '',
      title: '',
      description: '',
      file: null,
    });
    setEditingMedia(null);
  };

  const services = [
    { key: 'graphic_design', name: 'Graphic Design' },
    { key: 'web_design', name: 'Web Design' },
    { key: 'logo_design', name: 'Logo Design' },
    { key: 'brand_identity', name: 'Brand Identity' },
    { key: 'print_design', name: 'Print Design' },
    { key: 'video_production', name: 'Video Production' },
    { key: 'digital_marketing', name: 'Digital Marketing' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Media</h2>
          <p className="text-muted-foreground">Manage images and videos for service pages</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingMedia ? 'Edit Media' : 'Add Media'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Media Type</Label>
                <select
                  value={formData.media_type}
                  onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <Label>Upload File</Label>
                <Input
                  type="file"
                  accept={formData.media_type === 'video' ? 'video/*' : 'image/*'}
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                />
              </div>
              <div>
                <Label>Or paste URL</Label>
                <Input
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Title (Optional)</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button onClick={handleSave} disabled={uploading} className="w-full">
                {uploading ? 'Uploading...' : editingMedia ? 'Update' : 'Add'} Media
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {services.map(service => (
          <Button
            key={service.key}
            variant={selectedService === service.key ? 'default' : 'outline'}
            onClick={() => setSelectedService(service.key)}
            size="sm"
          >
            {service.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{item.title || 'Untitled'}</CardTitle>
                  <CardDescription>{item.media_type}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {item.media_type === 'image' ? (
                <img src={item.media_url} alt={item.title || ''} className="w-full h-40 object-cover rounded" />
              ) : (
                <video src={item.media_url} className="w-full h-40 object-cover rounded" controls />
              )}
              {item.description && (
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
