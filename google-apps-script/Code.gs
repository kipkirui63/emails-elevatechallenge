// Google Apps Script code for syncing registration data from PostgreSQL database
// This code should be pasted into your Google Apps Script project

// Configuration - Update these with your actual values
const SPREADSHEET_ID = '1BkLr12X_BFNG1F7of5X-v-RY7H3Q1qOPO31IKRP831SZqhsXSmkezI2V';
const SHEET_NAME = 'AI ELEVATE';
const API_BASE_URL = 'https://your-app-domain.com'; // Update with your actual domain
const SYNC_INTERVAL_MINUTES = 5; // How often to sync data

/**
 * Initialize the spreadsheet with headers
 */
function initializeSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Set up headers
  const headers = [
    'ID',
    'Timestamp',
    'Name', 
    'Email',
    'Phone',
    'Country Code',
    'Agreed to Terms',
    'Is VIP',
    'Registration Source'
  ];
  
  // Check if headers already exist
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = firstRow.some(cell => cell !== '');
  
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
  
  Logger.log('Sheet initialized successfully');
}

/**
 * Sync registrations from the database
 */
function syncRegistrations() {
  try {
    Logger.log('Starting registration sync...');
    
    // Initialize sheet if needed
    initializeSheet();
    
    // Fetch registrations from your API
    const response = UrlFetchApp.fetch(`${API_BASE_URL}/api/registrations/export`);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`API request failed with status: ${response.getResponseCode()}`);
    }
    
    const data = JSON.parse(response.getContentText());
    const registrations = data.registrations || [];
    
    Logger.log(`Fetched ${registrations.length} registrations from database`);
    
    if (registrations.length === 0) {
      Logger.log('No registrations to sync');
      return;
    }
    
    // Get the sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    // Clear existing data (except headers)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clear();
    }
    
    // Prepare data for insertion
    const rows = registrations.map(reg => [
      reg.id || '',
      reg.registeredAt ? new Date(reg.registeredAt) : new Date(),
      reg.name || '',
      reg.email || '',
      reg.phone || '',
      reg.countryCode || '+1',
      reg.agreedToTerms ? 'Yes' : 'No',
      reg.isVip ? 'Yes' : 'No',
      'Website Registration'
    ]);
    
    // Insert all data at once
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
      Logger.log(`Successfully synced ${rows.length} registrations to spreadsheet`);
    }
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 9);
    
    // Update last sync timestamp
    const now = new Date();
    PropertiesService.getScriptProperties().setProperty('lastSync', now.toISOString());
    
    Logger.log('Registration sync completed successfully');
    
  } catch (error) {
    Logger.log('Error syncing registrations: ' + error.toString());
    throw error;
  }
}

/**
 * Set up automatic syncing (run this once to set up the trigger)
 */
function setupAutoSync() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'syncRegistrations') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger to run every 5 minutes
  ScriptApp.newTrigger('syncRegistrations')
    .timeBased()
    .everyMinutes(SYNC_INTERVAL_MINUTES)
    .create();
    
  Logger.log(`Auto-sync set up to run every ${SYNC_INTERVAL_MINUTES} minutes`);
}

/**
 * Manual sync function for testing
 */
function manualSync() {
  syncRegistrations();
}

/**
 * Test function to verify setup
 */
function testSetup() {
  try {
    Logger.log('Starting test setup...');
    
    // Initialize sheet
    initializeSheet();
    Logger.log('Sheet initialized');
    
    // Test API connection
    Logger.log('Testing API connection...');
    const response = UrlFetchApp.fetch(`${API_BASE_URL}/api/registrations/export`);
    Logger.log(`API response status: ${response.getResponseCode()}`);
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      Logger.log(`API returned ${data.registrations?.length || 0} registrations`);
    }
    
    // Run sync
    syncRegistrations();
    
    return 'Setup test completed successfully!';
    
  } catch (error) {
    Logger.log('Test failed: ' + error.toString());
    return 'Test failed: ' + error.toString();
  }
}

/**
 * Get sync status
 */
function getSyncStatus() {
  const lastSync = PropertiesService.getScriptProperties().getProperty('lastSync');
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const rowCount = sheet.getLastRow() - 1; // Subtract header row
  
  return {
    lastSync: lastSync || 'Never',
    registrationCount: Math.max(0, rowCount),
    sheetUrl: ss.getUrl()
  };
}