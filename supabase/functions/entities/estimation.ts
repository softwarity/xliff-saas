export interface Estimation {
  userId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  branch: string;
  namespace: string;
  repository: string;
  ext: string;
  transUnitState: string;
  transUnitCount: number;
  details: any;
}
