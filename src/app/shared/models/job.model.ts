export interface Job {
  userId: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  namespace: string;
  repository: string;
  branch: string;
  ext: string;
  transUnitState: string;
  request: 'estimation' | 'translation';
  status: 'completed' | 'failed' | 'cancelled' | 'estimation_pending' | 'estimation_running' | 'translation_pending' | 'translation_running';
  transUnitFound?: number;
  transUnitDone?: number; // only for translation
  transUnitAllowed?: number; // only for translation
  transactionId?: string; // only for translation
  runId?: string;
  details: any;
  createdAt?: Date;
  updatedAt?: Date;
}
