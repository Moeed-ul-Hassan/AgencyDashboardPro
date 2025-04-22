import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";

// Login schema
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // GSAP animations
  useEffect(() => {
    // Animate card
    gsap.from(".auth-card", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    // Animate form elements
    gsap.from(".form-item", {
      y: 15,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      delay: 0.3,
      ease: "power2.out"
    });

    // Animate hero content
    gsap.from(".hero-content", {
      x: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: "power2.out"
    });

    // Animate logo
    gsap.from(".logo", {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.5)"
    });
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="w-full auth-card">
          <Card className="w-full shadow-xl border-none bg-white rounded-xl overflow-hidden">
            <div className="bg-primary h-2 w-full"></div>
            <CardHeader className="pt-8 pb-0">
              <div className="flex items-center justify-center mb-6 logo">
                <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <h1 className="text-3xl font-bold ml-3 font-poppins text-primary">ZYLOX</h1>
              </div>
              <h2 className="text-2xl font-semibold text-center mb-2">Sign In</h2>
              <p className="text-gray-500 text-center mb-4">Access your ZYLOX dashboard</p>
            </CardHeader>
            <CardContent className="pt-4 px-8 pb-8">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="form-item">
                        <FormLabel className="text-gray-700">Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <Input 
                              placeholder="Enter your username" 
                              className="pl-10 py-6 bg-gray-50 border border-gray-200 focus:bg-white transition-colors" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="form-item">
                        <FormLabel className="text-gray-700">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Enter your password" 
                              className="pl-10 py-6 bg-gray-50 border border-gray-200 focus:bg-white transition-colors" 
                              {...field} 
                            />
                            <button 
                              type="button" 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-base font-medium shadow-lg form-item" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <span className="mr-2">Logging in</span>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500 mt-6">
                    <p>Use the credentials provided by your administrator</p>
                    <p>Default: username: moeed / password: secret</p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="hidden lg:block hero-content">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 font-poppins">
              Welcome to ZYLOX Agency
            </h1>
            <p className="text-lg text-gray-600">
              A powerful dashboard for digital agencies to manage projects, 
              track performance, and collaborate with team members.
            </p>
            <div className="space-y-5 mt-10">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Project Management</h3>
                  <p className="text-gray-600 mt-1">Easily create, assign, and track projects with your team</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Team Collaboration</h3>
                  <p className="text-gray-600 mt-1">Work efficiently with your team members and clients</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Social Media Integration</h3>
                  <p className="text-gray-600 mt-1">Track social media performance and analytics in one place</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
