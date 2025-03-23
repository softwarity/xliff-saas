/*
  # Initial Database Schema

  1. Tables
    - `users` (handled by Supabase Auth)
    - subscriptions: Stores subscription information for users
    - credits: Tracks user credit balances
    - credit_transactions: Records credit usage history
    - stripe_events: Logs Stripe webhook events
    - usage_records: Tracks usage metrics
    - user_metadata: Stores user-specific settings and tokens

  2. Security
    - Row Level Security (RLS) enabled on all tables
    - Appropriate policies for user access
    - Service role access where needed

  3. Constraints
    - Foreign key relationships
    - Unique constraints
    - Check constraints for data integrity
*/

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  stripe_customer_id text NOT NULL UNIQUE,
  stripe_subscription_id text NOT NULL UNIQUE,
  plan_id text NOT NULL,
  status text NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to subscriptions"
  ON subscriptions
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can only read own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Credits table
CREATE TABLE IF NOT EXISTS credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) UNIQUE,
  amount integer NOT NULL DEFAULT 0 CHECK (amount >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to credits"
  ON credits
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can only read own credits"
  ON credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  amount integer NOT NULL,
  type text NOT NULL CHECK (type IN ('increment', 'decrement')),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to credit transactions"
  ON credit_transactions
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can only read own credit transactions"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Stripe events table
CREATE TABLE IF NOT EXISTS stripe_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text NOT NULL UNIQUE,
  type text NOT NULL,
  data jsonb NOT NULL,
  processed boolean DEFAULT false,
  error text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System only access"
  ON stripe_events
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Usage records table
CREATE TABLE IF NOT EXISTS usage_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id),
  units_used integer NOT NULL DEFAULT 0 CHECK (units_used >= 0),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own usage"
  ON usage_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User metadata table
CREATE TABLE IF NOT EXISTS user_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) UNIQUE,
  git_tokens jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own metadata"
  ON user_metadata
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own metadata"
  ON user_metadata
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_metadata_updated_at
  BEFORE UPDATE ON user_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();