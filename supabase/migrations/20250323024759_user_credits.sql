-- Create credits table
CREATE TABLE IF NOT EXISTS user_credits (
  "userId" uuid PRIMARY KEY REFERENCES auth.users(id),
  balance integer NOT NULL DEFAULT 0,
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
  INSERT INTO user_credits ("userId", balance, "updatedAt") 
  VALUES (NEW."userId", NEW.credits, now()) 
  ON CONFLICT ("userId") DO UPDATE
  SET 
    balance = CASE
      -- Pour un INSERT, on ajoute les crédits si completed ou pending
      WHEN TG_OP = 'INSERT' AND NEW.status IN ('completed', 'pending') THEN user_credits.balance + NEW.credits
      -- Pour un UPDATE vers failed/cancelled, on retire les crédits
      WHEN TG_OP = 'UPDATE' AND NEW.status IN ('failed', 'cancelled') THEN user_credits.balance - NEW.credits
      -- Dans tous les autres cas on ne change rien
      ELSE user_credits.balance
    END,
    "updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER update_credits_on_transactions_change
  AFTER INSERT OR UPDATE ON user_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits();

-- Add user_transactions to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_credits;