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
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
      
      <aside 
        className={`sidebar bg-white shadow-lg z-40 w-[260px] fixed h-full transition-all duration-300 lg:left-0 ${
          isMobileOpen ? "left-0" : "-left-[260px]"
        } lg:relative`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center mb-8 mt-2">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <h1 className="text-xl font-bold ml-2 font-poppins text-primary">AgencyDash</h1>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-1">
              <li className="sidebar-menu-item">
                <Link 
                  href="/" 
                  className={`flex items-center p-3 font-medium rounded-lg hover:bg-gray-100 ${
                    location === "/" ? "bg-light text-dark" : "text-gray-600"
                  }`}
                >
                  <i className={`ri-dashboard-line text-xl mr-3 ${location === "/" ? "text-primary" : "text-gray-500"}`}></i>
                  Dashboard
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link 
                  href="/projects" 
                  className={`flex items-center p-3 font-medium rounded-lg hover:bg-gray-100 ${
                    location === "/projects" ? "bg-light text-dark" : "text-gray-600"
                  }`}
                >
                  <i className={`ri-folder-line text-xl mr-3 ${location === "/projects" ? "text-primary" : "text-gray-500"}`}></i>
                  Projects
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link 
                  href="/team" 
                  className={`flex items-center p-3 font-medium rounded-lg hover:bg-gray-100 ${
                    location === "/team" ? "bg-light text-dark" : "text-gray-600"
                  }`}
                >
                  <i className={`ri-team-line text-xl mr-3 ${location === "/team" ? "text-primary" : "text-gray-500"}`}></i>
                  Team
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link 
                  href="/messages" 
                  className={`flex items-center p-3 font-medium rounded-lg hover:bg-gray-100 ${
                    location === "/messages" ? "bg-light text-dark" : "text-gray-600"
                  }`}
                >
                  <i className={`ri-message-3-line text-xl mr-3 ${location === "/messages" ? "text-primary" : "text-gray-500"}`}></i>
                  Messages
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link 
                  href="/social-media" 
                  className={`flex items-center p-3 font-medium rounded-lg hover:bg-gray-100 ${
                    location === "/social-media" ? "bg-light text-dark" : "text-gray-600"
                  }`}
                >
                  <i className={`ri-share-line text-xl mr-3 ${location === "/social-media" ? "text-primary" : "text-gray-500"}`}></i>
                  Social Media
                </Link>
              </li>
              <li className="sidebar-menu-item">
                <Link 
                  href="/settings" 
                  className={`flex items-center p-3 font-medium rounded-lg hover:bg-gray-100 ${
                    location === "/settings" ? "bg-light text-dark" : "text-gray-600"
                  }`}
                >
                  <i className={`ri-settings-line text-xl mr-3 ${location === "/settings" ? "text-primary" : "text-gray-500"}`}></i>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="mt-auto">
            <div className="p-4 bg-light rounded-lg mb-4">
              <div className="flex items-center">
                <i className="ri-rocket-line text-xl text-primary mr-3"></i>
                <span className="text-sm font-medium">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Get more features!</p>
              <Button size="sm" className="mt-2 w-full">Upgrade</Button>
            </div>
            
            <div className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded-lg" onClick={handleLogout}>
              <Avatar>
                <AvatarImage 
                  src={user?.avatar || getAvatarUrl(user?.name || "")} 
                  alt={user?.name || "User"} 
                />
                <AvatarFallback>{generateInitialsAvatar(user?.name || "")}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || "User"}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile toggle button - Rendered in Header component but keeping the state here */}
      <button 
        id="toggle-sidebar"
        className="lg:hidden fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg z-40"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <i className={`${isMobileOpen ? "ri-close-line" : "ri-menu-line"} text-xl`}></i>
      </button>
    </>
  );
}
