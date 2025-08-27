# Google Sheets Integration Setup Guide

## Step 1: Set up your Google Spreadsheet

1. Create a new Google Spreadsheet
2. Name it "AI Elevate Challenge Registrations" (or any name you prefer)
3. Note down the Spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

## Step 2: Set up Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the code from `google-apps-script/Code.gs`
4. Update the configuration variables at the top:
   ```javascript
   const SPREADSHEET_ID = 'your-actual-spreadsheet-id-here';
   const SHEET_NAME = 'Registrations';
   const WEBHOOK_SECRET = 'your-secret-key-here';
   ```

## Step 3: Deploy the Apps Script as a Web App

1. In your Apps Script project, click "Deploy" > "New deployment"
2. Choose "Web app" as the type
3. Set the following:
   - Description: "AI Elevate Registration Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Copy the Web App URL (it will look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`)

## Step 4: Test the Setup

1. In your Apps Script editor, run the `testSetup()` function
2. Grant necessary permissions when prompted
3. Check the execution log to ensure it runs successfully
4. Verify that your spreadsheet now has headers and a test row

## Step 5: Configure Your Node.js Application

1. Copy `.env.example` to `.env`
2. Update the environment variables:
   ```
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   WEBHOOK_SECRET=your-secret-key-here
   ```

## Step 6: Test the Integration

1. Start your Node.js application
2. Try registering through your website
3. Check your Google Spreadsheet to see if the data appears automatically

## Spreadsheet Structure

Your spreadsheet will have the following columns:
- **Timestamp**: When the registration was submitted
- **ID**: Unique identifier for each registration
- **Name**: Registrant's full name
- **Email**: Registrant's email address
- **Phone**: Phone number (optional)
- **Country Code**: Phone country code (e.g., +1)
- **Agreed to Terms**: Yes/No
- **Registration Source**: Always "Website Registration"

## Security Notes

- Keep your `WEBHOOK_SECRET` secure and don't share it publicly
- The Apps Script runs with your Google account permissions
- Consider setting up a dedicated Google account for this if handling sensitive data

## Troubleshooting

1. **"Unauthorized" error**: Check that your `WEBHOOK_SECRET` matches in both places
2. **Spreadsheet not found**: Verify your `SPREADSHEET_ID` is correct
3. **Permissions error**: Make sure you've granted all necessary permissions to the Apps Script
4. **Data not appearing**: Check the Apps Script execution logs for errors

## Optional Enhancements

You can extend the Google Apps Script to:
- Send email notifications when new registrations come in
- Create automatic backups
- Generate registration reports
- Set up data validation rules