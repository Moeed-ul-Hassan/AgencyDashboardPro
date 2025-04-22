import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import {
  insertProjectSchema,
  insertProjectAssignmentSchema,
  insertActivitySchema,
  insertSocialMediaStatSchema,
  insertTeamPerformanceSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve standalone.html for direct access
  app.get("/standalone.html", (req, res) => {
    res.sendFile(path.resolve("./standalone.html"));
  });
  
  // Set up authentication routes
  setupAuth(app);

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Error fetching projects" });
    }
  });
  
  app.get("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project" });
    }
  });
  
  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validData);
      
      // Create activity for new project
      await storage.addActivity({
        title: "New Project",
        description: `${project.title} project was created`,
        type: "project_created",
        userId: req.user.id,
        projectId: project.id
      });
      
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid project data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating project" });
      }
    }
  });
  
  app.put("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const updatedProject = await storage.updateProject(parseInt(req.params.id), req.body);
      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: "Error updating project" });
    }
  });
  
  app.delete("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const result = await storage.deleteProject(parseInt(req.params.id));
      if (!result) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Error deleting project" });
    }
  });
  
  // Project assignments routes
  app.post("/api/assignments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const validData = insertProjectAssignmentSchema.parse(req.body);
      const assignment = await storage.assignUserToProject(validData);
      
      // Get user name for activity
      const user = await storage.getUser(validData.userId);
      const project = await storage.getProject(validData.projectId);
      
      if (user && project) {
        await storage.addActivity({
          title: "Team Member Assigned",
          description: `${user.name} was assigned to ${project.title}`,
          type: "user_assigned",
          userId: req.user.id,
          projectId: project.id
        });
      }
      
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating assignment" });
      }
    }
  });
  
  app.get("/api/projects/:id/assignments", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const assignments = await storage.getProjectAssignments(parseInt(req.params.id));
      
      // Get full user details for each assignment
      const assignmentsWithUsers = await Promise.all(
        assignments.map(async (assignment) => {
          const user = await storage.getUser(assignment.userId);
          return {
            ...assignment,
            user
          };
        })
      );
      
      res.json(assignmentsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching project assignments" });
    }
  });
  
  // Activity routes
  app.get("/api/activities", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getRecentActivities(limit);
      
      // Enrich activities with user and project data
      const enrichedActivities = await Promise.all(
        activities.map(async (activity) => {
          const user = activity.userId ? await storage.getUser(activity.userId) : null;
          const project = activity.projectId ? await storage.getProject(activity.projectId) : null;
          
          return {
            ...activity,
            user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
            project: project ? { id: project.id, title: project.title } : null
          };
        })
      );
      
      res.json(enrichedActivities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching activities" });
    }
  });
  
  // Social media routes
  app.get("/api/social-media-stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const stats = await storage.getSocialMediaStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching social media stats" });
    }
  });
  
  // Team performance routes
  app.get("/api/team-performance", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const performance = await storage.getTeamPerformance();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Error fetching team performance data" });
    }
  });
  
  // Users route
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const users = await storage.getAllUsers();
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
