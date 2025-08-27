-- SQL script to set up the email_schedules table for local development
-- Run this in your local PostgreSQL database

CREATE TABLE IF NOT EXISTS email_schedules (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER REFERENCES registrations(id),
  email_type TEXT NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  status TEXT DEFAULT 'pending'
);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_email_schedules_status ON email_schedules(status);
CREATE INDEX IF NOT EXISTS idx_email_schedules_scheduled_at ON email_schedules(scheduled_at);

-- Show the table structure
\d email_schedules;