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
          document.querySelector('[value="announcements"]')?.click();
          toast({
            title: "Ready to create announcement",
            description: "Switched to announcements tab. Click 'Add Announcement' to create a new one.",
          });
          break;
        case 'dj-tape':
          document.querySelector('[value="dj-tapes"]')?.click();
          toast({
            title: "Ready to upload DJ tape",
            description: "Switched to DJ tapes tab. Click 'Add DJ Tape' to upload a new one.",
          });
          break;
        case 'blog':
          document.querySelector('[value="blog"]')?.click();
          toast({
            title: "Ready to create blog post",
            description: "Switched to blog tab. Click 'Add Blog Post' to create a new one.",
          });
          break;
        case 'product':
          document.querySelector('[value="products"]')?.click();
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
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-4">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">SWG Admin Console</h1>
            <Badge variant="secondary">{userRole}</Badge>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="leads">
              <Users className="h-4 w-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="products">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="blog">
              <FileText className="h-4 w-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="dj-tapes">
              <Music className="h-4 w-4 mr-2" />
              DJ Tapes
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Megaphone className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="settings">
            <ServicesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}