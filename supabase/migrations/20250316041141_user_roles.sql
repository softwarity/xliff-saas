-- User metadata table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES auth.users(id) UNIQUE,
  "roles" text[] DEFAULT '{}'::text[],
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own metadata" ON user_roles;

-- Allow users to read their own metadata
CREATE POLICY "Users can read own metadata"
ON user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = "userId");
