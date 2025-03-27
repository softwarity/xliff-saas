import { SupabaseClient } from "jsr:@supabase/supabase-js";
import { Job } from "../entities/job.ts";

export class JobDao {
  constructor(private supabaseClient: SupabaseClient) {}

  async exists(request: 'estimation' | 'translation', userId: string, provider: string, namespace: string, repository: string): Promise<boolean> {
    const {data, error} = await this.supabaseClient.from('user_jobs').select('*')
    .eq('userId', userId).eq('provider', provider).eq('namespace', namespace).eq('repository', repository).eq('request', request);
    if (error) {
      throw new Error(error.message);
    }
    return data?.length > 0;
  }

  async existsAndNotCompleted(request: 'estimation' | 'translation', userId: string, provider: string, namespace: string, repository: string): Promise<boolean> {
    const {data, error} = await this.supabaseClient.from('user_jobs').select('status')
    .eq('userId', userId).eq('provider', provider).eq('namespace', namespace).eq('repository', repository).eq('request', request);
    if (error) {
      throw new Error(error.message);
    }
    if (!data?.length) {
      return false;
    }
    const [{status}] = data;
    return status !== 'completed';
  }

  async insert(job: Job): Promise<void> {
    const {error} = await this.supabaseClient.from('user_jobs').insert(job);
    if (error) {
      throw new Error(error.message);
    }
  }

  async update(request: 'estimation' | 'translation', userId: string, provider: string, namespace: string, repository: string, toUpdate: Partial<Job>): Promise<void> {
    const {error} = await this.supabaseClient.from('user_jobs').update(toUpdate)
    .eq('request', request).eq('userId', userId).eq('provider', provider).eq('namespace', namespace).eq('repository', repository);
    if (error) {
      throw new Error(error.message);
    }
  }

  async updateByRunId(runId: string, toUpdate: Partial<Job>): Promise<void> {
    const {error} = await this.supabaseClient.from('user_jobs').update(toUpdate)
    .eq('runId', runId);
    if (error) {
      throw new Error(error.message);
    }
  }

  async getByRunId(runId: string): Promise<Job> {
    const {data, error} = await this.supabaseClient.from('user_jobs').select('*')
    .eq('runId', runId);
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }
}

