-- Create credits table
CREATE TABLE IF NOT EXISTS user_credits (
  "userId" uuid PRIMARY KEY REFERENCES auth.users(id),
  balance integer NOT NULL DEFAULT 0,
  pending integer NOT NULL DEFAULT 0,
  "updatedAt" timestamptz DEFAULT now()
);

-- Add RLS policy
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own credits"
  ON user_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

-- Create function to update credits
CREATE OR REPLACE FUNCTION update_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update the user's credit balance
  INSERT INTO user_credits ("userId", balance)
  VALUES (
    COALESCE(NEW."userId", OLD."userId"),
    (
      SELECT COALESCE(SUM(credits), 0)
      FROM user_transactions
      WHERE "userId" = COALESCE(NEW."userId", OLD."userId")
      AND status = 'completed'
    ),
    (
      SELECT COALESCE(SUM(credits), 0)
      FROM user_transactions
      WHERE "userId" = COALESCE(NEW."userId", OLD."userId")
      AND status = 'pending'
    )
  )
  ON CONFLICT ("userId") DO UPDATE
  SET 
    balance = EXCLUDED.balance,
    pending = EXCLUDED.pending,
    "updatedAt" = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER update_credits_on_transactions_change
  AFTER INSERT OR UPDATE OR DELETE ON user_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits();

-- Add user_transactions to realtime publication
alter publication supabase_realtime add table user_credits;