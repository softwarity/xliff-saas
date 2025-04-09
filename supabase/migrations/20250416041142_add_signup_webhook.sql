-- Function to normalize email addresses (remove +alias parts)
CREATE OR REPLACE FUNCTION normalize_email(email TEXT)
RETURNS TEXT AS $$
DECLARE
  normalized TEXT;
  domain TEXT;
  username TEXT;
  plus_pos INTEGER;
BEGIN
  -- Extract username and domain
  username := split_part(email, '@', 1);
  domain := split_part(email, '@', 2);
  
  -- Remove everything after + (including +) for all email domains
  plus_pos := position('+' in username);
  IF plus_pos > 0 THEN
    username := substring(username from 1 for plus_pos - 1);
  END IF;
  
  -- Reconstruct email and convert to lowercase
  normalized := lower(username || '@' || domain);
  
  RETURN normalized;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to hash a text value using MD5 (disponible nativement dans PostgreSQL)
CREATE OR REPLACE FUNCTION hash_text(text_to_hash TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN md5(text_to_hash);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create the function that will be add 100 credits to the user when they sign up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  isPreviouslyDeleted BOOLEAN;
  normalizedEmail TEXT;
  emailHash TEXT;
BEGIN
  -- Normalize the email only once
  normalizedEmail := normalize_email(new.email);
  
  -- Then hash the already normalized email using our hash_text function
  emailHash := hash_text(normalizedEmail);
  
  -- Check if the hashed email exists in the deleted_accounts table
  SELECT EXISTS (
    SELECT 1 FROM deleted_accounts 
    WHERE "emailHash" = emailHash 
    AND "deletedAt" > (NOW() - INTERVAL '90 days')
  ) INTO isPreviouslyDeleted;

  -- Insert initial credits transaction only if the email is not in the deleted_accounts table
  -- or if the deletion happened more than 90 days ago
  IF NOT isPreviouslyDeleted THEN
    -- Insert initial credits transaction
    INSERT INTO user_transactions ("userId", credits, message, status) 
    VALUES (new.id, 100, 'Initial signup bonus', 'completed');
  ELSE
    -- Create a transaction with 0 credits and a message explaining why
    INSERT INTO user_transactions ("userId", credits, message, status) 
    VALUES (new.id, 0, 'No signup bonus - previously deleted account detected', 'completed');
  END IF;
  
  -- Create user metadata entry
  INSERT INTO user_metadata ("userId", "roles") 
  VALUES (new.id, '{}'::text[]);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Create table to track deleted accounts
CREATE TABLE IF NOT EXISTS deleted_accounts (
  "emailHash" TEXT PRIMARY KEY,
  "emailDomain" TEXT, -- Store only domain part for statistics
  "userId" UUID,
  "deletedAt" TIMESTAMPTZ DEFAULT NOW(),
  "ipAddress" TEXT,
  metadata JSONB
);

-- Add index for faster lookup
CREATE INDEX IF NOT EXISTS idx_deleted_accounts_email_hash ON deleted_accounts("emailHash");
CREATE INDEX IF NOT EXISTS idx_deleted_accounts_domain ON deleted_accounts("emailDomain"); 