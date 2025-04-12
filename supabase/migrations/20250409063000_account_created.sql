CREATE SCHEMA private;

-- Revoke all permissions from public
REVOKE ALL ON SCHEMA private FROM public;
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM public;

-- Create table to track all created accounts (including normalized emails)
CREATE TABLE IF NOT EXISTS private.account_created (
  "emailHash" TEXT PRIMARY KEY,
  "emailDomain" TEXT, -- Store only domain part for statistics
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookup
CREATE INDEX IF NOT EXISTS idx_account_created_email_hash ON private.account_created("emailHash");
CREATE INDEX IF NOT EXISTS idx_account_created_domain ON private.account_created("emailDomain");
