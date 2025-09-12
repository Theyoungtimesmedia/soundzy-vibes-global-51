import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Clock, User, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  session_id: string;
  visitor_info: any;
  status: string;
  last_activity: string;
  message_count: number;
  created_at: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  direction: string;
  message: string;
  metadata: any;
  created_at: string;
}

export default function ChatManager() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
    loadChatMessages();
  }, []);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('last_activity', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat sessions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadChatMessages = async () => {
    // Note: chat_messages table needs to be created separately
    // For now, we'll use empty array
    setMessages([]);
  };

  const updateSessionStatus = async (sessionId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ status })
        .eq('id', sessionId);

      if (error) throw error;
      toast({ title: "Success", description: "Session status updated" });
      loadSessions();
    } catch (error) {
      console.error('Error updating session:', error);
      toast({
        title: "Error",
        description: "Failed to update session status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'resolved': return 'secondary';
      case 'pending': return 'outline';
      case 'closed': return 'outline';
      default: return 'secondary';
    }
  };

  const getSessionMessages = (sessionId: string) => {
    return messages.filter(msg => msg.session_id === sessionId);
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         JSON.stringify(session.visitor_info).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatLastActivity = (timestamp: string) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  if (loading) {
    return <div className="p-6">Loading chat sessions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Chat Management</h2>
          <p className="text-muted-foreground">Monitor and manage customer chat sessions</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              +{sessions.filter(s => {
                const today = new Date();
                const created = new Date(s.created_at);
                return created.toDateString() === today.toDateString();
              }).length} today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground">all time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5m</div>
            <p className="text-xs text-muted-foreground">estimated</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => {
                const today = new Date();
                const updated = new Date(s.last_activity);
                return s.status === 'resolved' && updated.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">sessions</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chat Sessions</CardTitle>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>Visitor Info</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => {
                const sessionMessages = getSessionMessages(session.session_id);
                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-mono text-sm">
                      {session.session_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {session.visitor_info.userAgent && (
                          <div className="text-xs text-muted-foreground">
                            {session.visitor_info.userAgent.includes('Mobile') ? '📱 Mobile' : '💻 Desktop'}
                          </div>
                        )}
                        {session.visitor_info.country && (
                          <div className="text-xs">{session.visitor_info.country}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {session.message_count}
                        {sessionMessages.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({sessionMessages.filter(m => m.direction === 'outbound').length} replies)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(session.status)}>{session.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatLastActivity(session.last_activity)}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(session.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Select 
                          value={session.status} 
                          onValueChange={(value) => updateSessionStatus(session.id, value)}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredSessions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No chat sessions found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle>Messages for Session: {selectedSession}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {getSessionMessages(selectedSession).map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.direction === 'inbound' 
                      ? 'bg-muted ml-0 mr-12' 
                      : 'bg-primary text-primary-foreground ml-12 mr-0'
                  }`}
                >
                  <div className="text-sm">{message.message}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleString()}
                    {message.direction === 'inbound' ? ' (User)' : ' (Bot)'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}