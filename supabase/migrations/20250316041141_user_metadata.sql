-- User metadata table
CREATE TABLE IF NOT EXISTS user_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) UNIQUE,
  git_tokens jsonb DEFAULT '{}'::jsonb,
  roles text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own metadata" ON user_metadata;
DROP POLICY IF EXISTS "Users can read own metadata" ON user_metadata;

-- Allow users to read their own metadata
CREATE POLICY "Users can read own metadata"
ON user_metadata
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to update their own metadata EXCEPT roles
CREATE POLICY "Users can update own metadata except roles"
ON user_metadata
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND (
    -- Ensure roles field remains unchanged
    roles IS NOT DISTINCT FROM (SELECT roles FROM user_metadata WHERE user_id = auth.uid())
  )
);

-- Allow users to insert their own metadata but with empty roles
CREATE POLICY "Users can insert own metadata with default roles"
ON user_metadata
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND roles = '{}'::text[]
);