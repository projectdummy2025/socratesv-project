// Simplified auth service - guest only, no OAuth

export interface AuthSession {
  userId: string;
  userEmail: string;
}

// Guest login - creates simple local session
export function guestLogin(userName?: string): AuthSession {
  const userId = `guest-${Date.now()}`;
  const userEmail = userName || 'guest@socrates.app';

  localStorage.setItem('socrates_user_id', userId);
  localStorage.setItem('socrates_user_email', userEmail);

  return { userId, userEmail };
}

// Get current active user from localStorage
export function getActiveUser(): AuthSession | null {
  const userId = localStorage.getItem('socrates_user_id');
  const userEmail = localStorage.getItem('socrates_user_email');

  if (userId && userEmail) {
    return { userId, userEmail };
  }
  return null;
}

// Logout - clear stored session
export function logout(): void {
  localStorage.removeItem('socrates_user_id');
  localStorage.removeItem('socrates_user_email');
}