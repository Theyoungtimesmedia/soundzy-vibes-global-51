import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, MessageCircle, Heart, Settings, LogOut, Camera, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  username?: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  bio?: string | null;
  location?: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

interface UserProfileProps {
  user: SupabaseUser;
  onSignOut: () => void;
}

export function UserProfile({ user, onSignOut }: UserProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, [user.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data as Profile);
      } else {
        // Create a basic profile if none exists
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: user.user_metadata?.full_name || null,
            email: user.email,
          })
          .select('*')
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          setProfile(newProfile as Profile);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...updates,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || "User";
  const displayEmail = profile?.email || user.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Enhanced Profile Header */}
        <Card className="mb-8 overflow-hidden border-0 shadow-hero">
          <div className="h-32 bg-gradient-primary"></div>
          <CardContent className="p-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-primary text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 rounded-full h-10 w-10 p-0 shadow-md"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {displayName}
                </h1>
                <p className="text-muted-foreground mb-2 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  {displayEmail}
                </p>
                {profile?.phone && (
                  <p className="text-muted-foreground mb-2 flex items-center justify-center md:justify-start gap-2">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </p>
                )}
                {profile?.location && (
                  <p className="text-muted-foreground mb-4 flex items-center justify-center md:justify-start gap-2">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                    {profile?.role || "Member"}
                  </Badge>
                  <Badge variant="outline" className="border-green-200 text-green-600">
                    Verified
                  </Badge>
                  <Badge variant="outline">
                    Member since {new Date(profile?.created_at || user.created_at).getFullYear()}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" size="sm" onClick={onSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Profile Tabs */}
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  updateProfile({
                    full_name: formData.get('full_name') as string,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string,
                    ...(profile?.username !== undefined && { username: formData.get('username') as string }),
                    ...(profile?.bio !== undefined && { bio: formData.get('bio') as string }),
                    ...(profile?.location !== undefined && { location: formData.get('location') as string }),
                  });
                }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {profile?.username !== undefined && (
                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            defaultValue={profile?.username || ""}
                            placeholder="Choose a unique username"
                          />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          defaultValue={profile?.full_name || ""}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          defaultValue={profile?.email || ""}
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          defaultValue={profile?.phone || ""}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {profile?.location !== undefined && (
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            defaultValue={profile?.location || ""}
                            placeholder="Enter your location"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {profile?.bio !== undefined && (
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        defaultValue={profile?.bio || ""}
                        placeholder="Tell us about yourself..."
                        className="resize-none"
                      />
                    </div>
                  )}
                  
                  <Separator />
                  
                  <Button type="submit" disabled={updating} className="w-full md:w-auto">
                    {updating ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <p className="font-medium">Privacy Settings</p>
                      <p className="text-sm text-muted-foreground">Manage your data and privacy</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">Account Security</p>
                      <p className="text-sm text-muted-foreground">Password and security settings</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Security
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}