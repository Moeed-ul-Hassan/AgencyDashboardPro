import { useEffect, useState } from "react";
import { Bell, Sun, Moon, Search, Calendar, MessageSquare } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { generateInitialsAvatar, getAvatarUrl } from "@/lib/utils";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();
  
  // GSAP animations
  useEffect(() => {
    gsap.from(".header-element", {
      y: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would also toggle the actual theme
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-border/40 dark:bg-gray-900/80">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center max-w-[1920px] mx-auto">
        <div className="flex items-center header-element">
          <h1 className="text-xl font-bold font-poppins hidden sm:block">{title}</h1>
          <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded ml-3 hidden sm:block">
            April 22, 2025
          </span>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="btn-icon hidden md:flex btn-icon-secondary header-element"
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="btn-icon hidden md:flex btn-icon-secondary header-element"
          >
            <Calendar className="h-[1.2rem] w-[1.2rem]" />
          </Button>

          <div className="relative header-element hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-[220px] py-2 pl-10 pr-4 text-sm bg-secondary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="relative btn-icon btn-icon-primary header-element"
              >
                <Bell className="h-[1.2rem] w-[1.2rem]" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white dark:border-gray-900"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3, 4].map((i) => (
                  <DropdownMenuItem key={i} className="cursor-pointer py-2 px-3">
                    <div className="flex items-start">
                      <Avatar className="h-8 w-8 mr-3 mt-0.5">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">New project assigned</p>
                        <p className="text-xs text-muted-foreground">Ahmad assigned you to the Website redesign project</p>
                        <p className="text-xs text-muted-foreground mt-1">10 min ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center text-center text-primary font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="relative btn-icon btn-icon-primary header-element"
              >
                <MessageSquare className="h-[1.2rem] w-[1.2rem]" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-gray-900"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Messages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="cursor-pointer py-2 px-3">
                    <div className="flex items-start">
                      <Avatar className="h-8 w-8 mr-3 mt-0.5">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=person${i}`} />
                        <AvatarFallback>P{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Ahmad Raza</p>
                        <p className="text-xs text-muted-foreground">Can you review the latest mockups?</p>
                        <p className="text-xs text-muted-foreground mt-1">5 min ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center text-center text-primary font-medium">
                View all messages
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative ml-1 header-element h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage 
                    src={user?.avatar || getAvatarUrl(user?.name || "")}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>{generateInitialsAvatar(user?.name || "")}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
