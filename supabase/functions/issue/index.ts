import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SupabaseClient } from "jsr:@supabase/supabase-js";
import { CORS_HEADERS } from '../const.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';
import { Issue, Comment } from '../models/issue.ts';

class GithubError extends Error {
  constructor(response: Response, message: string) {
    super();
    response.json().then((data) => {
      console.error('GitHub API error:', data);
    });
    this.message = `${message}: ${response.status} ${response.statusText}`;
  }
}
 
 Deno.serve(async (req: Request) => {
     if (req.method === 'OPTIONS') {
         return new Response('ok', {headers: CORS_HEADERS});
     }
     try {
        const supabaseClient: SupabaseClient = getSupabaseClient();
        const userService = new UserService(supabaseClient);
        const user = await userService.getUser(req);
        const userId = user.id;

        const payload = await getPayload(req, userId);
        return new Response(JSON.stringify(payload), {
            headers: { 
                ...CORS_HEADERS,
                'Content-Type': 'application/json',
            } ,status: 200
         });
     } catch(error: any) {
         console.error(error);
         return new Response(JSON.stringify({error: error.message}), {
             headers: { 
                 ...CORS_HEADERS,
                 'Content-Type': 'application/json',
             } ,status: 401
         });
     }
 });

 async function getPayload(req: Request, userId: string): Promise<any> {
    const url: URL = new URL(req.url)
    const method: string = req.method
    console.log('pathname', url.pathname);
    const [, , issueNumber, subcommand, commentId] = url.pathname.split('/')
    console.log('issueNumber', issueNumber);
    console.log('subcommand', subcommand);
    console.log('commentId', commentId);
    
    const token: string = Deno.env.get('GITHUB_TOKEN')!;
    switch (method) {
        case 'GET':
            if (issueNumber) {
                if (!subcommand) {
                    return getIssue(token, issueNumber)
                } else {
                    return getComments(token, issueNumber)
                }
            } else {
                const { searchParams } = url;
                const page = searchParams.get('page') || '1';
                const per_page = searchParams.get('per_page') || '10';
                return getIssues(token, userId, page, per_page)
            }
        case 'POST':
            if (!subcommand) {
                const { title, body, type } = await req.json();
                return createIssue(token, userId, title, body, type)
            } else {
                const { text } = await req.json();
                return addComment(token, userId, issueNumber, text)
            }
        case 'PUT':
            if (issueNumber) {
                if (!subcommand) {
                    const { title, body, type, state } = await req.json();
                    return updateIssue(token, issueNumber, {title, body, type, state})
                } else {
                    const { text } = await req.json();
                    return updateComment(token, userId, commentId, text)
                }
            } else {
                throw new Error('Bad Request')
            }
        case 'DELETE':
            if (subcommand === 'comment' && commentId) {
                return deleteComment(token, commentId)
            } else {
                throw new Error('Bad Request')
            }
        default:
            throw new Error('Method Not Allowed')
    }
 }

 async function deleteComment(token: string, commentId: string): Promise<boolean> {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`
    }
    
    const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues/comments/${commentId}`, { 
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
        throw new GithubError(response, `Failed to delete comment`);
    }
    
    return true;
  }

 async function updateComment(token: string, userId: string, commentId: string, text: string): Promise<any> {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    }
    const body = `<!-- user_id: ${userId} -->\n${text}`;
    const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues/comments/${commentId}`, { 
      method: 'PATCH',
      headers,
      body: JSON.stringify({ body })
    });
    if (!response.ok) {
        throw new GithubError(response, `Failed to update comment`);
    }
    const comment = await response.json();
    return {
      id: comment.id,
      body: text,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      support: false,
    };
  }

 async function addComment(token: string, userId: string, issueNumber: string, text: string): Promise<Comment> {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    }
    const body = `<!-- user_id: ${userId} -->\n${text}`;
    const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues/${issueNumber}/comments`, { 
      method: 'POST',
      headers,
      body: JSON.stringify({ body })
    });
    if (!response.ok) {
      throw new GithubError(response, `Failed to add comment`);
    }
    const comment = await response.json();
    return {
      id: comment.id,
      body: comment.body,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      support: false,
    };
  }

 async function getComments(token: string, issueNumber: string): Promise<Comment[]> {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    }
    
    const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues/${issueNumber}/comments`, { 
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new GithubError(response, 'Failed to fetch comments');
    }
    
    const comments = await response.json();
    
    // Transformer les commentaires pour avoir un format cohérent
    return comments.map((comment: any) => {
        const metadataRegex = /<!-- user_id: (.*?) -->/;
        const match = comment.body.match(metadataRegex);
        const {id, body, created_at, updated_at} = comment;
        const text = match ? body.replace(metadataRegex, '') : body;
        return {id, body: text, created_at, updated_at, support: !match, };
    });
  }

 async function updateIssue(token: string, issueNumber: string, {title, body, type, state}: {title: string, body: string, type: string, state: string}): Promise<Issue> {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
    }
    const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues/${issueNumber}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({title, body, type, state})
    });
    if (!response.ok) {
        throw new GithubError(response, 'Failed to update issue');
    }
    const issue = await response.json();
    return issue;
}

async function getIssue(token: string, issueNumber: string): Promise<Issue> {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
    }
    const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues/${issueNumber}`, {
        method: 'GET',
        headers
    });
    if (!response.ok) {
        throw new GithubError(response, 'Failed to get issue');
    }
    const issue = await response.json();
    return issue;
}

async function getIssues(token: string, userId: string, page: string, per_page: string): Promise<{data: Issue[], count: number}> {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
    }
    const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues?labels=user-${userId}&state=all&page=${page}&per_page=${per_page}`, {
        method: 'GET',
        headers
    });
    if (!response.ok) {
        throw new GithubError(response, 'Failed to list issues');
    }
    const count = parseInt(response.headers.get('X-Total-Count') || '0');
    const issues = await response.json();
    return {data: issues.map((issue: any) => {
        const {id, number, title, body, state, created_at, updated_at, closed_at, comments, type: {name: type}} = issue;
        return {id, number, title, body, state, created_at, updated_at, closed_at, comments, type};
    }), count};
}
  
 async function createIssue(token: string, userId: string, title: string, body: string, type: string): Promise<Issue> {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues`, { 
        method: 'POST',
        headers,
        body: JSON.stringify({title, body, labels: [`user-${userId}`], type})
    });
    if (!response.ok) {
        throw new GithubError(response, 'Failed to create issue');
    }
    const issue: Issue = await response.json();
    return issue;
}
