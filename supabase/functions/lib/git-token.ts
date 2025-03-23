import { SupabaseClient } from "jsr:@supabase/supabase-js";
import { getSupabaseClient } from "./supabase-client.ts";
import { UserService } from "./user-service.ts";

// functions/utils.ts
export async function getGitToken(req: Request, provider: 'bitbucket' | 'github' | 'gitlab'): Promise<string> {
    const supabaseClient: SupabaseClient = getSupabaseClient();
    const userService = new UserService(supabaseClient);
    const userId = await userService.getUserId(req);
    const {data, error} = await supabaseClient.from('user_metadata').select('*').eq('user_id', userId);
    if (error) {
        throw new Error(error.message);
    }
    const [{git_tokens: {[provider]: token}}] = data as unknown as [{git_tokens: {github: string, gitlab: string, bitbucket: string}}];
    return token;
}