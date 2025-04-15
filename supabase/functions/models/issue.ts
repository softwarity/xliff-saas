export interface Issue  {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description: string;
  }>;
  assignee: any | null;
  assignees: any[];
  milestone: any | null;
  comments: number;
  user: any;
}


export interface ListIssuesParams {
  milestone?: string;
  state?: 'open' | 'closed' | 'all';
  assignee?: string;
  creator?: string;
  mentioned?: string;
  labels?: string;
  sort?: 'created' | 'updated' | 'comments';
  direction?: 'asc' | 'adesc';
  since?: string;
  per_page?: number;
  page?: number;
}

export interface CreateIssue {
  title: string;
  body?: string;
  assignee?: string;
  milestone?: number;
  labels?: string[];
  assignees?: string[];
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