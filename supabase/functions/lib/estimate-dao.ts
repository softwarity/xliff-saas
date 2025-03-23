import { SupabaseClient } from "jsr:@supabase/supabase-js";
import { Estimation } from "../entities/estimation.ts";

export class EstimateDao {
  constructor(private supabaseClient: SupabaseClient) {}

  async exists(namespace: string, repository: string): Promise<boolean> {
    const {data, error} = await this.supabaseClient.from('user_estimations').select('*').eq('namespace', namespace).eq('repository', repository);
    if (error) {
      throw new Error(error.message);
    }
    return data?.length > 0;
  }

  async existsAndNotCompleted(namespace: string, repository: string): Promise<boolean> {
    const {data, error} = await this.supabaseClient.from('user_estimations')
    .select('status').eq('namespace', namespace).eq('repository', repository);
    if (error) {
      throw new Error(error.message);
    }
    if (!data?.length) {
      return false;
    }
    const [{status}] = data;
    return status !== 'completed';
  }

  async insert(estimation: Estimation): Promise<void> {
    const {error} = await this.supabaseClient.from('user_estimations').insert(estimation);
    if (error) {
      throw new Error(error.message);
    }
  }

  async update(namespace: string, repository: string, toUpdate: Partial<Estimation>): Promise<void> {
    const {error} = await this.supabaseClient.from('user_estimations').update(toUpdate).eq('namespace', namespace).eq('repository', repository);
    if (error) {
      throw new Error(error.message);
    }
  }
}

