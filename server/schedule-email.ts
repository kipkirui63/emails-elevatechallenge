import "dotenv/config";
import { storage } from "../server/storage";

async function main() {
  const subject = "🚀 Day 2 of the AI Elevate Challenge is Here!";

  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Day 2 of the AI Elevate Challenge 🚀</h1>
    </div>

    <!-- Body -->
    <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.1); color: #000;">
      
      <h2 style="color: #000;">Hi {{name}},</h2>

      <p>Day 1 was 🔥 — we learnt the foundations of Generative AI, mastered prompt engineering, 
      created stunning images with Nano Banana, generated videos with Veo, and so much more.</p>

      <p><strong>Today (Day 2) we’re going deeper.</strong></p>

      <h3 style="color: #374151;">Here’s what you’ll learn today:</h3>
      <ul>
        <li>✅ Real-world AI use cases anyone can apply</li>
        <li>✅ Hands-on practice with AI tools for business, content, productivity & more</li>
        <li>✅ Build your own AI Agent — step into the future of work</li>
      </ul>

      <h3 style="color: #374151;">📅 Event Details</h3>
      <p>
        🕒 1PM EST | 5PM GMT | 6PM WAT | 6PM UK<br/>
        📍 Live on Zoom: 
        <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1"
           style="color: #2D8CFF; font-weight: bold;">Join Here</a>
      </p>

      <h3 style="color: #374151;">✅ Don’t Forget:</h3>
      <ul>
        <li>Add the event to your calendar: <a href="[Add to Calendar]">Click here</a></li>
        <li>Join the WhatsApp community: <a href="[Join the Community]">Click here</a></li>
        <li>Join with a laptop for the best hands-on experience</li>
      </ul>

      <p style="margin-top: 20px;">Forward this email to a friend, client, or colleague who’d benefit — 
      imagine learning together and swapping ideas in real time.</p>

      <p style="margin-top: 30px;"><strong>We’ll see you inside! 🚀</strong></p>

      <p style="color: #000;">The Crisp AI Team</p>

      <hr style="margin: 30px 0;"/>
      <p style="font-size: 14px; color: #6b7280;">
        🔗 Quick links:<br/>
        Zoom: <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1">Join</a><br/>
        WhatsApp: <a href="https://chat.whatsapp.com/IX9zZ5uuaLy1tvHoNRTwJh?mode=ems_copy_t">Join here</a><br/>
        Registration: <a href="https://aielevatechallenge.crispai.ca">aielevatechallenge.crispai.ca</a>
      </p>
    </div>
  </div>
  `.trim();

  // --- Config ---
  const eventTime = new Date("2025-09-14T11:50:00.000Z"); // 1PM EST in UTC
  const batchSize = 100;
  const delayPerBatchMinutes = 5;
  const jitterSeconds = 30; // max random delay in seconds per email

  // Fetch all registrations
  const registrations = await storage.getAllRegistrations(); // adjust this to your system

  // Split into batches
  for (let i = 0; i < registrations.length; i += batchSize) {
    const batch = registrations.slice(i, i + batchSize);

    // Calculate base time for this batch
    const batchDelayMinutes = (i / batchSize) * delayPerBatchMinutes;
    const baseTime = new Date(eventTime.getTime() + batchDelayMinutes * 60 * 1000);

    for (const reg of batch) {
      // Add random jitter within the batch
      const randomOffset = Math.floor(Math.random() * jitterSeconds * 1000);
      const scheduledAt = new Date(baseTime.getTime() + randomOffset);

      await storage.createEmailSchedule({
        registrationId: reg.id,
        emailType: "custom",
        subject,
        html,
        scheduledAt,
        status: "pending",
      } as any);

      console.log(
        `Scheduled email for ${reg.id} at ${scheduledAt.toISOString()} (batch ${
          i / batchSize + 1
        })`
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});








































// import "dotenv/config";
// import { storage } from "../server/storage";

// async function main() {
//   const subject = "⏳ Imagine Compressing Months of Work Into Days… In Just 5 Days You’ll See How";

// const html = `
//   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    
//     <!-- Header -->
//     <div style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
//       <h1 style="color: white; margin: 0; font-size: 24px;">AI Elevate Challenge – Starts in 5 Days 🚀</h1>
//     </div>
    
