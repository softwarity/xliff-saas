CREATE TABLE IF NOT EXISTS user_jobs (
  -- primary composite key
  "userId" uuid NOT NULL REFERENCES auth.users(id),
  provider text CHECK (provider IN ('github', 'gitlab', 'bitbucket')) NOT NULL,
  namespace text NOT NULL,
  repository text NOT NULL,
  --
  branch text NOT NULL,
  ext text NOT NULL,
  "transUnitState" text NOT NULL,
  request text CHECK (request IN ('estimation', 'translation')) NOT NULL,
  status text CHECK (status IN ('failed', 'cancelled', 'completed', 'estimation_pending', 'estimation_running', 'translation_pending', 'translation_running')) NOT NULL,
  "transUnitFound" integer, -- number of trans-units found in the repository
  "transUnitDone" integer, -- number of trans-units translated
  "transUnitAllowed" integer, -- number of trans-units allowed to translate, mean min("transUnitFound", "credits")
  -- transaction id foreign key
  "transactionId" uuid REFERENCES user_transactions(id), -- from TRANSLATION_PENDING we link with transactionId, for update when is TRANSLATION_COMPLETED
  "runId" text, -- id of the job in github actions
  details jsonb DEFAULT '{}'::jsonb,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now(),
  PRIMARY KEY (request, "userId", provider, namespace, repository)
);

ALTER TABLE user_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own jobs"
  ON user_jobs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

-- Add user_jobs to realtime publication
alter publication supabase_realtime add table user_jobs;

-- 