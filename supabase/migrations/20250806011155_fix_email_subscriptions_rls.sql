-- Fix RLS policies for email_subscriptions table
-- The current SELECT policy has a variable-free clause that causes issues

-- Drop the problematic SELECT policy
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON "public"."email_subscriptions";

-- Create a new SELECT policy that allows authenticated users to view all subscriptions
-- This is appropriate for a newsletter subscription table where admins need to see all subscriptions
CREATE POLICY "Allow authenticated users to view all subscriptions" ON "public"."email_subscriptions" 
FOR SELECT USING (auth.role() = 'authenticated');

-- Also allow service role to view all subscriptions (for server-side operations)
CREATE POLICY "Allow service role to view all subscriptions" ON "public"."email_subscriptions" 
FOR SELECT USING (auth.role() = 'service_role');

-- Keep the existing INSERT policy as it's working correctly
-- The INSERT policy "Allow inserts from all users" is already correct

-- Ensure RLS is enabled
ALTER TABLE "public"."email_subscriptions" ENABLE ROW LEVEL SECURITY;