//     <!-- Body -->
//     <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); color: #000;">
      
//       <h2 style="color: #000;">Hi {{name}},</h2>
      
//       <p>Imagine this for a second…</p>
//       <p>You’ve got a big project that normally takes months of research and back-and-forth. Instead of slogging through it, you have an AI tool that does the heavy lifting, compressing months of effort into just a few days (sometimes hours).</p>
      
//       <p>This is exactly what we’ll start building together inside the <strong>AI Elevate Challenge</strong>, kicking off in just <strong>5 days</strong>! 🚀</p>
      
//       <!-- Save the Dates -->
//       <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3 style="margin-top: 0; color: #374151;">✅ Save the Dates</h3>
//         <p style="margin: 0; text-align: center; color: #000;">
//           🗓 <strong>September 13–14, 2025</strong><br/>
//           🕒 <strong>1–4 PM EST Daily</strong><br/>
//           📍 <strong>Live on Zoom (with replays)</strong>
//         </p>
//         <div style="text-align: center; margin-top: 15px;">
//           <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1" 
//              style="background: linear-gradient(135deg, #17abe8 0%, #004aad 100%); color: white; padding: 10px 20px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;" 
//              target="_blank" rel="noopener noreferrer">
//             👉 Add to Calendar
//           </a>
//         </div>
//       </div>
      
//       <!-- WhatsApp -->
//       <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3 style="margin-top: 0; color: #374151;">✅ Join the WhatsApp Community</h3>
//         <p style="color: #000;">Stay plugged in for reminders, bonus drops, and support.</p>
//         <div style="text-align: center;">
//           <a href="https://chat.whatsapp.com/IX9zZ5uuaLy1tvHoNRTwJh?mode=ems_copy_t" 
//              style="color: #8B5CF6; font-weight: bold; text-decoration: none;">
//             👉 Join the Community
//           </a>
//         </div>
//       </div>
      
//       <!-- Share with a friend -->
//       <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3 style="margin-top: 0; color: #374151;">✅ Share with a Friend</h3>
//         <p style="color: #000;">If you know a friend, colleague, or client who needs to start working smarter with AI (not harder), forward them this email or share the registration link.</p>
//         <div style="text-align: center;">
//           <a href="https://aielevatechallenge.crispai.ca" 
//              style="color: #8B5CF6; font-weight: bold; text-decoration: none;">
//             👉 Share the Registration Link
//           </a>
//         </div>
//       </div>
      
//       <!-- Footer -->
//       <p style="color: #000;">This is your time to lead with AI.<br/>
//       See you in 5 days,<br/>
//       <strong>The Crisp AI Team</strong></p>
      
//       <hr style="margin: 30px 0;"/>
//       <p style="font-size: 14px; color: #6b7280;">
//         🔗 Quick links:<br/>
//         Zoom: <a href="https://us06web.zoom.us/j/89419812734?pwd=N65aL23ZSrXT7GOZt4cYhCSM2ajQAj.1">Join / Add</a><br/>
//         WhatsApp: <a href="https://chat.whatsapp.com/IX9zZ5uuaLy1tvHoNRTwJh?mode=ems_copy_t">Join here</a><br/>
//         Registration: <a href="https://aielevatechallenge.crispai.ca">aielevatechallenge.crispai.ca</a>
//       </p>
//     </div>
//   </div>
// `.trim();


//   // 18:45 Africa/Nairobi (UTC+3) => 15:45:00Z
//   const scheduledAt = new Date("2025-09-08T23:30:00.000Z");

//   const row = await storage.createEmailSchedule({
//     registrationId: null,   // null => send to ALL registrations
//     emailType: "custom",
//     subject,
//     html,
//     scheduledAt,
//     status: "pending",
//   } as any);

//   console.log("Created schedule:", row);
// }

// main().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
