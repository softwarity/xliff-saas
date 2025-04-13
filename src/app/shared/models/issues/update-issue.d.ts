interface UpdateIssue {
  title?: string;
  body?: string;
  state?: 'open' | 'closed';
  state_reason?: 'completed' | 'not_planned' | 'reopened';
  milestone?: number | null;
  labels?: string[];
  assignees?: string[];
}