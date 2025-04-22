import { useEffect } from "react";
import { gsap } from "gsap";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, Send } from "lucide-react";
import { getAvatarUrl, generateInitialsAvatar } from "@/lib/utils";

// Sample people for messages UI
const people = [
  { id: 1, name: "Sarah Johnson", role: "Designer", online: true, lastMessage: "Can you review the latest mockups?", time: "2m ago", unread: 3, avatar: "" },
  { id: 2, name: "Alex Morgan", role: "Project Manager", online: true, lastMessage: "Let's discuss the timeline for the new project", time: "1h ago", unread: 0, avatar: "" },
  { id: 3, name: "James Wilson", role: "Developer", online: false, lastMessage: "I've fixed the bug you reported", time: "5h ago", unread: 0, avatar: "" },
  { id: 4, name: "Emily Davis", role: "UX Designer", online: false, lastMessage: "Here's the user flow diagram you asked for", time: "1d ago", unread: 1, avatar: "" },
  { id: 5, name: "Michael Chen", role: "Backend Developer", online: true, lastMessage: "The API is now ready for integration", time: "2d ago", unread: 0, avatar: "" }
];

// Sample messages for the current conversation
const messages = [
  { id: 1, from: 1, text: "Hi there! Can you review the latest mockups I sent over?", time: "10:15 AM", isMe: false },
  { id: 2, from: 1, text: "I've made the changes we discussed yesterday", time: "10:16 AM", isMe: false },
  { id: 3, from: 0, text: "Good morning! Yes, I'll take a look at them right now.", time: "10:18 AM", isMe: true },
  { id: 4, from: 1, text: "Thanks! Let me know if you have any feedback.", time: "10:20 AM", isMe: false },
  { id: 5, from: 1, text: "Also, when do you think we can finalize the color palette?", time: "10:21 AM", isMe: false },
  { id: 6, from: 0, text: "I like what I see so far! The improvements to the navigation flow are great.", time: "10:25 AM", isMe: true },
  { id: 7, from: 0, text: "I think we can finalize the color palette by end of day. I just need to check a few more things with the brand guidelines.", time: "10:26 AM", isMe: true },
];

export default function Messages() {
  // GSAP animations
  useEffect(() => {
    // Animate contact list
    gsap.from(".contact-item", {
      x: -20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.out"
    });
    
    // Animate messages
    gsap.from(".message-item", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.3
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-dark">
      <Sidebar />
      
      <main className="main-content w-full lg:w-[calc(100%-260px)]">
        <Header title="Messages" />
        
        <div className="px-6 py-6 h-[calc(100vh-4rem)]">
          <Card className="h-full overflow-hidden">
            <Tabs defaultValue="messages">
              <div className="grid grid-cols-12 h-full">
                {/* Contacts Sidebar */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 border-r border-gray-200 h-full overflow-hidden flex flex-col">
                  <div className="p-4 border-b">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="messages">Messages</TabsTrigger>
                      <TabsTrigger value="contacts">Contacts</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input 
                        placeholder="Search messages" 
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <TabsContent value="messages" className="flex-1 overflow-y-auto p-0 m-0 data-[state=inactive]:hidden data-[state=active]:block">
                    <div className="divide-y">
                      {people.map((person) => (
                        <div key={person.id} className="contact-item p-4 hover:bg-gray-50 cursor-pointer relative">
                          <div className="flex items-center">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={person.avatar || getAvatarUrl(person.name)} alt={person.name} />
                                <AvatarFallback>{generateInitialsAvatar(person.name)}</AvatarFallback>
                              </Avatar>
                              {person.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                              )}
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-sm truncate">{person.name}</h4>
                                <span className="text-xs text-gray-500">{person.time}</span>
                              </div>
                              <p className="text-xs text-gray-500 truncate">{person.lastMessage}</p>
                            </div>
                          </div>
                          {person.unread > 0 && (
                            <span className="absolute top-4 right-4 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                              {person.unread}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="contacts" className="flex-1 overflow-y-auto p-0 m-0 data-[state=inactive]:hidden data-[state=active]:block">
                    <div className="divide-y">
                      {people.map((person) => (
                        <div key={person.id} className="contact-item p-4 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-center">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={person.avatar || getAvatarUrl(person.name)} alt={person.name} />
                                <AvatarFallback>{generateInitialsAvatar(person.name)}</AvatarFallback>
                              </Avatar>
                              {person.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                              )}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium text-sm">{person.name}</h4>
                              <p className="text-xs text-gray-500">{person.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </div>
                
                {/* Chat Area */}
                <div className="hidden md:flex md:col-span-8 lg:col-span-9 flex-col h-full">
                  {/* Chat header */}
                  <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={getAvatarUrl("Sarah Johnson")} alt="Sarah Johnson" />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <h3 className="font-medium">Sarah Johnson</h3>
                        <p className="text-xs text-green-500">Online</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="text-center">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">Today</span>
                    </div>
                    
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`message-item flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!message.isMe && (
                          <Avatar className="h-8 w-8 mr-2 flex-shrink-0 mt-1">
                            <AvatarImage src={getAvatarUrl("Sarah Johnson")} alt="Sarah Johnson" />
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[75%] ${message.isMe ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg`}>
                          <p className="text-sm">{message.text}</p>
                          <span className={`text-xs mt-1 block ${message.isMe ? 'text-primary-foreground/80' : 'text-gray-500'}`}>{message.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a1 1 0 112 0v4a5 5 0 01-10 0V7a5 5 0 0110 0v1.5a1.5 1.5 0 01-3 0V6a1 1 0 012 0v1.5A3.5 3.5 0 0114.5 11h1a1 1 0 110 2h-1a5.5 5.5 0 01-11 0V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </Button>
                      <Input 
                        className="flex-1" 
                        placeholder="Type your message here..." 
                      />
                      <Button className="flex-shrink-0">
                        <Send className="h-4 w-4 mr-1" /> Send
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Empty state for mobile */}
                <div className="col-span-12 md:hidden flex items-center justify-center h-64">
                  <div className="text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="font-medium text-gray-700">Your Messages</h3>
                    <p className="text-gray-500 text-sm mt-1">Select a conversation or start a new one</p>
                    <Button className="mt-4" size="sm">
                      <Edit className="h-4 w-4 mr-1" /> New Message
                    </Button>
                  </div>
                </div>
              </div>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}
