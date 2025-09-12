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
import { Plus, Edit, Trash2, Play, Music, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DJTape {
  id: string;
  title: string;
  artist_name: string;
  description?: string;
  audio_url?: string;
  cover_image?: string;
  duration?: number;
  genre?: string;
  tags: string[];
  play_count: number;
  status: string;
  created_at: string;
}

export default function DJTapeManager() {
  const [tapes, setTapes] = useState<DJTape[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTape, setEditingTape] = useState<DJTape | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    artist_name: '',
    description: '',
    audio_url: '',
    cover_image: '',
    duration: 0,
    genre: '',
    tags: '',
    status: 'active'
  });

  useEffect(() => {
    loadTapes();
  }, []);

  const loadTapes = async () => {
    try {
      const { data, error } = await supabase
        .from('dj_tapes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTapes((data || []).map(tape => ({
        ...tape,
        tags: Array.isArray(tape.tags) ? tape.tags.map(String) : []
      })));
    } catch (error) {
      console.error('Error loading tapes:', error);
      toast({
        title: "Error",
        description: "Failed to load DJ tapes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
      const tapeData = {
        ...formData,
        tags
      };

      if (editingTape) {
        const { error } = await supabase
          .from('dj_tapes')
          .update(tapeData)
          .eq('id', editingTape.id);
        if (error) throw error;
        toast({ title: "Success", description: "Tape updated successfully" });
      } else {
        const { error } = await supabase
          .from('dj_tapes')
          .insert([tapeData]);
        if (error) throw error;
        toast({ title: "Success", description: "Tape created successfully" });
      }
      
      setIsDialogOpen(false);
      setEditingTape(null);
      resetForm();
      loadTapes();
    } catch (error) {
      console.error('Error saving tape:', error);
      toast({
        title: "Error",
        description: "Failed to save tape",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tape?')) return;
    
    try {
      const { error } = await supabase
        .from('dj_tapes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Tape deleted successfully" });
      loadTapes();
    } catch (error) {
      console.error('Error deleting tape:', error);
      toast({
        title: "Error",
        description: "Failed to delete tape",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist_name: '',
      description: '',
      audio_url: '',
      cover_image: '',
      duration: 0,
      genre: '',
      tags: '',
      status: 'active'
    });
  };

  const openEditDialog = (tape: DJTape) => {
    setEditingTape(tape);
    setFormData({
      title: tape.title,
      artist_name: tape.artist_name,
      description: tape.description || '',
      audio_url: tape.audio_url || '',
      cover_image: tape.cover_image || '',
      duration: tape.duration || 0,
      genre: tape.genre || '',
      tags: tape.tags.join(', '),
      status: tape.status
    });
    setIsDialogOpen(true);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'archived': return 'secondary';
      case 'featured': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <div className="p-6">Loading DJ tapes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">DJ Tape Management</h2>
          <p className="text-muted-foreground">Manage your music collection and mixes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingTape(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tape
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTape ? 'Edit Tape' : 'Add New Tape'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Mix title"
                />
              </div>
              <div>
                <Label htmlFor="artist_name">Artist/DJ Name</Label>
                <Input
                  id="artist_name"
                  value={formData.artist_name}
                  onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                  placeholder="DJ Soundzy"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mix description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="audio_url">Audio URL</Label>
                <Input
                  id="audio_url"
                  value={formData.audio_url}
                  onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
              <div>
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input
                  id="cover_image"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  placeholder="3600"
                />
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Afrobeats">Afrobeats</SelectItem>
                    <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Dancehall">Dancehall</SelectItem>
                    <SelectItem value="Amapiano">Amapiano</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="party, wedding, club, energetic"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{editingTape ? 'Update' : 'Create'} Tape</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tapes</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tapes.length}</div>
            <p className="text-xs text-muted-foreground">
              {tapes.filter(t => t.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tapes.filter(t => t.status === 'featured').length}
            </div>
            <p className="text-xs text-muted-foreground">featured mixes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tapes.reduce((sum, t) => sum + t.play_count, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">total plays</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tapes.length > 0 
                ? formatDuration(Math.round(tapes.reduce((sum, t) => sum + (t.duration || 0), 0) / tapes.length))
                : '0:00'
              }
            </div>
            <p className="text-xs text-muted-foreground">average length</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All DJ Tapes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tape</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Plays</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tapes.map((tape) => (
                <TableRow key={tape.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {tape.cover_image && (
                        <img 
                          src={tape.cover_image} 
                          alt={tape.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{tape.title}</div>
                        {tape.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {tape.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{tape.artist_name}</TableCell>
                  <TableCell>{tape.genre || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(tape.duration)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {tape.play_count.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(tape.status)}>{tape.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(tape.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(tape)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(tape.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}