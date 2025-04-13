import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SupabaseClient } from "jsr:@supabase/supabase-js";
import { CORS_HEADERS } from '../const.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';
import { Issue } from '../models/issue.ts';
 
 Deno.serve(async (req: Request) => {
     if (req.method === 'OPTIONS') {
         return new Response('ok', {headers: CORS_HEADERS});
     }
     if (req.method !== 'GET') {
         return new Response('Method not allowed', {headers: CORS_HEADERS, status: 405});
     }
     try {
        const supabaseClient: SupabaseClient = getSupabaseClient();
        const userService = new UserService(supabaseClient);
        const user = await userService.getUser(req);
        const userId = user.id;
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page') || '1';
        const per_page = searchParams.get('per_page') || '10';
        const token = Deno.env.get('GITHUB_TOKEN');
        const issues: {data: Issue[], count: number} = await getIssues(token!, userId, page, per_page);
        return new Response(JSON.stringify(issues), {
            headers: { 
                ...CORS_HEADERS,
                'Content-Type': 'application/json',
            } ,status: 200
        });
     } catch(error: any) {
         console.log(error);
         return new Response(JSON.stringify({error: error.message}), {
             headers: { 
                 ...CORS_HEADERS,
                 'Content-Type': 'application/json',
             } ,status: 401
         });
     }
 });
  
 async function getIssues(token: string, userId: string, page: string, per_page: string): Promise<{data: Issue[], count: number}> {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${token}`
  }
  const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues?labels=user-${userId}&state=all&page=${page}&per_page=${per_page}`, { headers});
  if (!response.ok) {
    throw new Error('Failed to list issues');
  }
  const count = parseInt(response.headers.get('X-Total-Count') || '0');
  const issues = await response.json();
  return {data: issues.map((issue: Issue) => {
    const {id, number, title, body, state, created_at, updated_at, closed_at, labels, assignee, assignees, milestone, comments, user} = issue;
    return {id, number, title, body, state, created_at, updated_at, closed_at, comments};
  }), count};
}