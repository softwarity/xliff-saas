-- Crate the function that will be called by the trigger
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into user_credits (user_id, credits, description)
  values (new.id, 100, 'Initial signup bonus');
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger that will be executed after an insertion in auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
