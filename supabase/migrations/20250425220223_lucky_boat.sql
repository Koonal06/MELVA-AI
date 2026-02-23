-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON user_subscriptions;

-- Recreate policies with correct permissions
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