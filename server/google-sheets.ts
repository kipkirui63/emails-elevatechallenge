// Updated Google Sheets integration for your Node.js backend
import { InsertRegistration, Registration } from "@shared/schema";

// Configuration - Update these with your actual values
const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'ai-elevate-challenge-2025';

interface GoogleSheetsRegistration {
  id: string;
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  agreedToTerms: boolean;
  registeredAt: Date;
  isVip: boolean;
  stripePaymentId?: string;
}

class GoogleSheetsStorage {
  private async callAppsScript(data: any): Promise<any> {
    try {
      console.log('Calling Google Apps Script with data:', JSON.stringify(data, null, 2));
      console.log('Google Apps Script URL:', GOOGLE_APPS_SCRIPT_URL);
      
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: WEBHOOK_SECRET,
          ...data
        })
      });

      console.log('Google Apps Script response status:', response.status);
      const responseText = await response.text();
      console.log('Google Apps Script response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      if (result.error) {
        throw new Error(result.error);
      }

      console.log('Google Apps Script result:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('Error calling Google Apps Script:', error);
      throw error;
    }
  }

  async createRegistration(data: InsertRegistration): Promise<Registration> {
    try {
      const registrationData = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        countryCode: data.countryCode || "+1",
        agreedToTerms: data.agreedToTerms,
      };

      const result = await this.callAppsScript({
        action: 'addRegistration',
        registration: registrationData
      });

      // Create a Registration object to return
      const registration: Registration = {
        id: parseInt(result.id) || Math.floor(Math.random() * 10000), // Convert string ID to number or generate
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        countryCode: data.countryCode || "+1",
        agreedToTerms: data.agreedToTerms,
        isVip: false,
        stripePaymentId: null,
        registeredAt: new Date(),
      };

      console.log('Registration added to Google Sheets:', registration.email);
      return registration;

    } catch (error) {
      console.error('Error creating registration in Google Sheets:', error);
      
      // Fallback: create a local registration object if Google Sheets fails
      const fallbackRegistration: Registration = {
        id: Math.floor(Math.random() * 100000),
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        countryCode: data.countryCode || "+1",
        agreedToTerms: data.agreedToTerms,
        isVip: false,
        stripePaymentId: null,
        registeredAt: new Date(),
      };

      console.log('Using fallback registration (Google Sheets unavailable):', fallbackRegistration.email);
      return fallbackRegistration;
    }
  }

  async getRegistrationByEmail(email: string): Promise<Registration | undefined> {
    // For now, we'll assume no duplicates since Google Sheets doesn't have easy querying
    // In a production setup, you might want to implement a more sophisticated check
    console.log('Checking for existing registration:', email);
    return undefined;
  }

  async getRegistrationById(id: number): Promise<Registration | undefined> {
    // Similar to above, this would require more complex Google Sheets querying
    console.log('Getting registration by ID:', id);
    return undefined;
  }

  async getAllRegistrations(): Promise<Registration[]> {
    try {
      const result = await this.callAppsScript({
        action: 'getAllRegistrations'
      });

      // Convert Google Sheets data to Registration objects
      const registrations: Registration[] = result.registrations?.map((row: any, index: number) => ({
        id: index + 1,
        name: row.Name || '',
        email: row.Email || '',
        phone: row.Phone || null,
        countryCode: row['Country Code'] || '+1',
        agreedToTerms: row['Agreed to Terms'] === 'Yes',
        isVip: false,
        stripePaymentId: null,
        registeredAt: new Date(row.Timestamp || Date.now()),
      })) || [];

      return registrations;
    } catch (error) {
      console.error('Error getting all registrations from AI ELEVATE sheet:', error);
      return [];
    }
  }

  async updateRegistrationToVip(id: number): Promise<Registration | undefined> {
    // VIP functionality removed for this version
    console.log('VIP update not implemented for Google Sheets version');
    return undefined;
  }

  async getRegistrationStats(): Promise<{ count: number }> {
    try {
      const result = await this.callAppsScript({
        action: 'getStats'
      });

      return { count: result.total || 0 };
    } catch (error) {
      console.error('Error getting registration stats:', error);
      return { count: 0 };
    }
  }
}

export const googleSheetsStorage = new GoogleSheetsStorage();