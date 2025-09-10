import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  [key: string]: any;
}

interface ServiceSection {
  key: string;
  title: string;
  description: string;
  services: Service[];
}

export default function ServicesManager() {
  const [sections, setSections] = useState<ServiceSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingSection, setEditingSection] = useState<string>('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value, description')
        .in('key', ['footer_services', 'homepage_services', 'creative_services', 'shop_services']);

      if (error) throw error;

      const sectionsData: ServiceSection[] = data.map(item => ({
        key: item.key,
        title: formatSectionTitle(item.key),
        description: item.description || '',
        services: Array.isArray(item.value) ? item.value as Service[] : []
      }));

      setSections(sectionsData);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const formatSectionTitle = (key: string) => {
    return key
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const saveServices = async (sectionKey: string, services: Service[]) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: services as any })
        .eq('key', sectionKey);

      if (error) throw error;

      setSections(prev => prev.map(section => 
        section.key === sectionKey 
          ? { ...section, services }
          : section
      ));

      toast.success('Services updated successfully');
    } catch (error) {
      console.error('Error saving services:', error);
      toast.error('Failed to save services');
    }
  };

  const addService = (sectionKey: string) => {
    const newService: Service = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      icon: ''
    };
    setEditingService(newService);
    setEditingSection(sectionKey);
  };

  const editService = (service: Service, sectionKey: string) => {
    setEditingService(service);
    setEditingSection(sectionKey);
  };

  const deleteService = (serviceId: string, sectionKey: string) => {
    const section = sections.find(s => s.key === sectionKey);
    if (!section) return;

    const updatedServices = section.services.filter(s => s.id !== serviceId);
    saveServices(sectionKey, updatedServices);
  };

  const handleSaveService = () => {
    if (!editingService || !editingSection) return;

    const section = sections.find(s => s.key === editingSection);
    if (!section) return;

    const existingIndex = section.services.findIndex(s => s.id === editingService.id);
    let updatedServices;

    if (existingIndex >= 0) {
      updatedServices = section.services.map((s, index) => 
        index === existingIndex ? editingService : s
      );
    } else {
      updatedServices = [...section.services, editingService];
    }

    saveServices(editingSection, updatedServices);
    setEditingService(null);
    setEditingSection('');
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Services Manager</h2>
        <Badge variant="secondary">
          {sections.reduce((total, section) => total + section.services.length, 0)} Total Services
        </Badge>
      </div>

      <Tabs defaultValue={sections[0]?.key} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {sections.map(section => (
            <TabsTrigger key={section.key} value={section.key}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map(section => (
          <TabsContent key={section.key} value={section.key} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <Button onClick={() => addService(section.key)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {section.services.map(service => (
                <Card key={service.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                    {service.image && (
                      <div className="aspect-video bg-muted rounded-md overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editService(service, section.key)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteService(service.id, section.key)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingService?.title ? 'Edit Service' : 'Add Service'}
            </DialogTitle>
          </DialogHeader>
          
          {editingService && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingService.title}
                  onChange={(e) => setEditingService(prev => 
                    prev ? { ...prev, title: e.target.value } : null
                  )}
                  placeholder="Service title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                  placeholder="Service description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={editingService.image || ''}
                  onChange={(e) => setEditingService(prev => 
                    prev ? { ...prev, image: e.target.value } : null
                  )}
                  placeholder="/images/example.jpg"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Icon (for footer)</label>
                <Input
                  value={editingService.icon || ''}
                  onChange={(e) => setEditingService(prev => 
                    prev ? { ...prev, icon: e.target.value } : null
                  )}
                  placeholder="music, speaker, calendar, etc."
                />
              </div>
              
              <Button onClick={handleSaveService} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Service
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}