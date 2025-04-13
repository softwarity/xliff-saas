import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { catchError, firstValueFrom, from, map, Observable, switchMap, throwError } from 'https://esm.sh/rxjs@7.5.7';
import { CORS_HEADERS } from '../const.ts';
import { Issue } from '../models/issue.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';
import { SupabaseClient } from "jsr:@supabase/supabase-js";
 
 Deno.serve(async (req: Request) => {
     if (req.method === 'OPTIONS') {
         return new Response('ok', {headers: CORS_HEADERS});
     }
     if (req.method !== 'POST') {
         return new Response('Method not allowed', {headers: CORS_HEADERS, status: 405});
     }
     try {
        const { title, body } = await req.json();
        const supabaseClient: SupabaseClient = getSupabaseClient();
        const userService = new UserService(supabaseClient);
        const user = await userService.getUser(req);
        const userId = user.id;
         const token = Deno.env.get('GITHUB_TOKEN');
         const issue: Issue = await updateIssue(token!, userId, title, body);
         return new Response(JSON.stringify(issue), {
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
  
 async function updateIssue(token: string, userId: string, title: string, body: string): Promise<Issue> {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': `token ${token}`,
    'Content-Type': 'application/json'
  }
  const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues`, { 
    method: 'PATCH',
    headers,
    body: JSON.stringify({title, body, labels: [`user-${userId}`]})
  });
  console.log(response);
  if (!response.ok) {
    throw new Error('Failed to create issue');
  }
  const issue: Issue = await response.json();
  return issue;
}