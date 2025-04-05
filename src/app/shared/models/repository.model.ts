import { ProviderType } from "./provider-type";

export interface Repository {
  provider: ProviderType;
  namespace: string;
  name: string;
  description: string | null;
  defaultBranch: string;
  language?: string;
  visibility: 'public' | 'private';
  stars?: number;
  forks?: number;
  htmlUrl: string;
  url: string,
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T[];
  nextPage: string | null;
}