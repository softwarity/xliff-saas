import { SupabaseClient } from "jsr:@supabase/supabase-js";

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
}
