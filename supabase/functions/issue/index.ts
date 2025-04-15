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
                    return getIssue(token, issueNumber);
                } else {
                    return getComments(token, issueNumber);
                }
            } else {
                throw new Error('Bad Request');
            }
            case 'POST':
            if (!subcommand) {
                const { title, body, type } = await req.json();
                return createIssue(token, userId, title, body, type);
            } else {
                const { comment } = await req.json();
                return addComment(token, userId, issueNumber, comment);
            }
            case 'PATCH':
                if (issueNumber) {
                    if (!subcommand) {
                        const { state } = await req.json();
                        return updateStateIssue(token, issueNumber, state);
                    } else {
                        throw new Error('Bad Request');
                    }
                } else {
                    throw new Error('Bad Request');
                }
            case 'PUT':
            if (issueNumber) {
                if (!subcommand) {
                    const { title, body, type, state } = await req.json();
                    return updateIssue(token, issueNumber, {title, body, type, state});
                } else {
                    const { text } = await req.json();
                    return updateComment(token, userId, commentId, text);
                }
            } else {
                const { page, perPage, filters: {state, type, search }} = await req.json();
                return searchIssues(token, userId, {state, type, search}, page, perPage);
            }
        case 'DELETE':
            if (subcommand === 'comment' && commentId) {
                return deleteComment(token, commentId);
            } else {
                throw new Error('Bad Request');
            }
        default:
            throw new Error('Method Not Allowed');
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

 async function updateComment(token: string, userId: string, commentId: string, text: string): Promise<Comment> {
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

 async function updateStateIssue(token: string, issueNumber: string, state: 'open' | 'closed'): Promise<Issue> {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
    }
    const response = await fetch(`https://api.github.com/repos/softwarity/xliff-saas/issues/${issueNumber}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({state})
    });
    if (!response.ok) {
        throw new GithubError(response, 'Failed to update issue');
    }
    const issue = await response.json();
    return issue;
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
    const {id, number, title, body, state, created_at, updated_at, closed_at, comments, type: {name: type}} = await response.json();
    return { id, number, title, body, state, created_at, updated_at, closed_at, comments, type };
}

async function searchIssues(token: string, userId: string, query: {state: string, type: string, search: string}, page: number, perPage: number) {
    const headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };
    // Build the search query
    const search = [];
    if (query.search) {
      search.push(`*${query.search}*`);
    }
    search.push(`repo:softwarity/xliff-saas`);
    search.push(`type:issue`);
    search.push(`label:user-${userId}`);
    if (query.state) {
      search.push(`state:${query.state}`);
    }
    if (query.type === 'Bug' || query.type === 'Feature') {
      search.push(`type:${query.type.toLowerCase()}`);
    }
    const searchQuery = search.join('+');
    // Launch the search
    const url = `https://api.github.com/search/issues?q=${searchQuery}&per_page=${perPage}&page=${page}&advanced_search=true`;
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new GithubError(response, `GitHub API error`);
    }
    
    const data = await response.json();
    
    // Determine the pagination
    const totalCount = data.total_count;
    const totalPages = Math.ceil(totalCount / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return {
      data: data.items.map((issue: any) => {
        const {id, number, title, body, state, created_at, updated_at, closed_at, comments, type: {name: type}} = issue;
        return {id, number, title, body, state, created_at, updated_at, closed_at, comments, type};
      }),
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPreviousPage
      }
    };
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
