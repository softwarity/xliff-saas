CREATE TABLE IF NOT EXISTS user_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES auth.users(id),
  provider text CHECK (provider IN ('github', 'gitlab', 'bitbucket')) NOT NULL,
  namespace text NOT NULL,
  repository text NOT NULL,
  branch text NOT NULL,
  ext text NOT NULL,
  "transUnitState" text NOT NULL,
  request text CHECK (request IN ('estimation', 'translation')) NOT NULL,
  status text CHECK (status IN ('failed', 'cancelled', 'completed', 'pending', 'estimation_running', 'translation_running')) NOT NULL,
  "transUnitFound" integer, -- number of trans-units found in the repository
  "transUnitDone" integer, -- number of trans-units translated
  "transUnitFailed" integer, -- number of trans-units failed to translate
  "transUnitAllowed" integer, -- number of trans-units allowed to translate, mean min("transUnitFound", "credits")
  -- transaction id foreign key
  "transactionId" uuid REFERENCES user_transactions(id), -- from TRANSLATION_PENDING we link with transactionId, for update when is TRANSLATION_COMPLETED
  "runId" text, -- id of the job in github actions
  details jsonb DEFAULT '{}'::jsonb,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now(),
  duration integer -- duration of the job in ms
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

CREATE VIEW latest_user_jobs AS
SELECT *
FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY request, provider, namespace, repository ORDER BY "createdAt" DESC) AS row_num
    FROM user_jobs
) sub
WHERE row_num = 1;