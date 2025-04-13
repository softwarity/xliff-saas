interface CreateIssue {
  title: string;
  body?: string;
  type?: 'Bug' | 'Feature';
  assignee?: string;
  milestone?: number;
  labels?: string[];
  assignees?: string[];
}