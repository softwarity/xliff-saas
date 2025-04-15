export interface Issue  {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  type: 'Bug' | 'Feature';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  comments: number;
}

export interface CreateIssue {
  title: string;
  body: string;
  type: 'Bug' | 'Feature';
}

export interface UpdateIssue {
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  state_reason?: 'completed' | 'not_planned' | 'reopened';
  milestone?: number | null;
  labels?: string[];
  assignees?: string[];
}

export interface Comment {
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  support: boolean;
}