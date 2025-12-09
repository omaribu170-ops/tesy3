
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization - don't create client until it's actually used
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // During build time or when env vars are missing, throw a more helpful error
    // This should only happen if the code actually RUNS during build (which it shouldn't with dynamic pages)
    if (!supabaseUrl || !supabaseAnonKey) {
        // For SSR/build, return a dummy that will be replaced at runtime
        // This prevents the build from crashing
        if (typeof window === 'undefined') {
            // Server-side during build - create a placeholder that won't crash
            supabaseInstance = createClient(
                'https://example.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            );
            return supabaseInstance;
        }
        throw new Error('Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
}

// Export a proxy that lazily gets the supabase instance
export const supabase = new Proxy({} as SupabaseClient, {
    get(_, prop) {
        return getSupabase()[prop as keyof SupabaseClient];
    }
});

