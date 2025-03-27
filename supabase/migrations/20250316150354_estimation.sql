CREATE TABLE IF NOT EXISTS user_estimations (
  "userId" uuid NOT NULL REFERENCES auth.users(id),
  status text NOT NULL,
  branch text NOT NULL,
  provider text NOT NULL,
  namespace text NOT NULL,
  repository text NOT NULL,
  ext text NOT NULL,
  "runId" text,
  "transUnitState" text NOT NULL,
  "transUnitCount" integer NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now(),
  PRIMARY KEY ("userId", provider, namespace, repository)
);

ALTER TABLE user_estimations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own estimations"
  ON user_estimations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

-- Add user_estimations to realtime publication
alter publication supabase_realtime add table user_estimations;