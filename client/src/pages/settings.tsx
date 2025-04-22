import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "gsap";
import { Save, User, Lock, Bell, Globe, Shield, Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvatarUrl, generateInitialsAvatar } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Password form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      avatar: user?.avatar || "",
      bio: "",
    },
  });
  
  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar || "",
        bio: "",
      });
    }
  }, [user, profileForm]);
  
  // GSAP animations
  useEffect(() => {
    // Animate settings cards
    gsap.from(".settings-card", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });
    
    // Animate form fields
    gsap.from(".form-field", {
      y: 10,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.3
    });
  }, [activeTab]);
  
  const onProfileSubmit = (data: ProfileFormValues) => {
    // In a real app, you would send an API request to update the profile
    // For this demo, we'll just show a success toast
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    console.log("Profile data:", data);
  };
  
  const onPasswordSubmit = (data: PasswordFormValues) => {
    // In a real app, you would send an API request to update the password
    // For this demo, we'll just show a success toast
    toast({
      title: "Password updated",
      description: "Your password has been successfully updated.",
    });
    console.log("Password data:", data);
    passwordForm.reset();
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50 text-dark">
      <Sidebar />
      
      <main className="main-content w-full lg:w-[calc(100%-260px)]">
        <Header title="Settings" />
        
        <div className="px-6 py-6">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
              <Card className="settings-card md:w-64 lg:w-72">
                <CardContent className="p-4">
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col items-center space-y-2 py-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.avatar || getAvatarUrl(user?.name || "")} alt={user?.name} />
                        <AvatarFallback>{generateInitialsAvatar(user?.name || "")}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-medium">{user?.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                      </div>
                    </div>
                    
                    <TabsList className="flex flex-col space-y-1 bg-transparent p-0">
                      <TabsTrigger 
                        value="profile" 
                        className="justify-start w-full px-3 py-2 text-left"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger 
                        value="password" 
                        className="justify-start w-full px-3 py-2 text-left"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Password
                      </TabsTrigger>
                      <TabsTrigger 
                        value="notifications" 
                        className="justify-start w-full px-3 py-2 text-left"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger 
                        value="appearance" 
                        className="justify-start w-full px-3 py-2 text-left"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Appearance
                      </TabsTrigger>
                      <TabsTrigger 
                        value="security" 
                        className="justify-start w-full px-3 py-2 text-left"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Security
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex-1">
                <TabsContent value="profile" className="mt-0">
                  <Card className="settings-card">
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>
                        Manage your profile information and preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                          <FormField
                            control={profileForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="form-field">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="form-field">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem className="form-field">
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="avatar"
                            render={({ field }) => (
                              <FormItem className="form-field">
                                <FormLabel>Avatar URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter avatar URL (optional)" {...field} />
                                </FormControl>
                                <FormDescription>
                                  You can use an external image URL or leave blank for default avatar.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem className="form-field">
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <textarea 
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                    placeholder="Tell us about yourself" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end pt-4 form-field">
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="password" className="mt-0">
                  <Card className="settings-card">
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem className="form-field">
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter current password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem className="form-field">
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter new password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem className="form-field">
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Confirm new password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end pt-4 form-field">
                            <Button type="submit">
                              <Save className="h-4 w-4 mr-2" />
                              Update Password
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <Card className="settings-card">
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>
                        Manage how and when you receive notifications.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between form-field">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between form-field">
                          <div>
                            <h4 className="font-medium">Project Updates</h4>
                            <p className="text-sm text-gray-500">Get notified about project changes</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between form-field">
                          <div>
                            <h4 className="font-medium">Team Mentions</h4>
                            <p className="text-sm text-gray-500">Notifications when you're mentioned</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between form-field">
                          <div>
                            <h4 className="font-medium">Social Media Activity</h4>
                            <p className="text-sm text-gray-500">Get alerts about social media engagement</p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between form-field">
                          <div>
                            <h4 className="font-medium">Marketing Updates</h4>
                            <p className="text-sm text-gray-500">Receive newsletter and product updates</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4 form-field">
                        <Button>
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appearance" className="mt-0">
                  <Card className="settings-card">
                    <CardHeader>
                      <CardTitle>Appearance Settings</CardTitle>
                      <CardDescription>
                        Customize how the dashboard looks and feels.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="form-field">
                          <h4 className="font-medium mb-2">Theme</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4 text-center cursor-pointer bg-white">
                              <div className="h-10 bg-gray-50 rounded mb-2"></div>
                              <span className="text-sm">Light</span>
                            </div>
                            <div className="border rounded-lg p-4 text-center cursor-pointer bg-gray-900 text-white">
                              <div className="h-10 bg-gray-800 rounded mb-2"></div>
                              <span className="text-sm">Dark</span>
                            </div>
                            <div className="border rounded-lg p-4 text-center cursor-pointer">
                              <div className="h-10 bg-gradient-to-r from-gray-50 to-gray-900 rounded mb-2"></div>
                              <span className="text-sm">System</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-field">
                          <h4 className="font-medium mb-2">Color Scheme</h4>
                          <Select defaultValue="indigo">
                            <SelectTrigger>
                              <SelectValue placeholder="Select color scheme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="indigo">Indigo (Default)</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="form-field">
                          <h4 className="font-medium mb-2">Font Size</h4>
                          <Select defaultValue="medium">
                            <SelectTrigger>
                              <SelectValue placeholder="Select font size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium (Default)</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center justify-between form-field">
                          <div>
                            <h4 className="font-medium">Reduce Animations</h4>
                            <p className="text-sm text-gray-500">Minimize UI animations</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4 form-field">
                        <Button>
                          <Save className="h-4 w-4 mr-2" />
                          Save Preferences
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <Card className="settings-card">
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage your account security and access preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between form-field">
                          <div>
                            <h4 className="font-medium">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-500">Add an extra layer of security</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Enable
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between form-field">
                          <div>
                            <h4 className="font-medium">Session Management</h4>
                            <p className="text-sm text-gray-500">Manage active sessions</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between form-field">
                          <div>
                            <h4 className="font-medium">Device History</h4>
                            <p className="text-sm text-gray-500">View recently used devices</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between form-field">
                          <div>
                            <h4 className="font-medium">Login Alerts</h4>
                            <p className="text-sm text-gray-500">Get notified about new logins</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                      
                      <div className="pt-4 form-field">
                        <Button variant="destructive">
                          Log Out from All Devices
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
