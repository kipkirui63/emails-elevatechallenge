import "dotenv/config";
import { transporter } from "./mailer";
import { storage } from "./storage";
import { type Registration } from "@shared/schema";

// Email definitions - define your emails directly here
const EMAIL_SCHEDULES = [
  {
    emailType: "5-days-reminder",
    subject: "⏳ Imagine Compressing Months of Work Into Days… In Just 5 Days You'll See How",
    html: `
<p>Hi {{name}},</p>

<p>Imagine this for a second…<br>
You've got a big project that normally takes months of research and back-and-forth. Instead of slogging through it, you have an AI tool that does the heavy lifting, compressing months of effort into just a few days (sometimes hours).</p>

<p>This is exactly what we'll start building together inside the AI Elevate Challenge, kicking off in just 5 days! 🚀</p>

<h3>Here's what to do right now so you don't miss it:</h3>
<ul>
  <li>✅ <strong>Save the Dates</strong><br/>
      🗓 September 13–14, 2025<br/>
      🕒 1–4 PM ET Daily<br/>
      📍 Live on Zoom (with replays)<br/>
      👉 <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1">Add to Calendar</a>
  </li>
  <li>✅ <strong>Join the WhatsApp Community</strong><br/>
      Stay plugged in for reminders, bonus drops, and support.<br/>
      👉 <a href="https://chat.whatsapp.com/IX9zZ5uuaLy1tvHoNRTwJh?mode=ems_copy_t">Join the Community</a>
  </li>
  <li>✅ <strong>Share with a friend</strong><br/>
      👉 <a href="https://aielevatechallenge.crispai.ca">Share the registration link</a>
  </li>
</ul>

<p>This is your time to lead with AI.<br/>
See you in 5 days,<br/>
<strong>The Crisp AI Team</strong></p>

<hr/>
<p><strong>Quick links</strong><br/>
Zoom (add to calendar): <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1">Join / Add</a><br/>
WhatsApp community: <a href="https://chat.whatsapp.com/IX9zZ5uuaLy1tvHoNRTwJh?mode=ems_copy_t">Join here</a><br/>
Registration: <a href="https://aielevatechallenge.crispai.ca">aielevatechallenge.crispai.ca</a></p>
    `,
    scheduledAt: new Date("2025-09-08T15:45:00.000Z"), // 5 days before event
    sendToAll: true // null registrationId = send to all
  },
  {
    emailType: "7-days",
    subject: "🚀 AI Elevate Challenge starts in 7 days - Get ready!",
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">7 Days to Go! 🚀</h1>
  </div>
  <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #8B5CF6;">Hi {{name}},</h2>
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
    `,
    scheduledAt: new Date('2025-09-06T13:00:00-05:00'), // 7 days before event at 9 AM EST
    sendToAll: false // Send to individual registrations
  },
  {
    emailType: "3-days",
    subject: "🎯 Final preparations - AI Elevate Challenge in 3 days!",
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">3 Days Left! 🎯</h1>
  </div>
  <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #8B5CF6;">Hi {{name}},</h2>
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
    `,
    scheduledAt: new Date('2025-09-10T13:00:00-05:00'), // 3 days before event at 9 AM EST
    sendToAll: false
  },
  {
    emailType: "1-day",
    subject: "🔥 Tomorrow's the day - AI Elevate Challenge!",
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 32px;">TOMORROW! 🔥</h1>
  </div>
  <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h2 style="color: #dc2626;">Hi {{name}},</h2>
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

    <p style="font-size: 16px;">We can't wait to see the incredible AI solutions you'll build tomorrow!</p>
    <p><strong>The Crisp AI Team</strong><br/>
    <em>See you tomorrow at 1 PM EST! 🚀</em></p>
  </div>
</div>
    `,
    scheduledAt: new Date('2025-09-12T13:00:00-05:00'), // 1 day before event at 9 AM EST
    sendToAll: false
  }
];

// Create email schedules from the definitions above
export async function createEmailSchedules(registrationId: number) {
  try {
    for (const emailDef of EMAIL_SCHEDULES) {
      // Only schedule emails for future dates
      if (emailDef.scheduledAt > new Date()) {
        await storage.createEmailSchedule({
          registrationId: emailDef.sendToAll ? null : registrationId,
          emailType: emailDef.emailType,
          subject: emailDef.subject,
          html: emailDef.html,
          scheduledAt: emailDef.scheduledAt,
          status: 'pending'
        });
        console.log(`Created ${emailDef.emailType} email schedule for ${emailDef.scheduledAt}`);
      }
    }
  } catch (error) {
    console.error('Error creating email schedules:', error);
    // Don't throw - registration should succeed even if scheduling fails
  }
}

// Create a custom email schedule (like your example)
export async function createCustomEmailSchedule(
  emailType: string,
  subject: string, 
  html: string,
  scheduledAt: Date,
  sendToAll: boolean = true
) {
  try {
    const row = await storage.createEmailSchedule({
      registrationId: sendToAll ? null : undefined,
      emailType,
      subject,
      html,
      scheduledAt,
      status: "pending",
    } as any);

    console.log("Created custom email schedule:", row);
    return row;
  } catch (error) {
    console.error('Error creating custom email schedule:', error);
    throw error;
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
        if (schedule.registrationId === null) {
          // Send to ALL registrations
          const allRegistrations = await storage.getAllRegistrations();
          
          for (const registration of allRegistrations) {
            try {
              await sendEmailWithTemplate(schedule, registration);
              console.log(`Sent ${schedule.emailType} email to ${registration.email}`);
            } catch (error) {
              console.error(`Failed to send ${schedule.emailType} to ${registration.email}:`, error);
              failed++;
              continue;
            }
          }
          sent += allRegistrations.length;
        } else {
          // Send to specific registration
          const registration = await storage.getRegistrationById(schedule.registrationId);
          if (!registration) {
            console.error(`Registration not found for schedule ${schedule.id}`);
            failed++;
            continue;
          }
          
          await sendEmailWithTemplate(schedule, registration);
          sent++;
          console.log(`Sent ${schedule.emailType} email to ${registration.email}`);
        }
        
        // Update schedule as sent
        await storage.updateEmailScheduleStatus(schedule.id, 'sent', now);
        
      } catch (error) {
        console.error(`Failed to send ${schedule.emailType} email:`, error);
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

// Send email using the stored HTML template
async function sendEmailWithTemplate(schedule: any, registration: Registration) {
  let html = schedule.html || '';
  
  // Replace template variables
  html = html.replace(/\{\{name\}\}/g, registration.name);
  html = html.replace(/\{\{email\}\}/g, registration.email);
  
  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL || "info@crispai.ca",
    to: registration.email,
    subject: schedule.subject,
    html: html.trim(),
  });
}

// Legacy function for backward compatibility - now uses stored email definitions  
export async function sendScheduledEmail(emailType: string, registration: Registration) {
  // Find the email definition
  const emailDef = EMAIL_SCHEDULES.find(e => e.emailType === emailType);
  if (!emailDef) {
    throw new Error(`Unknown email type: ${emailType}`);
  }
  
  // Create a temporary schedule object
  const schedule = {
    emailType: emailDef.emailType,
    subject: emailDef.subject,
    html: emailDef.html
  };
  
  await sendEmailWithTemplate(schedule, registration);
}