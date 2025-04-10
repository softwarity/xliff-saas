-- Create table to track all created accounts (including normalized emails)
CREATE TABLE IF NOT EXISTS account_created (
  "emailHash" TEXT PRIMARY KEY,
  "emailDomain" TEXT, -- Store only domain part for statistics
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookup
CREATE INDEX IF NOT EXISTS idx_account_created_email_hash ON account_created("emailHash");
CREATE INDEX IF NOT EXISTS idx_account_created_domain ON account_created("emailDomain");
