import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

// Simplified email configuration using only standard options
const smtpConfig = {
  host: process.env.SMTP_HOST || "mail.crispai.ca",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // Use STARTTLS instead of SSL
  requireTLS: true, // Require TLS encryption
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_HOST_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_HOST_PASSWORD,
  },
  // Additional options for cPanel webserver email
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
    servername: process.env.SMTP_HOST || "mail.crispai.ca"
  }
};

console.log("SMTP Configuration:", {
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.secure,
  user: smtpConfig.auth.user,
  hasPassword: !!smtpConfig.auth.pass
});

// Create a single transporter instance for the application
const transporter = nodemailer.createTransport(smtpConfig);

// Test email connection with better error handling
const testConnection = async () => {
  try {
    console.log("Testing SMTP connection...");
    const result = await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
    ]);
    console.log("SMTP Connection Successful:", result);
  } catch (error) {
    console.error("SMTP Connection Error:", error);
    console.log("SMTP connection failed - emails will be attempted but may fail");
  }
};

// Test connection
testConnection();

async function sendRegistrationEmail(registration: any) {
  console.log("Attempting to send registration notification email...");
  
  const mailOptions = {
    from: process.env.ADMIN_EMAIL || "info@crispai.ca",
    to: process.env.ADMIN_EMAIL || "info@crispai.ca",
    subject: "New AI Elevate Challenge September 2025 Registration",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #17abe8;">New Registration for AI Elevate Challenge September 2025</h2>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Registration Details:</h3>
          <p><strong>Name:</strong> ${registration.name}</p>
          <p><strong>Email:</strong> ${registration.email}</p>
          ${registration.phone ? `<p><strong>Phone:</strong> ${registration.countryCode} ${registration.phone}</p>` : ''}
          <p><strong>Registered At:</strong> ${new Date(registration.registeredAt).toLocaleString()}</p>
          <p><strong>Agreed to Terms:</strong> ${registration.agreedToTerms ? 'Yes' : 'No'}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          This registration was submitted through the AI Elevate Challenge September 2025 landing page.
        </p>
      </div>
    `,
  };

  try {
    console.log("Sending registration notification email to:", mailOptions.to);
    await transporter.sendMail(mailOptions);
    console.log("Registration email sent successfully");
  } catch (error) {
    console.error("Failed to send registration email:", error);
    // Don't throw error - registration should complete even if email fails
  }
}

async function sendFreeConfirmationEmail(registration: any) {
  console.log("Attempting to send confirmation email to user:", registration.email);
  
  const mailOptions = {
    from: process.env.ADMIN_EMAIL || "info@crispai.ca",
    to: registration.email,
    subject: "Welcome to the AI Elevate Challenge!🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to the AI Elevate Challenge!</h1>
  </div>
  <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #8B5CF6;">Hi ${registration.name},</h2>
    <p>Welcome aboard! You're officially an attendee for the AI Elevate Challenge happening September 13th to 14th, and we couldn't be more excited to have you.</p>
    <p>This isn't just any challenge and you didn't just sign up. You made an intentional investment in your growth, and we're showing up for you every step of the way.</p>

    <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 20px; border-radius: 8px; margin: 20px 0; color: white;">
      <h3 style="margin-top: 0; text-align: center;">📅 Event Details:</h3>
      <p style="text-align: center;">
        <strong style="color: white;">🗓 Date: September 13th to 14th, 2025</strong>
      </p>
      <p style="text-align: center;">
        <strong style="color: white;">🕒 Time: 1:00 PM–4:00 PM EST</strong>
      </p>
      <div style="text-align: center; margin-top: 15px;">
        <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1" 
          style="background: white; color: #004aad; padding: 10px 20px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;" 
          target="_blank" rel="noopener noreferrer">
          Join Zoom Meeting
        </a>
      </div>
    </div>

    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <h3 style="margin-top: 0; color: #374151;">🎯 Join the community on WhatsApp</h3>
      <p>All real-time updates, community support, bonus links, and important announcements will be shared here:</p>
      <p>
        WhatsApp👉 <a href="https://chat.whatsapp.com/DsjZdRGrwOOK4PIdKOqX5M?mode=ac_t" style="color: #8B5CF6; font-weight: bold;">Join WhatsApp Group</a>
      </p>
    </div>

    <p>Need help or have questions? Just reply to this email or reach out to us at <a href="mailto:support@crispai.com" style="color: #17abe8;">support@crispai.com</a>.</p>
    <p>We can't wait to see what you build with AI.</p>
    <p>You're in for something amazing.</p>

    <p><strong>The Crisp AI Team</strong><br/>
    <a href="https://www.crispai.ca" style="color: #17abe8;">www.crispai.ca</a></p>
  </div>
</div>
    `,
  };

  try {
    console.log("Sending confirmation email to user:", registration.email);
    await transporter.sendMail(mailOptions);
    console.log("Free registration confirmation email sent successfully");
  } catch (error) {
    console.error("Failed to send free confirmation email:", error);
    // Don't throw error - registration should complete even if email fails
  }
}

// Create email schedules for reminder emails leading up to the event
async function createEmailSchedules(registrationId: number) {
  // Event date: September 13, 2025 at 1:00 PM EST
  const eventDate = new Date('2025-09-13T13:00:00-05:00'); // EST timezone
  
  const schedules = [
    { type: '7-days', days: 7 },
    { type: '3-days', days: 3 },
    { type: '2-days', days: 2 },
    { type: '1-day', days: 1 },
    { type: '10-minutes', days: 0, minutes: -10 }, // 10 minutes before
    { type: 'live', days: 0 }, // At event time
  ];

  try {
    for (const schedule of schedules) {
      const scheduledAt = new Date(eventDate);
      
      if (schedule.days > 0) {
        // Subtract days and set to 9 AM EST for reminder emails
        scheduledAt.setDate(scheduledAt.getDate() - schedule.days);
        scheduledAt.setHours(9, 0, 0, 0);
      } else if (schedule.minutes) {
        // Add minutes (negative for "before")
        scheduledAt.setMinutes(scheduledAt.getMinutes() + schedule.minutes);
      }
      // For 'live' type, keep the event time
      
      // Only schedule emails for future dates
      if (scheduledAt > new Date()) {
        await storage.createEmailSchedule({
          registrationId,
          emailType: schedule.type,
          scheduledAt,
          status: 'pending'
        });
        console.log(`Created ${schedule.type} email schedule for ${scheduledAt}`);
      }
    }
  } catch (error) {
    console.error('Error creating email schedules:', error);
    // Don't throw - registration should succeed even if scheduling fails
  }
}

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

  const httpServer = createServer(app);
  return httpServer;
}