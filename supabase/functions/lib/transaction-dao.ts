import { SupabaseClient } from "jsr:@supabase/supabase-js";
import { Job } from "../entities/job.ts";
import { Transaction } from '../entities/transaction.ts';

export class TransactionDao {
  constructor(private supabaseClient: SupabaseClient) {}

  async insert(job: Omit<Transaction, 'id'>): Promise<Transaction> {
    const {error, data} = await this.supabaseClient.from('user_transactions').insert(job).select();
    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }

  async updateById(id: string, toUpdate: Partial<Transaction>): Promise<void> {
    const {error} = await this.supabaseClient.from('user_transactions').update(toUpdate)
    .eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }

  async getById(id: string): Promise<Transaction> {
    const {data, error} = await this.supabaseClient.from('user_transactions').select('*')
    .eq('id', id).single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}

