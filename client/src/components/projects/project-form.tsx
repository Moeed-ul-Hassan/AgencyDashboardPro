import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap } from "gsap";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { insertProjectSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Extend the project schema with additional validation
const projectFormSchema = insertProjectSchema.extend({
  // Ensure the title is at least 3 characters
  title: z.string().min(3, "Title must be at least 3 characters"),
  // Ensure the description is at least 10 characters
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  onSuccess?: () => void;
}

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Initialize form with default values
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "planning",
      progress: 0,
      dueDate: "",
      createdBy: user?.id || 0,
      tags: [],
    },
  });
  
  // Update createdBy when user changes
  useEffect(() => {
    if (user) {
      form.setValue("createdBy", user.id);
    }
  }, [user, form]);
  
  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      // Convert tags string to array
      const tagsValue = form.getValues("tags");
      const formattedData = {
        ...data,
        tags: typeof tagsValue === "string" ? tagsValue.split(",").map(tag => tag.trim()) : tagsValue,
      };
      
      const res = await apiRequest("POST", "/api/projects", formattedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project created",
        description: "The project has been successfully created.",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create project: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: ProjectFormData) => {
    createProjectMutation.mutate(data);
  };
  
  // GSAP animations
  useEffect(() => {
    gsap.from(".form-field", {
      y: 10,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out"
    });
  }, []);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="form-field">
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="form-field">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter project description" 
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="form-field">
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="in review">In Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="progress"
            render={({ field }) => (
              <FormItem className="form-field">
                <FormLabel>Progress (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    placeholder="Enter progress percentage" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="form-field">
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="form-field">
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Design, Frontend, Mobile" 
                    {...field}
                    onChange={(e) => {
                      const tagsArray = e.target.value.split(",").map(tag => tag.trim());
                      field.onChange(tagsArray);
                    }}
                    value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 form-field">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              form.reset();
              if (onSuccess) onSuccess();
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createProjectMutation.isPending}
          >
            {createProjectMutation.isPending ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
