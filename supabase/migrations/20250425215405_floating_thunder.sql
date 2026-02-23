/*
  # Add INSERT policy for user subscriptions

  1. Security Changes
    - Add INSERT policy for user_subscriptions table to allow users to create their own subscriptions
    - Policy ensures users can only create subscriptions for themselves
*/

CREATE POLICY "Users can create their own subscription"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);