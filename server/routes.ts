import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";
import { sendRegistrationEmail, sendFreeConfirmationEmail } from "./mailer";
import { createEmailSchedules, processScheduledEmails } from "./schedule-email";
import { emailScheduler } from "./scheduler";

export async function registerRoutes(app: Express): Promise<Server> {
  // Registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
      console.log("=== REGISTRATION REQUEST START ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      // Validate request body
      const validatedData = insertRegistrationSchema.parse(req.body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));

      // Check if email already exists
      console.log("Checking for existing email:", validatedData.email);
      const existingRegistration = await storage.getRegistrationByEmail(validatedData.email);
      if (existingRegistration) {
        console.log("Email already exists:", validatedData.email);
        return res.status(400).json({ 
          message: "This email is already registered for the summit" 
        });
      }

      // Create registration
      console.log("Creating registration in database...");
      const registration = await storage.createRegistration(validatedData);
      console.log("Registration created:", JSON.stringify(registration, null, 2));

      // Create email schedules for reminder emails
      console.log("Creating email schedules...");
      await createEmailSchedules(registration.id);

      // Send emails sequentially with better error handling
      console.log("Sending emails...");
      
      try {
        await sendRegistrationEmail(registration);
      } catch (error) {
        console.error("Registration notification email failed:", error);
      }
      
      try {
        await sendFreeConfirmationEmail(registration);
      } catch (error) {
        console.error("User confirmation email failed:", error);
      }

      console.log("=== REGISTRATION REQUEST SUCCESS ===");
      res.status(201).json({ 
        message: "Registration successful!", 
        registration: {
          id: registration.id,
          name: registration.name,
          email: registration.email
        }
      });
    } catch (error) {
      console.error("=== REGISTRATION REQUEST ERROR ===");
      console.error("Error details:", error);
      
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }

      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get registration stats
  app.get("/api/registrations/stats", async (req, res) => {
    try {
      const stats = await storage.getAllRegistrations();
      res.json(stats);
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // New endpoint for Google Sheets to fetch data
  app.get("/api/registrations/export", async (req, res) => {
    try {
      const registrations = await storage.getAllRegistrations();
      res.json({ registrations });
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Background job endpoint to process pending email schedules
  app.post("/api/emails/process-scheduled", async (req, res) => {
    try {
      const result = await processScheduledEmails();
      res.json(result);
    } catch (error) {
      console.error("Email processing error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Scheduler management endpoints
  app.get("/api/scheduler/status", (req, res) => {
    try {
      const status = emailScheduler.getStatus();
      res.json(status);
    } catch (error) {
      console.error("Scheduler status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/scheduler/run-now", async (req, res) => {
    try {
      const result = await emailScheduler.runNow();
      res.json(result);
    } catch (error) {
      console.error("Manual scheduler run error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}