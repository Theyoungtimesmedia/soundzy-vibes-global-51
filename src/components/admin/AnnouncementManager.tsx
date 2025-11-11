import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Megaphone, Calendar, Users, AlertCircle, Image, Volume2, Video, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  status: string;
  target_audience: string;
  pinned: boolean;
  media_type: string | null;
  media_url: string | null;
  expires_at?: string;
  created_at: string;
}

export default function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    status: 'draft',
    target_audience: 'all',
    pinned: false,
    media_type: null as string | null,
    media_url: '',
    expires_at: ''
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error loading announcements:', error);
      toast({
        title: "Error",
        description: "Failed to load announcements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = async (file: File, type: 'image' | 'audio' | 'video') => {
    try {
      setUploadingMedia(true);
      const bucketName = type === 'image' ? 'site-images' : type === 'audio' ? 'audio-files' : 'video-files';
      const fileName = `${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      setFormData({ ...formData, media_type: type, media_url: data.publicUrl });
      
      toast({
        title: "Media uploaded",
        description: `${type} uploaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSave = async () => {
    try {
      const announcementData = {
        ...formData,
        expires_at: formData.expires_at || null,
        media_url: formData.media_url || null,
        media_type: formData.media_type || null
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editingAnnouncement.id);
        if (error) throw error;
        toast({ title: "Success", description: "Announcement updated successfully" });
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert([announcementData]);
        if (error) throw error;
        toast({ title: "Success", description: "Announcement created successfully" });
      }
      
      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      resetForm();
      loadAnnouncements();
    } catch (error: any) {
      console.error('Error saving announcement:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Announcement deleted successfully" });
      loadAnnouncements();
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      priority: 'normal',
      status: 'draft',
      target_audience: 'all',
      pinned: false,
      media_type: null,
      media_url: '',
      expires_at: ''
    });
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      status: announcement.status,
      target_audience: announcement.target_audience,
      pinned: announcement.pinned,
      media_type: announcement.media_type,
      media_url: announcement.media_url || '',
      expires_at: announcement.expires_at ? announcement.expires_at.split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'update': return '🔔';
      case 'event': return '📅';
      case 'promo': return '🎉';
      case 'alert': return '⚠️';
      default: return '📢';
    }
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return <div className="p-6">Loading announcements...</div>;
  }

  const activeCount = announcements.filter(a => a.status === 'published' && !isExpired(a.expires_at)).length;
  const urgentCount = announcements.filter(a => a.priority === 'urgent' && a.status === 'published').length;
  const expiredCount = announcements.filter(a => isExpired(a.expires_at)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Announcement Management</h2>
          <p className="text-muted-foreground">Create and manage site-wide announcements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingAnnouncement(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Announcement title"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Announcement content"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="promo">Promo</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Select value={formData.target_audience} onValueChange={(value) => setFormData({ ...formData, target_audience: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="customers">Customers</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="expires_at">Expires At (Optional)</Label>
                  <Input
                    id="expires_at"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="pinned"
                    checked={formData.pinned}
                    onCheckedChange={(checked) => setFormData({ ...formData, pinned: checked })}
                  />
                  <Label htmlFor="pinned" className="cursor-pointer">Pin this announcement</Label>
                </div>
              </div>

              {/* Media Section */}
              <div className="col-span-2">
                <Label>Media (Optional)</Label>
                <Tabs defaultValue="none" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="none">No Media</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="audio">Audio</TabsTrigger>
                    <TabsTrigger value="video">Video</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="none" className="space-y-2">
                    <p className="text-sm text-muted-foreground">Text-only announcement</p>
                  </TabsContent>
                  
                  <TabsContent value="image" className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="Or paste image URL"
                        value={formData.media_type === 'image' ? formData.media_url : ''}
                        onChange={(e) => setFormData({ ...formData, media_type: 'image', media_url: e.target.value })}
                      />
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" disabled={uploadingMedia} asChild>
                          <div>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </div>
                        </Button>
                      </Label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleMediaUpload(file, 'image');
                        }}
                      />
                    </div>
                    {formData.media_type === 'image' && formData.media_url && (
                      <img src={formData.media_url} alt="Preview" className="w-full max-h-48 object-cover rounded" />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="audio" className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="Or paste audio URL"
                        value={formData.media_type === 'audio' ? formData.media_url : ''}
                        onChange={(e) => setFormData({ ...formData, media_type: 'audio', media_url: e.target.value })}
                      />
                      <Label htmlFor="audio-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" disabled={uploadingMedia} asChild>
                          <div>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </div>
                        </Button>
                      </Label>
                      <input
                        id="audio-upload"
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleMediaUpload(file, 'audio');
                        }}
                      />
                    </div>
                    {formData.media_type === 'audio' && formData.media_url && (
                      <audio controls className="w-full">
                        <source src={formData.media_url} />
                      </audio>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="video" className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="Or paste video URL"
                        value={formData.media_type === 'video' ? formData.media_url : ''}
                        onChange={(e) => setFormData({ ...formData, media_type: 'video', media_url: e.target.value })}
                      />
                      <Label htmlFor="video-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" disabled={uploadingMedia} asChild>
                          <div>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </div>
                        </Button>
                      </Label>
                      <input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleMediaUpload(file, 'video');
                        }}
                      />
                    </div>
                    {formData.media_type === 'video' && formData.media_url && (
                      <video controls className="w-full max-h-48 rounded">
                        <source src={formData.media_url} />
                      </video>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={uploadingMedia}>
                {editingAnnouncement ? 'Update' : 'Create'} Announcement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{activeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{urgentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{expiredCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Announcement</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {announcement.pinned && <span>📌</span>}
                      <div>
                        <div className="font-medium">{announcement.title}</div>
                        {announcement.media_type && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {announcement.media_type === 'image' && <Image className="h-3 w-3 mr-1" />}
                            {announcement.media_type === 'audio' && <Volume2 className="h-3 w-3 mr-1" />}
                            {announcement.media_type === 'video' && <Video className="h-3 w-3 mr-1" />}
                            {announcement.media_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{getTypeIcon(announcement.type)}</span>
                      <span className="capitalize">{announcement.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(announcement.status)}>
                      {announcement.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{announcement.target_audience}</TableCell>
                  <TableCell>
                    {announcement.expires_at ? (
                      <span className={isExpired(announcement.expires_at) ? 'text-red-500' : ''}>
                        {new Date(announcement.expires_at).toLocaleDateString()}
                        {isExpired(announcement.expires_at) && ' (Expired)'}
                      </span>
                    ) : (
                      'Never'
                    )}
                  </TableCell>
                  <TableCell>{new Date(announcement.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEditDialog(announcement)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(announcement.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {announcements.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No announcements created yet. Click "Add Announcement" to create one.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
