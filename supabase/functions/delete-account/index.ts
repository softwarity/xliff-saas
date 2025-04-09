import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { CORS_HEADERS } from '../const.ts';
import { getSupabaseClient } from '../lib/supabase-client.ts';
import { UserService } from '../lib/user-service.ts';
import { SupabaseClient, UserResponse } from "jsr:@supabase/supabase-js";
import { UserMetadata } from '../models/user_metadata.ts';

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS });
    }
    if (req.method !== 'POST') {
        return new Response(null, { headers: CORS_HEADERS, status: 405 });
    }
    
    try {
        console.log('Starting account deletion...');
        const supabaseClient: SupabaseClient = getSupabaseClient();
        const userService = new UserService(supabaseClient);
        const user = await userService.getUser(req);

        // Get user IP address from request headers
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
        
        // Store hashed email in deleted_accounts table before deleting the account
        console.log('Recording deleted account information...');
        
        // First normalize the email
        const { data: normalizedEmail, error: normalizeError } = await supabaseClient.rpc('normalize_email', { email: user.email });
        
        if (normalizeError) {
            console.error('Error normalizing email:', normalizeError);
            throw normalizeError;
        }
        
        // Then hash the normalized email using RPC function
        const { data: emailHash, error: hashError } = await supabaseClient.rpc('hash_text', { text_to_hash: normalizedEmail });
        
        if (hashError) {
            console.error('Error hashing email:', hashError);
            throw hashError;
        }
        
        // Get normalized domain only
        const emailDomain = normalizedEmail.split('@')[1] || 'unknown';
        
        const deleted_account = {
            emailHash,
            emailDomain,
            userId: user.id,
            deletedAt: new Date().toISOString(),
            ipAddress,
            metadata: JSON.stringify({
                lastSignInAt: user.last_sign_in_at,
                createdAt: user.created_at,
                appMetadata: user.app_metadata,
                // Don't store user_metadata as it might contain identifiable information
                accountAgeDays: Math.floor((Date.now() - new Date(user.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24))
            })
        };
        const { error: recordError } = await supabaseClient.from('deleted_accounts').upsert(deleted_account);
        
        if (recordError) {
            console.error('Error recording deleted account:', recordError);
            // We continue with deletion even if recording fails
        }

        // Deleting user related data
        console.log('Deleting user related data...');
        
        // Deleting crédits
        const { error: creditsError } = await supabaseClient.from('user_credits').delete().eq('userId', user.id);
        if (creditsError) {
            console.error('Error deleting credits:', creditsError);
            throw creditsError;
        }
        
        // Deleting jobs
        const { error: jobsError } = await supabaseClient.from('user_jobs').delete().eq('userId', user.id);
        if (jobsError) {
            console.error('Error deleting jobs:', jobsError);
            throw jobsError;
        }
        
        // Deleting transactions
        const { error: transactionsError } = await supabaseClient.from('user_transactions').delete().eq('userId', user.id);
        if (transactionsError) {
            console.error('Error deleting transactions:', transactionsError);
            throw transactionsError;
        }
        
        // Deleting metadata
        const { error: metadataError }: { data: UserMetadata | null, error: Error | null } = await supabaseClient.from('user_metadata').delete().eq('userId', user.id);
        if (metadataError) {
            console.error('Error deleting metadata:', metadataError);
            throw metadataError;
        }

        console.log('Deleting user avatar from storage...');
        const avatar_url: string | null = user.user_metadata.avatar_url;
        const regex = new RegExp(`${user.id}/[^/]*`);
        if (avatar_url && regex.test(avatar_url)) {
            const [filename] = regex.exec(avatar_url) || [];
            console.log('Deleting avatar from storage...', filename);
            if (filename) {
                const { error: deleteError } = await supabaseClient.storage.from('avatars').remove([filename]);
                // List all files in the avatars bucket that start with the user's ID
                if (deleteError) {
                    console.error('Error deleting files:', deleteError);
                    throw deleteError;
                }
            }
        }
        
        // Now that we have deleted all related data, we can delete the user account
        console.log('All user data deleted, now deleting user account...');
        const userResponse: UserResponse = await supabaseClient.auth.admin.deleteUser(user.id);
        
        if (userResponse.error) {
            console.error('Error deleting user:', userResponse.error);
            throw userResponse.error;
        }

        console.log('User deleted successfully');
        return new Response(JSON.stringify({ message: 'Account deleted successfully' }), { 
            headers: {
                ...CORS_HEADERS,
                'Content-Type': 'application/json',
            }, 
            status: 200 
        });
    } catch(error: any) {
        console.error('Unexpected error:', error);
        return new Response(JSON.stringify({ error: error.message }), { 
            headers: {
                ...CORS_HEADERS,
                'Content-Type': 'application/json'
            }, 
            status: 500 
        });
    }
});