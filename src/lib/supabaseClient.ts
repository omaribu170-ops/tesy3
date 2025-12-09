
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a dummy client for build time when env vars are not available
// This allows static page generation to pass
const createSupabaseClient = (): SupabaseClient => {
    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a mock client during build time
        // Supabase will work properly at runtime when env vars are set
        return createClient(
            'https://placeholder.supabase.co',
            'placeholder-key'
        );
    }
    return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();
