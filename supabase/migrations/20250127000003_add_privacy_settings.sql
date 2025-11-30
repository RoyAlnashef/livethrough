-- Add privacy settings to users table
-- This migration adds a JSONB column to store user privacy preferences

ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{
  "allowDataUsage": true,
  "allowAnalytics": true
}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN users.privacy_settings IS 'User privacy preferences stored as JSONB';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_privacy_settings ON users USING GIN (privacy_settings); 