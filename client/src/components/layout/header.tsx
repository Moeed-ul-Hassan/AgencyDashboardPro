import { useEffect, useState } from "react";
import { Bell, MessageSquare, Search } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center header-element">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`relative transition-all duration-300 header-element ${isSearchExpanded ? 'w-48 md:w-64' : 'w-0 md:w-48'}`}>
            {(isSearchExpanded || window.innerWidth >= 768) && (
              <Input
                type="text"
                placeholder="Search..."
                className="bg-gray-100 rounded-full py-1.5 pl-10 pr-4 w-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            )}
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 cursor-pointer"
              onClick={toggleSearch}
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative p-1.5 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 header-element"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 header-element"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
