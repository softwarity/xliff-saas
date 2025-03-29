export interface Transaction {
  id: string;
  userId: string;
  credits: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message: string | null;
  details: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}
