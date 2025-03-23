import { createClient, SupabaseClient } from "jsr:@supabase/supabase-js";

// functions/utils.ts
export function getSupabaseClient(): SupabaseClient {
    return createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
}