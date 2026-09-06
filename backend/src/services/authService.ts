import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface AuthUserPayload {
  userId: string;
  userEmail: string;
}

let supabaseClientInstance: SupabaseClient | null = null;

// Initialize Supabase Client if environment variables exist
function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClientInstance) return supabaseClientInstance;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClientInstance;
  }

  return null;
}

// Verify Supabase Auth JWT Bearer token
export async function verifySupabaseToken(authorizationHeader?: string): Promise<AuthUserPayload | null> {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  const jwtToken = authorizationHeader.substring(7).trim();
  const supabase = getSupabaseClient();

  if (!supabase) {
    // Demo fallback for local development when Supabase env keys are not set
    return {
      userId: `usr-demo-${jwtToken.substring(0, 8)}`,
      userEmail: 'demo@socrates.app'
    };
  }

  try {
    const { data, error } = await supabase.auth.getUser(jwtToken);
    if (error || !data.user) {
      console.log(`(AuthService) Supabase token verification failed: ${error?.message}`);
      return null;
    }
    return {
      userId: data.user.id,
      userEmail: data.user.email || ''
    };
  } catch (err) {
    console.log(`(AuthService) Auth error: ${err}`);
    return null;
  }
}
