export interface Repository {
  provider: 'gitlab' | 'github' | 'bitbucket';
  namespace: string;
  name: string;
  description: string | null;
  defaultBranch: string;
  language: string | null;
  visibility: 'public' | 'private';
  stars?: number;
  forks?: number;
  htmlUrl: string;
  url: string,
  updated_at: string;
}
