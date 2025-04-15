interface Issue  {
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