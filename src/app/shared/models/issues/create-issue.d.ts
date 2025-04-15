interface CreateIssue {
  title: string;
  body?: string;
  type?: 'Bug' | 'Feature';
}