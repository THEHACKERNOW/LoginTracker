import { users, type User, type InsertUser, loginCredentials, type LoginCredentials, type InsertLoginCredentials } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  storeLoginCredentials(credentials: InsertLoginCredentials & { ipAddress?: string, userAgent?: string }): Promise<LoginCredentials>;
  getAllCredentials(): Promise<LoginCredentials[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private credentials: Map<number, LoginCredentials>;
  currentUserId: number;
  currentCredentialId: number;

  constructor() {
    this.users = new Map();
    this.credentials = new Map();
    this.currentUserId = 1;
    this.currentCredentialId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async storeLoginCredentials(insertCredentials: InsertLoginCredentials & { ipAddress?: string, userAgent?: string }): Promise<LoginCredentials> {
    const id = this.currentCredentialId++;
    const createdAt = new Date().toISOString();
    const credentials: LoginCredentials = { 
      ...insertCredentials, 
      id, 
      createdAt,
      ipAddress: insertCredentials.ipAddress || null,
      userAgent: insertCredentials.userAgent || null,
      rememberMe: insertCredentials.rememberMe || false
    };
    this.credentials.set(id, credentials);
    return credentials;
  }

  async getAllCredentials(): Promise<LoginCredentials[]> {
    return Array.from(this.credentials.values());
  }
}

export const storage = new MemStorage();
