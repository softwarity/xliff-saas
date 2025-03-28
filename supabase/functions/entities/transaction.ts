export interface Transaction {
  id: string;
  userId: string;
  credits: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  message: string;
  details: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
