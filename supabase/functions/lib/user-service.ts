import { SupabaseClient } from "jsr:@supabase/supabase-js";
import { User } from '../models/user.ts';

export class UserService {
  constructor(private supabaseClient: SupabaseClient) {}

  getJwt(req: Request): string {
    const authHeader = req.headers.get('Authorization')!;
    if (!authHeader) {
      throw new Error('No authorization header found');
    }
    const jwt = authHeader.replace('Bearer ', '');
    return jwt;
  }

  async getUserId(req: Request): Promise<string> {
    const jwt = this.getJwt(req);
    const { data: {user} } = await this.supabaseClient.auth.getUser(jwt);
    if (!user) {
      throw new Error('No user found');
    }
    return user.id;
  }

  async getUser(req: Request): Promise<User> {
    const jwt = this.getJwt(req);
    const { data: {user} } = await this.supabaseClient.auth.getUser(jwt);
    if (!user) {
      throw new Error('No user found');
    }
    return user as User;
  }

  async getCredit(userId: string): Promise<number> {
    const {data, error} = await this.supabaseClient.from('user_credits').select('*').eq('user_id', userId);
    if (error) {
        throw new Error(error.message);
    }
    const [{balance, pending}] = data as unknown as [{balance: number, pending: number}];
    return balance + pending;
  }

  async getGitToken(userId: string, provider: 'bitbucket' | 'github' | 'gitlab'): Promise<string> {
    const {data, error} = await this.supabaseClient.from('user_metadata').select('*').eq('user_id', userId);
    if (error) {
        throw new Error(error.message);
    }
    const [{git_tokens: {[provider]: token}}] = data as unknown as [{git_tokens: {github: string, gitlab: string, bitbucket: string}}];
    return token;
  }
}
