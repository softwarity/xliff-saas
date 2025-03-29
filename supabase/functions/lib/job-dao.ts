import { SupabaseClient } from "jsr:@supabase/supabase-js";
import { Job } from "../entities/job.ts";

export class JobDao {
  constructor(private supabaseClient: SupabaseClient) {}

  async existsAndNotCompleted(request: 'estimation' | 'translation', userId: string, provider: string, namespace: string, repository: string): Promise<boolean> {
    const {data, error} = await this.supabaseClient.from('user_jobs').select('status')
    .eq('userId', userId).eq('provider', provider).eq('namespace', namespace).eq('repository', repository).eq('request', request).in('status', ['pending', 'estimating', 'translating', 'cancelling']);
    if (error) {
      throw new Error(error.message);
    }
    if (!data?.length) {
      return false;
    }
    return true;
  }

  async insert(job: Omit<Job, 'id'>): Promise<Job> {
    const {error, data} = await this.supabaseClient.from('user_jobs').insert(job).select();
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }

  async updateById(id: string, toUpdate: Partial<Job>): Promise<Job> {
    const {error, data} = await this.supabaseClient.from('user_jobs').update(toUpdate).eq('id', id).select();
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }

  async getById(id: string): Promise<Job> {
    const {data, error} = await this.supabaseClient.from('user_jobs').select('*')
    .eq('id', id).single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async isFailed(id: string): Promise<boolean> {
    const {data, error} = await this.supabaseClient.from('user_jobs').select('status').eq('id', id).single();
    if (error) {
      throw new Error(error.message);
    }
    return data.status === 'failed';
  }
}

