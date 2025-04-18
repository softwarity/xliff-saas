export interface Job {
  id: string;
  userId: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  namespace: string;
  repository: string;
  branch: string;
  ext: string;
  transUnitState: string;
  request: 'estimation' | 'translation';
  status: 'completed' | 'failed' | 'cancelled' | 'pending' | 'estimating' | 'translating' | 'cancelling';
  transUnitFound?: number;
  transUnitDone?: number; // only for translation
  transUnitFailed?: number; // only for translation
  transUnitAllowed?: number; // only for translation
  transactionId?: string; // only for translation
  runId?: string;
  details: any;
  createdAt?: Date;
  updatedAt?: Date;
  duration?: number; // duration of the job in ms
}
