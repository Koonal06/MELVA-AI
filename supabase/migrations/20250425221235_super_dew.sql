/*
  # Fix user subscriptions table and policies

  1. Changes
    - Drop and recreate user_subscriptions table with proper constraints
    - Add proper RLS policies
    - Add trigger for updated_at
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS user_subscriptions;

-- Create user_subscriptions table
CREATE TABLE user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  plan text NOT NULL CHECK (plan IN ('free', 'pro', 'premium')),
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create unique index on user_id
CREATE UNIQUE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- Create policies
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();