interface CreateIssue {
  title: string;
  body?: string;
  assignee?: string;
  milestone?: number;
  labels?: string[];
  assignees?: string[];
}