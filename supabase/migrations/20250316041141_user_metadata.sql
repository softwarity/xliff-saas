-- User metadata table
CREATE TABLE IF NOT EXISTS user_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) UNIQUE,
  git_tokens jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own metadata"
  ON user_metadata
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own metadata"
  ON user_metadata
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);