import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const loginCredentials = pgTable("loginCredentials", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  rememberMe: boolean("rememberMe").default(false),
  createdAt: text("createdAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLoginCredentialsSchema = createInsertSchema(loginCredentials).pick({
  email: true,
  password: true,
  rememberMe: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLoginCredentials = z.infer<typeof insertLoginCredentialsSchema>;
export type LoginCredentials = typeof loginCredentials.$inferSelect;
