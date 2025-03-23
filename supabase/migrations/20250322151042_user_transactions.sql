CREATE TABLE IF NOT EXISTS user_transactions (
  "userId" uuid NOT NULL REFERENCES auth.users(id),
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credits integer NOT NULL,
  status text CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) NOT NULL,
  message text,
  details jsonb DEFAULT '{}'::jsonb,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON user_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");