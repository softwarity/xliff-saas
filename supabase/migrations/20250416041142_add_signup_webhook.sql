-- Create the function that will be add 100 credits to the user when they sign up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert initial credits transaction
  INSERT INTO user_transactions ("userId", credits, message, status) 
  VALUES (new.id, 100, 'Initial signup bonus', 'completed');
  
  -- Create user metadata entry
  INSERT INTO user_metadata ("userId", "roles") 
  VALUES (new.id, '{}'::text[]);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger that will be executed after an insertion in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user(); 