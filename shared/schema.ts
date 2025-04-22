import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("developer"),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
});

// Project model
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("planning"),
  progress: integer("progress").notNull().default(0),
  dueDate: text("due_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: integer("created_by").notNull(),
  tags: text("tags").array(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  status: true,
  progress: true,
  dueDate: true,
  createdBy: true,
  tags: true,
});

// Project assignments model
export const projectAssignments = pgTable("project_assignments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: integer("user_id").notNull(),
});

export const insertProjectAssignmentSchema = createInsertSchema(projectAssignments).pick({
  projectId: true,
  userId: true,
});

// Activity model
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  userId: integer("user_id"),
  projectId: integer("project_id"),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  title: true,
  description: true,
  type: true,
  userId: true,
  projectId: true,
});

// Social media stats model
export const socialMediaStats = pgTable("social_media_stats", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  followers: integer("followers").notNull(),
  engagement: integer("engagement").notNull(),
  growth: text("growth").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSocialMediaStatSchema = createInsertSchema(socialMediaStats).pick({
  platform: true,
  followers: true,
  engagement: true,
  growth: true,
});

// Team performance model
export const teamPerformance = pgTable("team_performance", {
  id: serial("id").primaryKey(),
  team: text("team").notNull(),
  performance: integer("performance").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertTeamPerformanceSchema = createInsertSchema(teamPerformance).pick({
  team: true,
  performance: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertProjectAssignment = z.infer<typeof insertProjectAssignmentSchema>;
export type ProjectAssignment = typeof projectAssignments.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertSocialMediaStat = z.infer<typeof insertSocialMediaStatSchema>;
export type SocialMediaStat = typeof socialMediaStats.$inferSelect;

export type InsertTeamPerformance = z.infer<typeof insertTeamPerformanceSchema>;
export type TeamPerformance = typeof teamPerformance.$inferSelect;
