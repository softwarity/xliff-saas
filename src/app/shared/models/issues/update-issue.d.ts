interface UpdateIssue {
  title: string;
  body: string;
  state: 'open' | 'closed';
  type: 'Bug' | 'Feature';
}