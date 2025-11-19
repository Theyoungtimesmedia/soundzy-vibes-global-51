import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface PageSection {
  id: string;
  page_name: string;
  section_key: string;
  section_type: string;
  content_json: any;
  order_index: number;
  is_active: boolean;
}

export const PageSectionManager = () => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [selectedPage, setSelectedPage] = useState('home');
  const [formData, setFormData] = useState({
    page_name: 'home',
    section_key: '',
    section_type: 'text',
    content_json: '{}',
    is_active: true,
  });

  useEffect(() => {
    loadSections();
  }, [selectedPage]);

  const loadSections = async () => {
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_name', selectedPage)
      .order('order_index');

    if (error) {
      toast.error('Failed to load sections');
      console.error(error);
    } else {
      setSections(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      let contentJson;
      try {
        contentJson = JSON.parse(formData.content_json);
      } catch {
        toast.error('Invalid JSON format');
        return;
      }

      if (editingSection) {
        const { error } = await supabase
          .from('page_sections')
          .update({
            section_key: formData.section_key,
            section_type: formData.section_type,
            content_json: contentJson,
            is_active: formData.is_active,
          })
          .eq('id', editingSection.id);

        if (error) throw error;
        toast.success('Section updated');
      } else {
        const maxOrder = sections.reduce((max, s) => Math.max(max, s.order_index), -1);
        const { error } = await supabase
          .from('page_sections')
          .insert({
            page_name: formData.page_name,
            section_key: formData.section_key,
            section_type: formData.section_type,
            content_json: contentJson,
            order_index: maxOrder + 1,
            is_active: formData.is_active,
          });

        if (error) throw error;
        toast.success('Section created');
      }

      setDialogOpen(false);
      resetForm();
      loadSections();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this section?')) return;

    const { error } = await supabase
      .from('page_sections')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete section');
    } else {
      toast.success('Section deleted');
      loadSections();
    }
  };

  const moveSection = async (section: PageSection, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === section.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sections.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapSection = sections[swapIndex];

    await supabase
      .from('page_sections')
      .update({ order_index: swapSection.order_index })
      .eq('id', section.id);

    await supabase
      .from('page_sections')
      .update({ order_index: section.order_index })
      .eq('id', swapSection.id);

    loadSections();
  };

  const resetForm = () => {
    setFormData({
      page_name: selectedPage,
      section_key: '',
      section_type: 'text',
      content_json: '{}',
      is_active: true,
    });
    setEditingSection(null);
  };

  const openEditDialog = (section: PageSection) => {
    setEditingSection(section);
    setFormData({
      page_name: section.page_name,
      section_key: section.section_key,
      section_type: section.section_type,
      content_json: JSON.stringify(section.content_json, null, 2),
      is_active: section.is_active,
    });
    setDialogOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Page Sections</h2>
          <p className="text-muted-foreground">Manage dynamic content sections for your website</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSection ? 'Edit Section' : 'Add Section'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Section Key</Label>
                <Input
                  value={formData.section_key}
                  onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                  placeholder="hero_section"
                />
              </div>
              <div>
                <Label>Section Type</Label>
                <select
                  value={formData.section_type}
                  onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="hero">Hero</option>
                  <option value="text">Text</option>
                  <option value="services">Services</option>
                  <option value="gallery">Gallery</option>
                  <option value="cta">Call to Action</option>
                  <option value="testimonials">Testimonials</option>
                </select>
              </div>
              <div>
                <Label>Content (JSON)</Label>
                <Textarea
                  value={formData.content_json}
                  onChange={(e) => setFormData({ ...formData, content_json: e.target.value })}
                  placeholder='{"heading": "Welcome", "text": "..."}'
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingSection ? 'Update' : 'Create'} Section
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-4">
        {['home', 'creative', 'dj', 'shop'].map(page => (
          <Button
            key={page}
            variant={selectedPage === page ? 'default' : 'outline'}
            onClick={() => setSelectedPage(page)}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{section.section_key}</CardTitle>
                  <CardDescription>
                    Type: {section.section_type} • Order: {section.order_index}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveSection(section, 'up')}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveSection(section, 'down')}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(section)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                {JSON.stringify(section.content_json, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
