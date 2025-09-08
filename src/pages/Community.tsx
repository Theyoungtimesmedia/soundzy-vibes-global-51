import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, Plus, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export default function Community() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      await fetchPosts();
      setLoading(false);
    };

    getSession();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts' as any)
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data || []) as unknown as CommunityPost[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const createPost = async (formData: FormData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_posts' as any)
        .insert({
          user_id: user.id,
          title: formData.get('title') as string,
          content: formData.get('content') as string,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      setShowCreatePost(false);
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Community Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Soundzy Community</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow music lovers, share your experiences, and discover new sounds together.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">1,234</h3>
              <p className="text-muted-foreground">Community Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">456</h3>
              <p className="text-muted-foreground">Total Posts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-2xl font-bold">89</h3>
              <p className="text-muted-foreground">Active Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Post */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Community Posts</CardTitle>
              <Button onClick={() => setShowCreatePost(!showCreatePost)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          </CardHeader>
          {showCreatePost && (
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createPost(formData);
              }} className="space-y-4">
                <Input
                  name="title"
                  placeholder="Post title..."
                  required
                />
                <Textarea
                  name="content"
                  placeholder="What's on your mind?"
                  rows={4}
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit">Post</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreatePost(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share something with the community!
                </p>
                <Button onClick={() => setShowCreatePost(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={post.profiles?.avatar_url || ""} />
                      <AvatarFallback>
                        {post.profiles?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {post.profiles?.full_name || "Anonymous User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Badge variant="secondary">Community</Badge>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                      <Heart className="h-4 w-4 mr-2" />
                      {post.likes_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {post.comments_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Community Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Be respectful and kind to all community members</li>
              <li>• Share music-related content and experiences</li>
              <li>• No spam or self-promotion without permission</li>
              <li>• Report inappropriate content to moderators</li>
              <li>• Have fun and enjoy connecting with fellow music lovers!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}