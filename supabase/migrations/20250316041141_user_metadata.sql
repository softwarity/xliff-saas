-- User metadata table
CREATE TABLE IF NOT EXISTS user_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES auth.users(id) UNIQUE,
  "githubToken" text DEFAULT NULL,
  "gitlabToken" text DEFAULT NULL,
  "bitbucketToken" text DEFAULT NULL,
  "avatarUrl" text DEFAULT NULL,
  "roles" text[] DEFAULT '{}'::text[],
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now()
);

ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own metadata" ON user_metadata;
DROP POLICY IF EXISTS "Users can update own metadata except roles" ON user_metadata;

-- Allow users to read their own metadata
CREATE POLICY "Users can read own metadata"
ON user_metadata
FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Allow users to update their own metadata EXCEPT roles
CREATE POLICY "Users can update own metadata except roles"
ON user_metadata
FOR UPDATE
TO authenticated
USING (auth.uid() = "userId")
WITH CHECK (
  auth.uid() = "userId" 
  AND (
    -- Ensure roles field remains unchanged
    roles IS NOT DISTINCT FROM (SELECT roles FROM user_metadata WHERE "userId" = auth.uid())
  )
);
