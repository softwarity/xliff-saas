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

  async getBalance(userId: string): Promise<number> {
    const {data, error} = await this.supabaseClient.from('user_credits').select('*').eq('userId', userId);
    if (error) {
        throw new Error(error.message);
    }
    const [{balance}] = data as unknown as [{balance: number}];
    return balance;
  }
}
