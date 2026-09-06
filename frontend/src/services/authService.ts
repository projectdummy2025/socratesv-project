// Frontend Supabase OAuth Helper & Token Callback Parser

interface OAuthOptions {
  provider: 'google' | 'github';
  redirectTo?: string;
}

export interface AuthSession {
  userId: string;
  userEmail: string;
  accessToken?: string;
}

// Check if URL contains Supabase OAuth callback tokens (#access_token=... or ?code=...)
export function handleOAuthCallback(): AuthSession | null {
  const hash = window.location.hash;

  if (hash && hash.includes('access_token=')) {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      try {
        // Decode JWT payload (middle part of token)
        const payloadBase64 = accessToken.split('.')[1];
        const payloadJson = JSON.parse(atob(payloadBase64));
        
        const userId = payloadJson.sub || `user-${Date.now()}`;
        const userEmail = payloadJson.email || 'user@supabase.io';

        localStorage.setItem('socrates_user_id', userId);
        localStorage.setItem('socrates_user_email', userEmail);
        localStorage.setItem('socrates_access_token', accessToken);

        // Clean URL hash
        window.history.replaceState(null, '', window.location.pathname);

        return { userId, userEmail, accessToken };
      } catch (err) {
        console.warn('Failed to parse OAuth JWT token:', err);
      }
    }
  }

  return null;
}

// Trigger Supabase OAuth sign-in redirect matching root .env SUPABASE_URL
export function redirectToOAuthProvider(options: OAuthOptions): { success: boolean; error?: string } {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;

  if (!supabaseUrl || supabaseUrl.includes('your-supabase-project')) {
    return {
      success: false,
      error: 'SUPABASE_URL belum dikonfigurasi di file .env root.'
    };
  }

  const redirectTarget = options.redirectTo || window.location.origin;
  const oauthRedirectUrl = `${supabaseUrl}/auth/v1/authorize?provider=${options.provider}&redirect_to=${encodeURIComponent(redirectTarget)}`;

  // Execute browser redirect to real Supabase OAuth provider endpoint
  window.location.href = oauthRedirectUrl;
  return { success: true };
}
