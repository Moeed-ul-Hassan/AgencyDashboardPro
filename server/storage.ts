import {
  User,
  InsertUser,
  Project,
  InsertProject,
  ProjectAssignment,
  InsertProjectAssignment,
  Activity,
  InsertActivity,
  SocialMediaStat,
  InsertSocialMediaStat,
  TeamPerformance,
  InsertTeamPerformance
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Project methods
  getProject(id: number): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  getProjectsByCreator(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Project assignments methods
  assignUserToProject(assignment: InsertProjectAssignment): Promise<ProjectAssignment>;
  getProjectAssignments(projectId: number): Promise<ProjectAssignment[]>;
  getUserAssignments(userId: number): Promise<ProjectAssignment[]>;
  removeAssignment(id: number): Promise<boolean>;
  
  // Activity methods
  addActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(limit: number): Promise<Activity[]>;
  
  // Social media methods
  getSocialMediaStats(): Promise<SocialMediaStat[]>;
  addSocialMediaStat(stat: InsertSocialMediaStat): Promise<SocialMediaStat>;
  
  // Team performance methods
  getTeamPerformance(): Promise<TeamPerformance[]>;
  addTeamPerformance(performance: InsertTeamPerformance): Promise<TeamPerformance>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private projectAssignments: Map<number, ProjectAssignment>;
  private activities: Map<number, Activity>;
  private socialMediaStats: Map<number, SocialMediaStat>;
  private teamPerformances: Map<number, TeamPerformance>;
  
  sessionStore: session.SessionStore;
  
  private userIds: number;
  private projectIds: number;
  private assignmentIds: number;
  private activityIds: number;
  private socialMediaStatIds: number;
  private teamPerformanceIds: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.projectAssignments = new Map();
    this.activities = new Map();
    this.socialMediaStats = new Map();
    this.teamPerformances = new Map();
    
    this.userIds = 1;
    this.projectIds = 1;
    this.assignmentIds = 1;
    this.activityIds = 1;
    this.socialMediaStatIds = 1;
    this.teamPerformanceIds = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIds++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProjectsByCreator(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.createdBy === userId
    );
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIds++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: now
    };
    this.projects.set(id, project);
    return project;
  }
  
  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const existingProject = this.projects.get(id);
    if (!existingProject) return undefined;
    
    const updatedProject = { ...existingProject, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
  
  // Project assignments methods
  async assignUserToProject(insertAssignment: InsertProjectAssignment): Promise<ProjectAssignment> {
    const id = this.assignmentIds++;
    const assignment: ProjectAssignment = { ...insertAssignment, id };
    this.projectAssignments.set(id, assignment);
    return assignment;
  }
  
  async getProjectAssignments(projectId: number): Promise<ProjectAssignment[]> {
    return Array.from(this.projectAssignments.values()).filter(
      (assignment) => assignment.projectId === projectId
    );
  }
  
  async getUserAssignments(userId: number): Promise<ProjectAssignment[]> {
    return Array.from(this.projectAssignments.values()).filter(
      (assignment) => assignment.userId === userId
    );
  }
  
  async removeAssignment(id: number): Promise<boolean> {
    return this.projectAssignments.delete(id);
  }
  
  // Activity methods
  async addActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIds++;
    const now = new Date();
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      timestamp: now 
    };
    this.activities.set(id, activity);
    return activity;
  }
  
  async getRecentActivities(limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  // Social media methods
  async getSocialMediaStats(): Promise<SocialMediaStat[]> {
    return Array.from(this.socialMediaStats.values());
  }
  
  async addSocialMediaStat(insertStat: InsertSocialMediaStat): Promise<SocialMediaStat> {
    const id = this.socialMediaStatIds++;
    const now = new Date();
    const stat: SocialMediaStat = { 
      ...insertStat, 
      id, 
      timestamp: now 
    };
    this.socialMediaStats.set(id, stat);
    return stat;
  }
  
  // Team performance methods
  async getTeamPerformance(): Promise<TeamPerformance[]> {
    return Array.from(this.teamPerformances.values());
  }
  
  async addTeamPerformance(insertPerformance: InsertTeamPerformance): Promise<TeamPerformance> {
    const id = this.teamPerformanceIds++;
    const now = new Date();
    const performance: TeamPerformance = { 
      ...insertPerformance, 
      id, 
      timestamp: now 
    };
    this.teamPerformances.set(id, performance);
    return performance;
  }
  
  // Initialize sample data
  private async initializeSampleData() {
    // Add default team performance
    await this.addTeamPerformance({ team: 'Design Team', performance: 80 });
    await this.addTeamPerformance({ team: 'Dev Team', performance: 70 });
    await this.addTeamPerformance({ team: 'Marketing', performance: 90 });
    
    // Add default social media stats
    await this.addSocialMediaStat({ platform: 'Twitter', followers: 5200, engagement: 65, growth: '+12.6%' });
    await this.addSocialMediaStat({ platform: 'Instagram', followers: 8500, engagement: 82, growth: '+23.4%' });
    await this.addSocialMediaStat({ platform: 'Facebook', followers: 3800, engagement: 45, growth: '+4.2%' });
    await this.addSocialMediaStat({ platform: 'LinkedIn', followers: 4100, engagement: 58, growth: '+15.7%' });
  }
}

export const storage = new MemStorage();
