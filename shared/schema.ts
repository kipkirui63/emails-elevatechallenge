import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  countryCode: text("country_code").default("+1"),
  agreedToTerms: boolean("agreed_to_terms").notNull().default(false),
  isVip: boolean("is_vip").notNull().default(false),
  stripePaymentId: text("stripe_payment_id"),
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const emailSchedules = pgTable("email_schedules", {
  id: serial("id").primaryKey(),
  registrationId: integer("registration_id").references(() => registrations.id),
  emailType: text("email_type").notNull(), // "7-days", "3-days", "2-days", "1-day", "10-minutes", "live", "custom"
  subject: text("subject"),
  html: text("html"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  sentAt: timestamp("sent_at"),
  status: text("status").notNull().default("pending"), // "pending", "sent", "failed"
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).pick({
  name: true,
  email: true,
  phone: true,
  countryCode: true,
  agreedToTerms: true,
  isVip: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
  isVip: z.boolean().default(false),
});

export const insertEmailScheduleSchema = createInsertSchema(emailSchedules).pick({
  registrationId: true,
  emailType: true,
  subject: true,
  html: true,
  scheduledAt: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertEmailSchedule = z.infer<typeof insertEmailScheduleSchema>;
export type EmailSchedule = typeof emailSchedules.$inferSelect;
