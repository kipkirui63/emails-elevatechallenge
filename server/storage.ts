// server/storage.ts or shared/storage.ts
import { db } from "../db"; // adjust path as needed
import {
  users,
  registrations,
  emailSchedules,
  type InsertUser,
  type User,
  type InsertRegistration,
  type Registration,
  type InsertEmailSchedule,
  type EmailSchedule,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistration(id: number): Promise<Registration | undefined>;
  getRegistrationById(id: number): Promise<Registration | undefined>;
  getRegistrationByEmail(email: string): Promise<Registration | undefined>;
  getAllRegistrations(): Promise<Registration[]>;
  updateRegistrationToVip(id: number): Promise<Registration | undefined>;
  createEmailSchedule(schedule: InsertEmailSchedule): Promise<EmailSchedule>;
  getPendingEmailSchedules(): Promise<EmailSchedule[]>;
  updateEmailScheduleStatus(id: number, status: string, sentAt?: Date): Promise<void>;
  getRegistrationWithSchedules(registrationId: number): Promise<Registration | undefined>;
}

export class DbStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const [created] = await db.insert(registrations).values({
      ...insertRegistration,
      phone: insertRegistration.phone || null,
      countryCode: insertRegistration.countryCode || "+1",
      isVip: insertRegistration.isVip ?? false,
      stripePaymentId: null,
      registeredAt: new Date(),
    }).returning();
    return created;
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    const result = await db.select().from(registrations).where(eq(registrations.id, id));
    return result[0];
  }

  async getRegistrationById(id: number): Promise<Registration | undefined> {
    return this.getRegistration(id);
  }

  async getRegistrationByEmail(email: string): Promise<Registration | undefined> {
    const result = await db.select().from(registrations).where(eq(registrations.email, email));
    return result[0];
  }

  async getAllRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations);
  }

  async updateRegistrationToVip(id: number): Promise<Registration | undefined> {
    const [updated] = await db
      .update(registrations)
      .set({ isVip: true })
      .where(eq(registrations.id, id))
      .returning();
    return updated;
  }

  async createEmailSchedule(schedule: InsertEmailSchedule): Promise<EmailSchedule> {
    const [created] = await db.insert(emailSchedules).values(schedule).returning();
    return created;
  }

  async getPendingEmailSchedules(): Promise<EmailSchedule[]> {
    return await db.select().from(emailSchedules).where(eq(emailSchedules.status, "pending"));
  }

  async updateEmailScheduleStatus(id: number, status: string, sentAt?: Date): Promise<void> {
    await db
      .update(emailSchedules)
      .set({ status, sentAt })
      .where(eq(emailSchedules.id, id));
  }

  async getRegistrationWithSchedules(registrationId: number): Promise<Registration | undefined> {
    const result = await db.select().from(registrations).where(eq(registrations.id, registrationId));
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private registrations: Registration[] = [];
  private emailSchedules: EmailSchedule[] = [];
  private nextUserId = 1;
  private nextRegistrationId = 1;
  private nextEmailScheduleId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const created: User = {
      id: this.nextUserId++,
      username: user.username,
      password: user.password,
    };
    this.users.push(created);
    return created;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const created: Registration = {
      id: this.nextRegistrationId++,
      name: insertRegistration.name,
      email: insertRegistration.email,
      phone: insertRegistration.phone || null,
      countryCode: insertRegistration.countryCode || "+1",
      agreedToTerms: insertRegistration.agreedToTerms,
      isVip: insertRegistration.isVip ?? false,
      stripePaymentId: null,
      registeredAt: new Date(),
    };
    this.registrations.push(created);
    return created;
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    return this.registrations.find(r => r.id === id);
  }

  async getRegistrationById(id: number): Promise<Registration | undefined> {
    return this.getRegistration(id);
  }

  async getRegistrationByEmail(email: string): Promise<Registration | undefined> {
    return this.registrations.find(r => r.email === email);
  }

  async getAllRegistrations(): Promise<Registration[]> {
    return [...this.registrations];
  }

  async updateRegistrationToVip(id: number): Promise<Registration | undefined> {
    const registration = this.registrations.find(r => r.id === id);
    if (registration) {
      registration.isVip = true;
      return registration;
    }
    return undefined;
  }

  async createEmailSchedule(schedule: InsertEmailSchedule): Promise<EmailSchedule> {
    const created: EmailSchedule = {
      id: this.nextEmailScheduleId++,
      registrationId: schedule.registrationId || null,
      emailType: schedule.emailType,
      scheduledAt: schedule.scheduledAt,
      sentAt: null,
      status: schedule.status || "pending",
    };
    this.emailSchedules.push(created);
    return created;
  }

  async getPendingEmailSchedules(): Promise<EmailSchedule[]> {
    return this.emailSchedules.filter(s => s.status === "pending");
  }

  async updateEmailScheduleStatus(id: number, status: string, sentAt?: Date): Promise<void> {
    const schedule = this.emailSchedules.find(s => s.id === id);
    if (schedule) {
      schedule.status = status;
      if (sentAt) {
        schedule.sentAt = sentAt;
      }
    }
  }

  async getRegistrationWithSchedules(registrationId: number): Promise<Registration | undefined> {
    return this.registrations.find(r => r.id === registrationId);
  }
}

// Switch between storage implementations
// Use MemStorage for development/testing, DbStorage for production
export const storage = process.env.USE_MEMORY_STORAGE === 'true' 
  ? new MemStorage() 
  : new DbStorage();
