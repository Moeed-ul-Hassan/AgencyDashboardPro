import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { gsap } from "gsap";
import { Project } from "@shared/schema";
import { formatDate, getStatusColors, getTagColors } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { getAvatarUrl, generateInitialsAvatar } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export default function ProjectCard({ 
  project, 
  onDelete,
  showActions = false 
}: ProjectCardProps) {
  const [isAnimated, setIsAnimated] = useState(false);
  
  // Get project assignments to show team members
  const { data: assignments } = useQuery({
    queryKey: [`/api/projects/${project.id}/assignments`],
    enabled: !!project.id,
  });
  
  // GSAP hover animation
  const handleMouseEnter = (element: HTMLDivElement) => {
    if (!isAnimated) {
      gsap.to(element, {
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };
  
  const handleMouseLeave = (element: HTMLDivElement) => {
    if (!isAnimated) {
      gsap.to(element, {
        y: 0,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };
  
  const statusStyle = getStatusColors(project.status);
  
  return (
    <div 
      className="project-card border border-gray-100 rounded-lg p-5 hover:border-primary transition-all duration-300 bg-white"
      onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
      onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold mb-1">{project.title}</h4>
          <p className="text-sm text-gray-500 mb-3">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags && project.tags.map((tag, index) => {
              const tagStyle = getTagColors(tag);
              return (
                <span 
                  key={index} 
                  className={`px-2 py-1 ${tagStyle.bg} ${tagStyle.text} text-xs rounded-full`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className={`inline-block px-2.5 py-1 ${statusStyle.bg} ${statusStyle.text} text-xs rounded-full mb-2`}>
            {project.status}
          </span>
          
          {showActions && (
            <div className="flex space-x-1 mt-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit className="h-4 w-4 text-gray-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={() => onDelete && onDelete(project.id)}
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-medium">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <TooltipProvider>
          <div className="flex -space-x-2">
            {assignments && assignments.slice(0, 3).map((assignment: any, index: number) => (
              <Tooltip key={assignment.id}>
                <TooltipTrigger asChild>
                  <Avatar className="w-8 h-8 border-2 border-white">
                    <AvatarImage 
                      src={assignment.user.avatar || getAvatarUrl(assignment.user.name)} 
                      alt={assignment.user.name} 
                    />
                    <AvatarFallback>{generateInitialsAvatar(assignment.user.name)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{assignment.user.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            
            {assignments && assignments.length > 3 && (
              <Avatar className="w-8 h-8 border-2 border-white bg-gray-200">
                <AvatarFallback>+{assignments.length - 3}</AvatarFallback>
              </Avatar>
            )}
            
            {!assignments && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-xs text-gray-500">...</span>
              </div>
            )}
          </div>
        </TooltipProvider>
        
        <div className="text-sm text-gray-500 flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>Due: {formatDate(project.dueDate)}</span>
        </div>
      </div>
    </div>
  );
}
