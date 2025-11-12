import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  ShoppingCart, 
  FileText, 
  Music,
  Megaphone,
  Settings,
  Shield,
  Database,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import ServicesManager from '@/components/admin/ServicesManager';
import LeadsManager from '@/components/admin/LeadsManager';
import BlogManager from '@/components/admin/BlogManager';
import ProductManager from '@/components/admin/ProductManager';
import DJTapeManager from '@/components/admin/DJTapeManager';
import AnnouncementManager from '@/components/admin/AnnouncementManager';
import ChatManager from '@/components/admin/ChatManager';
import { MediaManager } from '@/components/admin/MediaManager';
import { VideoManager } from '@/components/admin/VideoManager';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { stats, loading: statsLoading } = useRealTimeData();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Accessibility override: Always show Admin dashboard without auth gating
  useEffect(() => {
    setUserRole('admin');
    setLoading(false);
  }, []);

  const createQuickAction = async (type: string) => {
    try {
      switch (type) {
        case 'announcement':
          // Switch to announcements tab
          (document.querySelector('[value="announcements"]') as HTMLElement)?.click();
          toast({
            title: "Ready to create announcement",
            description: "Switched to announcements tab. Click 'Add Announcement' to create a new one.",
          });
          break;
        case 'dj-tape':
          (document.querySelector('[value="dj-tapes"]') as HTMLElement)?.click();
          toast({
            title: "Ready to upload DJ tape",
            description: "Switched to DJ tapes tab. Click 'Add DJ Tape' to upload a new one.",
          });
          break;
        case 'blog':
          (document.querySelector('[value="blog"]') as HTMLElement)?.click();
          toast({
            title: "Ready to create blog post",
            description: "Switched to blog tab. Click 'Add Blog Post' to create a new one.",
          });
          break;
        case 'product':
          (document.querySelector('[value="products"]') as HTMLElement)?.click();
          toast({
            title: "Ready to add product",
            description: "Switched to products tab. Click 'Add Product' to create a new one.",
          });
          break;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform quick action",
        variant: "destructive",
      });
    }
  };


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex flex-col sm:flex-row h-auto sm:h-16 items-start sm:items-center px-4 sm:px-6 py-3 sm:py-0 gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold">SWG Admin Console</h1>
            <Badge variant="secondary" className="text-xs">{userRole}</Badge>
          </div>
          
          <div className="sm:ml-auto flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-none">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-3 sm:p-6">
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1">
              <TabsTrigger value="overview" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Leads</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="dj-tapes" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <Music className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">DJ Tapes</span>
              </TabsTrigger>
              <TabsTrigger value="announcements" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <Megaphone className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">News</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <Database className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Videos</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : stats.activeChats}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    Real-time data
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Leads Today</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : stats.newLeads}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    Live updates
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : stats.ordersToday}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ₦{statsLoading ? '...' : (stats.totalRevenue / 100).toLocaleString()} revenue
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? '...' : stats.lowStock}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {stats.lowStock > 0 ? (
                      <>
                        <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                        Needs attention
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                        All good
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">New lead: Wedding DJ for Oct 15</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Order completed: Speaker rental</p>
                        <p className="text-xs text-muted-foreground">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">New chat session started</p>
                        <p className="text-xs text-muted-foreground">32 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => createQuickAction('announcement')}
                  >
                    <Megaphone className="h-4 w-4 mr-2" />
                    Create Announcement
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => createQuickAction('dj-tape')}
                  >
                    <Music className="h-4 w-4 mr-2" />
                    Upload DJ Tape
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => createQuickAction('blog')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    New Blog Post
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => createQuickAction('product')}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <ChatManager />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsManager />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          <TabsContent value="dj-tapes">
            <DJTapeManager />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementManager />
          </TabsContent>

          <TabsContent value="media">
            <MediaManager />
          </TabsContent>

          <TabsContent value="videos">
            <VideoManager />
          </TabsContent>

          <TabsContent value="settings">
            <ServicesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}