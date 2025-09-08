import { transporter } from "./mailer";
import { storage } from "./storage";
import { type Registration } from "@shared/schema";

// Send scheduled emails based on email type
export async function sendScheduledEmail(emailType: string, registration: Registration) {
  const baseMailOptions = {
    from: process.env.ADMIN_EMAIL || "info@crispai.ca",
    to: registration.email,
  };

  switch (emailType) {
    case '7-days':
      await transporter.sendMail({
        ...baseMailOptions,
        subject: "🚀 AI Elevate Challenge starts in 7 days - Get ready!",
        html: getWeekReminderTemplate(registration.name)
      });
      break;

    case '3-days':
      await transporter.sendMail({
        ...baseMailOptions,
        subject: "🎯 Final preparations - AI Elevate Challenge in 3 days!",
        html: getThreeDayReminderTemplate(registration.name)
      });
      break;

    case '2-days':
      await transporter.sendMail({
        ...baseMailOptions,
        subject: "⏰ Almost here - AI Elevate Challenge in 2 days!",
        html: getTwoDayReminderTemplate(registration.name)
      });
      break;

    case '1-day':
      await transporter.sendMail({
        ...baseMailOptions,
        subject: "🔥 Tomorrow's the day - AI Elevate Challenge!",
        html: getOneDayReminderTemplate(registration.name)
      });
      break;

    case '10-minutes':
      await transporter.sendMail({
        ...baseMailOptions,
        subject: "🎬 STARTING NOW - Join the AI Elevate Challenge!",
        html: getTenMinuteReminderTemplate(registration.name)
      });
      break;

    case 'live':
      await transporter.sendMail({
        ...baseMailOptions,
        subject: "🔴 LIVE NOW - AI Elevate Challenge has started!",
        html: getLiveReminderTemplate(registration.name)
      });
      break;

    default:
      throw new Error(`Unknown email type: ${emailType}`);
  }
}

