import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import { Loader2, Filter, Search } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl, generateInitialsAvatar } from "@/lib/utils";

export default function Team() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  // GSAP animations
  useEffect(() => {
    if (!isLoading && users) {
      gsap.from(".team-card", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(1.2)"
      });
    }
  }, [users, isLoading]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-dark">
      <Sidebar />
      
      <main className="main-content w-full lg:w-[calc(100%-260px)]">
        <Header title="Team" />
        
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full max-w-xs">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                className="pl-10 pr-4 py-2 w-full border rounded-lg text-sm"
                placeholder="Search team members..."
              />
            </div>
            <div className="flex space-x-2">
              <select className="border rounded-lg p-2 pr-8 text-sm appearance-none bg-white">
                <option>All Roles</option>
                <option>Developers</option>
                <option>Designers</option>
                <option>Project Managers</option>
              </select>
              <select className="border rounded-lg p-2 pr-8 text-sm appearance-none bg-white">
                <option>Sort by Name</option>
                <option>Sort by Role</option>
                <option>Sort by Projects</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users && users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id} className="team-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarImage src={user.avatar || getAvatarUrl(user.name)} alt={user.name} />
                        <AvatarFallback>{generateInitialsAvatar(user.name)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-sm text-gray-500 capitalize mb-3">{user.role}</p>
                      
                      <div className="flex space-x-2 mb-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'Developer'}
                        </span>
                      </div>
                      
                      <div className="w-full grid grid-cols-2 gap-4 mt-2">
                        <button className="bg-primary/10 text-primary text-sm py-1.5 rounded-lg font-medium hover:bg-primary/20 transition-colors">
                          Profile
                        </button>
                        <button className="bg-gray-100 text-gray-700 text-sm py-1.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                          Message
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-semibold mb-1">No team members found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
