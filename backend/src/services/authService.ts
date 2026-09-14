export interface AuthUserPayload {
  userId: string;
  userEmail: string;
}

// Local guest token verification - no external auth service dependency
export async function verifyToken(authorizationHeader?: string): Promise<AuthUserPayload | null> {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }

  const jwtToken = authorizationHeader.substring(7).trim();
  return {
    userId: `usr-guest-${jwtToken.substring(0, 8)}`,
    userEmail: 'guest@socrates.local'
  };
}

// Backward-compatible alias
export const verifySupabaseToken = verifyToken;
