import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gsap } from "gsap";
import { Plus, Filter, Loader2 } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import ProjectCard from "@/components/dashboard/project-card";
import ProjectForm from "@/components/projects/project-form";
import { Project } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Projects() {
  const { toast } = useToast();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Filter projects by search term and status
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Handle project deletion
  const handleDeleteProject = (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  // GSAP animations
  useEffect(() => {
    if (!isLoading && projects) {
      gsap.from(".project-card", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    }
  }, [projects, isLoading]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-dark">
      <Sidebar />
      
      <main className="main-content w-full lg:w-[calc(100%-260px)]">
        <Header title="Projects" />
        
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Input
                className="max-w-xs"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="relative">
                <select
                  className="border rounded-lg p-2 pr-8 text-sm appearance-none bg-white cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="in progress">In Progress</option>
                  <option value="in review">In Review</option>
                  <option value="completed">Completed</option>
                  <option value="on hold">On Hold</option>
                </select>
                <Filter className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
            </div>
            <Button onClick={() => setShowProjectForm(true)} className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-1" /> New Project
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProjects && filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  onDelete={() => handleDeleteProject(project.id)}
                  showActions
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold mb-1">No projects found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try changing your search or filter criteria" 
                  : "Get started by creating your first project"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button onClick={() => setShowProjectForm(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Create Project
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      {/* Project Form Dialog */}
      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm onSuccess={() => setShowProjectForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