// Create email schedules for reminder emails leading up to the event
export async function createEmailSchedules(registrationId: number) {
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

// Process pending scheduled emails
export async function processScheduledEmails() {
  try {
    console.log("=== PROCESSING SCHEDULED EMAILS ===");
    
    // Get pending email schedules that are due to be sent
    const pendingSchedules = await storage.getPendingEmailSchedules();
    const now = new Date();
    const dueSchedules = pendingSchedules.filter(schedule => 
      new Date(schedule.scheduledAt) <= now
    );

    console.log(`Found ${dueSchedules.length} emails due to be sent`);

    let sent = 0;
    let failed = 0;

    for (const schedule of dueSchedules) {
      try {
        // Get the registration details
        const registration = await storage.getRegistrationById(schedule.registrationId!);
        if (!registration) {
          console.error(`Registration not found for schedule ${schedule.id}`);
          await storage.updateEmailScheduleStatus(schedule.id, 'failed', now);
          failed++;
          continue;
        }

        // Send the appropriate email based on type
        await sendScheduledEmail(schedule.emailType, registration);
        
        // Update schedule as sent
        await storage.updateEmailScheduleStatus(schedule.id, 'sent', now);
        sent++;
        
        console.log(`Sent ${schedule.emailType} email to ${registration.email}`);
      } catch (error) {
        console.error(`Failed to send ${schedule.emailType} email to registration ${schedule.registrationId}:`, error);
        await storage.updateEmailScheduleStatus(schedule.id, 'failed', now);
        failed++;
      }
    }

    console.log(`=== EMAIL PROCESSING COMPLETE: ${sent} sent, ${failed} failed ===`);
    return { processed: dueSchedules.length, sent, failed };
  } catch (error) {
    console.error("Email processing error:", error);
    throw error;
  }
}

// Email templates for different reminder types
function getWeekReminderTemplate(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">7 Days to Go! 🚀</h1>
      </div>
      <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #8B5CF6;">Hi ${name},</h2>
        <p>Can you believe it? The <strong>AI Elevate Challenge</strong> is just one week away!</p>
        <p>🗓 <strong>September 13-14, 2025</strong><br/>
        ⏰ <strong>1:00 PM–4:00 PM EST</strong></p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">🎯 What to expect:</h3>
          <ul>
            <li>Hands-on AI development workshop</li>
            <li>Network with fellow innovators</li>
            <li>Build real AI applications</li>
            <li>Win amazing prizes</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://chat.whatsapp.com/DsjZdRGrwOOK4PIdKOqX5M?mode=ac_t" 
            style="background: #25d366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            Join WhatsApp Community 💬
          </a>
        </div>

        <p>Start preparing your ideas - something amazing is coming!</p>
        <p><strong>The Crisp AI Team</strong></p>
      </div>
    </div>
  `;
}

function getThreeDayReminderTemplate(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">3 Days Left! 🎯</h1>
      </div>
      <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #8B5CF6;">Hi ${name},</h2>
        <p>The countdown is on! Only <strong>3 days</strong> until the AI Elevate Challenge begins.</p>
        
        <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 20px; border-radius: 8px; margin: 20px 0; color: white; text-align: center;">
          <h3 style="margin-top: 0;">📅 Final Details:</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> September 13-14, 2025</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> 1:00 PM–4:00 PM EST</p>
          <div style="margin-top: 15px;">
            <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1" 
              style="background: white; color: #004aad; padding: 10px 20px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Save Zoom Link 🔗
            </a>
          </div>
        </div>

        <p>Make sure you're ready to innovate and create something incredible!</p>
        <p><strong>The Crisp AI Team</strong></p>
      </div>
    </div>
  `;
}

function getTwoDayReminderTemplate(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">48 Hours! ⏰</h1>
      </div>
      <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #8B5CF6;">Hi ${name},</h2>
        <p>We're so close now! Just <strong>2 days</strong> until the AI Elevate Challenge!</p>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e;">⚡ Quick Checklist:</h3>
          <ul style="color: #92400e;">
            <li>✅ Test your internet connection</li>
            <li>✅ Update your development environment</li>
            <li>✅ Join our WhatsApp group for updates</li>
            <li>✅ Block your calendar for Saturday</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1" 
            style="background: #17abe8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 5px;">
            Join Zoom Meeting 🎥
          </a>
          <a href="https://chat.whatsapp.com/DsjZdRGrwOOK4PIdKOqX5M?mode=ac_t" 
            style="background: #25d366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 5px;">
            WhatsApp Group 💬
          </a>
        </div>

        <p>The anticipation is building - see you soon!</p>
        <p><strong>The Crisp AI Team</strong></p>
      </div>
    </div>
  `;
}

function getOneDayReminderTemplate(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 32px;">TOMORROW! 🔥</h1>
      </div>
      <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #dc2626;">Hi ${name},</h2>
        <p style="font-size: 18px;"><strong>Tomorrow is the day!</strong> The AI Elevate Challenge starts in less than 24 hours!</p>
        
        <div style="background: #fef2f2; border: 2px solid #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #dc2626; text-align: center;">🚨 FINAL REMINDER 🚨</h3>
          <p style="text-align: center; margin: 10px 0; font-size: 18px;"><strong>September 13, 2025</strong></p>
          <p style="text-align: center; margin: 10px 0; font-size: 18px;"><strong>1:00 PM EST</strong></p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1" 
              style="background: #dc2626; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 18px;">
              🔗 JOIN ZOOM TOMORROW
            </a>
          </div>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #15803d;">💡 Last minute prep:</h4>
          <ul style="color: #15803d;">
            <li>Get a good night's sleep</li>
            <li>Prepare your workspace</li>
            <li>Have snacks and water ready</li>
            <li>Bring your A-game attitude!</li>
          </ul>
        </div>

        <p style="font-size: 16px;">We can't wait to see the incredible AI solutions you'll build tomorrow!</p>
        <p><strong>The Crisp AI Team</strong><br/>
        <em>See you tomorrow at 1 PM EST! 🚀</em></p>
      </div>
    </div>
  `;
}

function getTenMinuteReminderTemplate(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(45deg, #dc2626, #f59e0b, #10b981, #3b82f6, #8b5cf6); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 36px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">STARTING NOW! 🎬</h1>
      </div>
      <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #dc2626; text-align: center;">Hi ${name},</h2>
        <p style="text-align: center; font-size: 20px; font-weight: bold;">The AI Elevate Challenge is starting RIGHT NOW!</p>
        
        <div style="background: #b91c1c; color: white; padding: 30px; border-radius: 8px; margin: 30px 0; text-align: center;">
          <h2 style="margin: 0 0 20px 0; font-size: 24px;">🚨 JOIN IMMEDIATELY 🚨</h2>
          <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1" 
            style="background: white; color: #b91c1c; padding: 20px 50px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 20px; display: inline-block;">
            🔴 CLICK TO JOIN NOW
          </a>
        </div>

        <p style="text-align: center; font-size: 18px;">Don't miss a second - your AI journey starts now!</p>
        <p style="text-align: center;"><strong>The Crisp AI Team</strong></p>
      </div>
    </div>
  `;
}

function getLiveReminderTemplate(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(45deg, #dc2626, #f59e0b); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 36px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🔴 LIVE NOW!</h1>
      </div>
      <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #dc2626; text-align: center;">Hi ${name},</h2>
        <p style="text-align: center; font-size: 22px; font-weight: bold;">The AI Elevate Challenge is LIVE and happening right now!</p>
        
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 40px; border-radius: 12px; margin: 30px 0; text-align: center;">
          <h2 style="margin: 0 0 25px 0; font-size: 28px;">⚡ HAPPENING NOW ⚡</h2>
          <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1" 
            style="background: white; color: #dc2626; padding: 25px 60px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 22px; display: inline-block; box-shadow: 0 8px 16px rgba(0,0,0,0.2);">
            🚀 JOIN THE LIVE EVENT
          </a>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-weight: bold;">🎯 What's happening right now:</p>
          <ul style="color: #92400e;">
            <li>Live AI development workshop</li>
            <li>Interactive challenges and prizes</li>
            <li>Networking with AI enthusiasts</li>
            <li>Real-time support and guidance</li>
          </ul>
        </div>

        <p style="text-align: center; font-size: 18px;">Jump in - the innovation is already underway!</p>
        <p style="text-align: center;"><strong>The Crisp AI Team</strong><br/>
        <em>We're live and waiting for you! 🔥</em></p>
      </div>
    </div>
  `;
}