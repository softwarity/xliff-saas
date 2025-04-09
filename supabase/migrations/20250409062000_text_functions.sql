-- Function to normalize email addresses (remove +alias parts)
CREATE OR REPLACE FUNCTION normalize_email(email TEXT)
RETURNS TEXT AS $$
DECLARE
  normalized TEXT;
  domain TEXT;
  username TEXT;
  plus_pos INTEGER;
BEGIN
  -- Extract username and domain
  username := split_part(email, '@', 1);
  domain := split_part(email, '@', 2);
  
  -- Remove everything after + (including +) for all email domains
  plus_pos := position('+' in username);
  IF plus_pos > 0 THEN
    username := substring(username from 1 for plus_pos - 1);
  END IF;
  
  -- Reconstruct email and convert to lowercase
  normalized := lower(username || '@' || domain);
  
  RETURN normalized;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to hash a text value using MD5 (disponible nativement dans PostgreSQL)
CREATE OR REPLACE FUNCTION hash_text(text_to_hash TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN md5(text_to_hash);
END;
$$ LANGUAGE plpgsql IMMUTABLE;