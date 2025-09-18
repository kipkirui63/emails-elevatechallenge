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
export const transporter = nodemailer.createTransport(smtpConfig);

// Test email connection with better error handling
export const testConnection = async () => {
  try {
    console.log("Testing SMTP connection...");
    const result = await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
    ]);
    console.log("SMTP Connection Successful:", result);
    return true;
  } catch (error) {
    console.error("SMTP Connection Error:", error);
    console.log("SMTP connection failed - emails will be attempted but may fail");
    return false;
  }
};

export async function sendRegistrationEmail(registration: any) {
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

export async function sendFreeConfirmationEmail(registration: any) {
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
    <p>Welcome aboard! You're officially an attendee for the AI Elevate Challenge happening September 27th to 28th, and we couldn't be more excited to have you.</p>
    <p>This isn't just any challenge and you didn't just sign up. You made an intentional investment in your growth, and we're showing up for you every step of the way.</p>

    <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 20px; border-radius: 8px; margin: 20px 0; color: white;">
      <h3 style="margin-top: 0; text-align: center;">📅 Event Details:</h3>
      <p style="text-align: center;">
        <strong style="color: white;">🗓 Date: September 27th to 28th, 2025</strong>
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

// Test connection on module load
testConnection();