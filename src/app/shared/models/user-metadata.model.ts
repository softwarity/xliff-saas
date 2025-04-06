import { ProviderType } from './provider-type';

export interface UserMetadata {
  id: string;
  userId: string;
  githubToken: string;
  gitlabToken: string;
  bitbucketToken: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
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

