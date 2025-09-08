import * as cron from "node-cron";
import { processScheduledEmails } from "./schedule-email";

export class EmailScheduler {
  private static instance: EmailScheduler;
  private cronJob: cron.ScheduledTask | null = null;

  private constructor() {}

  public static getInstance(): EmailScheduler {
    if (!EmailScheduler.instance) {
      EmailScheduler.instance = new EmailScheduler();
    }
    return EmailScheduler.instance;
  }

  /**
   * Start the email scheduler with cron job
   * Runs every 5 minutes to check for pending emails
   */
  public start(): void {
    if (this.cronJob) {
      console.log("Email scheduler is already running");
      return;
    }

    // Run every 5 minutes: "*/5 * * * *"
    // For testing, you can use "* * * * *" to run every minute
    this.cronJob = cron.schedule("*/5 * * * *", async () => {
      try {
        console.log(`[${new Date().toISOString()}] Running scheduled email processor...`);
        const result = await processScheduledEmails();
        
        if (result.processed > 0) {
          console.log(`[${new Date().toISOString()}] Email processing completed:`, result);
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in scheduled email processing:`, error);
      }
    }, {
      timezone: "America/New_York" // EST timezone
    });

    console.log("✅ Email scheduler started - checking for pending emails every 5 minutes");
  }

  /**
   * Stop the email scheduler
   */
  public stop(): void {
    if (this.cronJob) {
      this.cronJob.destroy();
      this.cronJob = null;
      console.log("🛑 Email scheduler stopped");
    }
  }

  /**
   * Get the status of the scheduler
   */
  public getStatus(): { running: boolean; running_status?: string } {
    if (!this.cronJob) {
      return { running: false };
    }

    return { 
      running: true,
      running_status: "active"
    };
  }

  /**
   * Run the email processor immediately (for testing)
   */
  public async runNow(): Promise<any> {
    try {
      console.log("🚀 Running email processor immediately...");
      const result = await processScheduledEmails();
      console.log("✅ Immediate email processing completed:", result);
      return result;
    } catch (error) {
      console.error("❌ Error in immediate email processing:", error);
      throw error;
    }
  }

  /**
   * Update cron schedule (if needed)
   */
  public updateSchedule(cronExpression: string): void {
    this.stop();
    
    this.cronJob = cron.schedule(cronExpression, async () => {
      try {
        console.log(`[${new Date().toISOString()}] Running scheduled email processor...`);
        const result = await processScheduledEmails();
        
        if (result.processed > 0) {
          console.log(`[${new Date().toISOString()}] Email processing completed:`, result);
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in scheduled email processing:`, error);
      }
    }, {
      timezone: "America/New_York" // EST timezone
    });

    console.log(`📅 Email scheduler updated with new schedule: ${cronExpression}`);
  }
}

// Export singleton instance
export const emailScheduler = EmailScheduler.getInstance();

// Common cron patterns for reference:
export const CRON_PATTERNS = {
  EVERY_MINUTE: "* * * * *",
  EVERY_5_MINUTES: "*/5 * * * *",
  EVERY_10_MINUTES: "*/10 * * * *",
  EVERY_30_MINUTES: "*/30 * * * *",
  EVERY_HOUR: "0 * * * *",
  EVERY_2_HOURS: "0 */2 * * *",
  DAILY_AT_9AM: "0 9 * * *",
  DAILY_AT_NOON: "0 12 * * *",
  WEEKDAYS_AT_9AM: "0 9 * * 1-5"
};

// Auto-start the scheduler when the module is imported
console.log("🔧 Initializing email scheduler...");
emailScheduler.start();