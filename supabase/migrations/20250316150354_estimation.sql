CREATE TABLE IF NOT EXISTS user_estimations (
  "userId" uuid NOT NULL REFERENCES auth.users(id),
  status text NOT NULL,
  branch text NOT NULL,
  namespace text NOT NULL,
  repository text NOT NULL,
  ext text NOT NULL,
  "transUnitState" text NOT NULL,
  "transUnitCount" integer NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now(),
  PRIMARY KEY (namespace, repository)
);

ALTER TABLE estimations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own estimations"
  ON estimations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");