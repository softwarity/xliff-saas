import { ProviderType } from './provider-type';

export interface UserMetadata {
  id: string;
  user_id: string;
  git_tokens: Record<ProviderType, string>;
  created_at: string;
  updated_at: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: {
    message: string;
    details: string;
    hint: string;
    code: string;
  } | null;
}