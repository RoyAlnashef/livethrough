-- Add DELETE policies for email_subscriptions table
-- This allows authenticated users and service role to delete subscriptions

-- Allow authenticated users to delete any subscription (for admin operations)
CREATE POLICY "Allow authenticated users to delete subscriptions" ON "public"."email_subscriptions" 
FOR DELETE USING (auth.role() = 'authenticated');

-- Allow service role to delete subscriptions (for server-side operations)
CREATE POLICY "Allow service role to delete subscriptions" ON "public"."email_subscriptions" 
FOR DELETE USING (auth.role() = 'service_role');

-- Ensure RLS is enabled
ALTER TABLE "public"."email_subscriptions" ENABLE ROW LEVEL SECURITY;
