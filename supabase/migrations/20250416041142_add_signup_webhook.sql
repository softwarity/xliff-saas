-- Create the function that will be add 100 credits to the user when they sign up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  similarAccount BOOLEAN;
  normalizedEmail TEXT;
  emailDomain TEXT;
  emailHash TEXT;
BEGIN
  -- Normalize the email only once
  normalizedEmail := normalize_email(new.email);

  -- Extract domain for statistics
  emailDomain := split_part(normalizedEmail, '@', 2);

  -- Then hash the already normalized email using our hash_text function
  emailHash := hash_text(normalizedEmail);
  
  -- Check if the hashed email exists in the account_created table
  SELECT EXISTS (
    SELECT 1 FROM account_created 
    WHERE "emailHash" = emailHash 
  ) INTO similarAccount;

  -- Insert initial credits transaction only if the email is not in the account_created table
  IF NOT similarAccount THEN
    -- Insert initial credits transaction
    INSERT INTO user_transactions ("userId", credits, message, status) 
    VALUES (new.id, 100, 'Initial signup bonus', 'completed');
    
    -- Insert into account_created only for new accounts
    INSERT INTO account_created ("emailHash", "emailDomain") 
    VALUES (emailHash, emailDomain);
  ELSE
    -- Create a transaction with 0 credits and a message explaining why
    INSERT INTO user_transactions ("userId", credits, message, status) 
    VALUES (new.id, 0, 'No signup bonus - similar account detected', 'completed');
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
