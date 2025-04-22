import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import { Calendar, Clock, TrendingUp, Users, Loader2, ArrowRight } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialMediaStat } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function SocialMedia() {
  const { data: socialMediaStats, isLoading } = useQuery<SocialMediaStat[]>({
    queryKey: ['/api/social-media-stats'],
  });

  // GSAP animations
  useEffect(() => {
    if (!isLoading && socialMediaStats) {
      // Animate stat cards
      gsap.from(".social-card", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out"
      });

      // Animate platform stats
      gsap.from(".platform-stat", {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
        delay: 0.3,
        ease: "power2.out"
      });

      // Animate progress bars
      gsap.from(".progress-bar", {
        width: 0,
        duration: 1,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.inOut"
      });
    }
  }, [isLoading, socialMediaStats]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-dark">
      <Sidebar />
      
      <main className="main-content w-full lg:w-[calc(100%-260px)]">
        <Header title="Social Media" />
        
        <div className="px-6 py-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
                <TabsTrigger value="mentions">Mentions</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" /> Last 7 Days
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-1" /> Refresh
                </Button>
              </div>
            </div>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="social-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Followers</p>
                        <h3 className="text-2xl font-semibold mt-1">21.6K</h3>
                        <p className="text-xs text-success flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>+12.4% from last month</span>
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="social-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
                        <h3 className="text-2xl font-semibold mt-1">5.2%</h3>
                        <p className="text-xs text-success flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>+2.1% from last month</span>
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="social-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Post Reach</p>
                        <h3 className="text-2xl font-semibold mt-1">45.8K</h3>
                        <p className="text-xs text-success flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>+18.3% from last month</span>
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="social-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">New Followers</p>
                        <h3 className="text-2xl font-semibold mt-1">+842</h3>
                        <p className="text-xs text-success flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>+7.6% from last month</span>
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 flex items-center justify-center rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Platforms Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {socialMediaStats?.map((platform) => (
                        <div key={platform.id} className="platform-stat">
                          <div className="flex items-center mb-2">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                              platform.platform === 'Twitter' ? 'bg-blue-100' :
                              platform.platform === 'Instagram' ? 'bg-red-100' :
                              platform.platform === 'Facebook' ? 'bg-blue-100' : 
                              'bg-blue-100'
                            }`}>
                              <i className={`text-xl ${
                                platform.platform === 'Twitter' ? 'ri-twitter-fill text-blue-500' :
                                platform.platform === 'Instagram' ? 'ri-instagram-fill text-red-500' :
                                platform.platform === 'Facebook' ? 'ri-facebook-fill text-blue-600' :
                                platform.platform === 'LinkedIn' ? 'ri-linkedin-fill text-blue-700' :
                                'ri-global-line text-gray-500'
                              }`}></i>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">{platform.platform}</span>
                                <span className={`text-sm ${platform.growth.startsWith('+') ? 'text-success' : 'text-warning'}`}>
                                  {platform.growth}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>{platform.followers.toLocaleString()} followers</span>
                                <span>{platform.engagement}% engagement</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div 
                                  className={`progress-bar h-1.5 rounded-full ${
                                    platform.platform === 'Twitter' ? 'bg-blue-500' :
                                    platform.platform === 'Instagram' ? 'bg-red-500' :
                                    platform.platform === 'Facebook' ? 'bg-blue-600' :
                                    platform.platform === 'LinkedIn' ? 'bg-blue-700' :
                                    'bg-gray-500'
                                  }`} 
                                  style={{ width: `${platform.engagement}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full mt-4">
                        View Detailed Analytics <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Content Calendar and Recent Posts would go here */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="social-card">
                  <CardHeader>
                    <CardTitle>Content Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-lg font-medium mb-2">Plan Your Content</h3>
                      <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
                        Schedule and organize your social media posts across all platforms in one place.
                      </p>
                      <Button>Create Content Plan</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="social-card">
                  <CardHeader>
                    <CardTitle>Recent Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <h3 className="text-lg font-medium mb-2">Track Post Performance</h3>
                      <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
                        Monitor engagement, reach, and conversions for all your social media posts.
                      </p>
                      <Button>View Analytics</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Detailed analytics for all your social media platforms will be available here.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="scheduler">
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Content Scheduler Coming Soon</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Schedule and manage all your social media posts from one place.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="mentions">
              <div className="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">Mentions Feed Coming Soon</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Track and respond to all mentions of your brand across social platforms.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
