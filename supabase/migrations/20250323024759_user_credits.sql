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
  INSERT INTO user_credits ("userId", balance)
  VALUES (NEW."userId", 0)  -- Nouvelle entrée commence toujours à 0
  ON CONFLICT ("userId") DO UPDATE
  SET 
    balance = CASE
      -- Pour un INSERT, on ajoute les crédits si completed ou pending
      WHEN TG_OP = 'INSERT' AND NEW.status IN ('completed', 'pending') THEN 
        user_credits.balance + NEW.credits
      -- Pour un UPDATE vers failed/cancelled, on retire les crédits
      WHEN TG_OP = 'UPDATE' AND NEW.status IN ('failed', 'cancelled') THEN 
        user_credits.balance - NEW.credits
      -- Dans tous les autres cas on ne change rien
      ELSE user_credits.balance
    END,
    "updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- old function, recompute the balance and pending
-- CREATE OR REPLACE FUNCTION update_user_credits()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   -- Insert or update the user's credit balance
--   INSERT INTO user_credits ("userId", balance)
--   VALUES (
--     COALESCE(NEW."userId", OLD."userId"),
--     (
--       SELECT COALESCE(SUM(credits), 0)
--       FROM user_transactions
--       WHERE "userId" = COALESCE(NEW."userId", OLD."userId")
--       AND status = 'completed'
--     ),
--     (
--       SELECT COALESCE(SUM(credits), 0)
--       FROM user_transactions
--       WHERE "userId" = COALESCE(NEW."userId", OLD."userId")
--       AND status = 'pending'
--     )
--   )
--   ON CONFLICT ("userId") DO UPDATE
--   SET 
--     balance = EXCLUDED.balance,
--     pending = EXCLUDED.pending,
--     "updatedAt" = now();
  
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER update_credits_on_transactions_change
  AFTER INSERT OR UPDATE OR DELETE ON user_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_credits();

-- Add user_transactions to realtime publication
alter publication supabase_realtime add table user_credits;