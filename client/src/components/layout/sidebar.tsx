import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { generateInitialsAvatar, getAvatarUrl } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar when route changes (mobile only)
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // GSAP animations
  useEffect(() => {
    gsap.from(".sidebar-menu-item", {
      x: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
      delay: 0.2
    });
    
    gsap.from(".sidebar-logo", {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
    });
    
    gsap.from(".profile-section", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      delay: 0.6,
      ease: "power2.out"
    });
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Menu items with icons and active states
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "ri-dashboard-3-line" },
    { path: "/projects", label: "Projects", icon: "ri-folder-shield-line" },
    { path: "/team", label: "Team", icon: "ri-team-line" },
    { path: "/messages", label: "Messages", icon: "ri-chat-3-line" },
    { path: "/social-media", label: "Social Media", icon: "ri-share-forward-line" },
    { path: "/settings", label: "Settings", icon: "ri-settings-3-line" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
      
      <aside 
        className={`fixed h-full transition-all duration-300 z-40 lg:left-0 ${
          isMobileOpen ? "left-0" : "-left-[280px]"
        } lg:relative`}
      >
        <div className="w-[280px] h-full flex flex-col bg-white shadow-xl border-r border-r-border/50 dark:bg-gray-900">
          <div className="flex justify-center py-6 sidebar-logo">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold ml-2 font-poppins gradient-heading">ZYLOX</h1>
            </div>
          </div>
          
          {/* Search bar */}
          <div className="px-5 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2.5 pl-10 pr-4 text-sm bg-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <i className="ri-search-line"></i>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Main Menu
            </div>
            <ul className="space-y-1.5">
              {menuItems.map((item) => (
                <li key={item.path} className="sidebar-menu-item">
                  <Link
                    href={item.path}
                    className={`sidebar-link ${location === item.path ? "active" : ""}`}
                  >
                    <i className={`${item.icon} text-xl mr-3.5`}></i>
                    <span>{item.label}</span>
                    {item.path === "/messages" && (
                      <span className="ml-auto bg-primary/90 text-white text-xs font-medium px-2 py-0.5 rounded-full">3</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2 mt-8">
              Resources
            </div>
            <ul className="space-y-1.5">
              <li className="sidebar-menu-item">
                <Link href="#" className="sidebar-link">
                  <i className="ri-question-line text-xl mr-3.5"></i>
                  <span>Help Center</span>
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link href="#" className="sidebar-link">
                  <i className="ri-file-text-line text-xl mr-3.5"></i>
                  <span>Documentation</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 profile-section">
            <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl mb-4">
              <div className="flex items-center">
                <i className="ri-rocket-line text-xl text-primary mr-3"></i>
                <span className="text-sm font-medium">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">Get more features and priority support!</p>
              <Button className="mt-3 w-full btn-gradient">Upgrade Now</Button>
            </div>
            
            <div 
              className="flex items-center p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage 
                  src={user?.avatar || getAvatarUrl(user?.name || "")} 
                  alt={user?.name || "User"} 
                />
                <AvatarFallback>{generateInitialsAvatar(user?.name || "")}</AvatarFallback>
              </Avatar>
              <div className="ml-3 truncate">
                <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || "User"}</p>
              </div>
              <i className="ri-logout-box-r-line ml-auto text-muted-foreground"></i>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile toggle button */}
      <button 
        id="toggle-sidebar"
        className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-primary to-accent text-white p-3.5 rounded-full shadow-lg z-40"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <i className={`${isMobileOpen ? "ri-close-line" : "ri-menu-line"} text-xl`}></i>
      </button>
    </>
  );
}
