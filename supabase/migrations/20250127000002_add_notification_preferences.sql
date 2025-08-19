-- Add notification preferences to users table
-- This migration adds a JSONB column to store user notification preferences

ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "emailNotifications": true,
  "courseUpdates": true,
  "marketingEmails": false,
  "systemAnnouncements": true
}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN users.notification_preferences IS 'User notification preferences stored as JSONB';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_notification_preferences ON users USING GIN (notification_preferences); 