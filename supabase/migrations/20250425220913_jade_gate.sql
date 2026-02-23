/*
  # Fix user subscription policies

  1. Changes
    - Add INSERT policy for user_subscriptions table
    - Ensure all policies are properly configured
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON user_subscriptions;

-- Recreate all policies with correct permissions
CREATE POLICY "Users can create their own subscription"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure the table has RLS enabled
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;