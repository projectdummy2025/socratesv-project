import { redirectToOAuthProvider } from '../services/authService.js';

// Render Auth Page: Full screen on mobile, Floating card on desktop
export function getLoginScreenHTML(): string {
  return `
    <div class="relative w-full min-h-screen bg-[#faf9f5] text-[#141413] flex flex-col justify-center items-center font-sans overflow-hidden p-0 sm:p-6">
      <!-- Background Ambient Particles Canvas -->
      <canvas id="particlesCanvas" class="absolute inset-0 pointer-events-none z-0"></canvas>

      <!-- Radial Glow Background -->
      <div class="absolute inset-0 pointer-events-none z-0">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#cc785c]/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Container: 100% Full Screen on Mobile, Floating Card on Desktop -->
      <div class="relative z-10 w-full min-h-screen sm:min-h-0 sm:max-w-lg bg-[#faf9f5] sm:bg-[#efe9de]/90 sm:border sm:border-[#e6dfd8] sm:backdrop-blur-xl sm:rounded-3xl p-6 sm:p-12 flex flex-col justify-center text-center space-y-8 sm:shadow-2xl">
        <!-- Title & Subtitle -->
        <div class="space-y-3">
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-[#141413]">Socrates Voice</h1>
          <p class="text-sm text-[#6c6a64] leading-relaxed max-w-md mx-auto font-normal">
            Pendamping terapi Restrukturisasi Kognitif (CBT) berbasis suara.
          </p>
        </div>

        <!-- Inline Notification Box -->
        <div id="authNoticeBox" class="hidden bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl p-4 text-left leading-relaxed space-y-2">
          <p id="authNoticeText" class="font-medium"></p>
          <button id="noticeFallbackBtn" type="button" class="w-full py-2 px-3 rounded-lg bg-[#cc785c] text-white text-xs font-semibold hover:bg-[#a9583e] transition-all">
            Lanjutkan Sesi Tamu (Demo)
          </button>
        </div>

        <!-- Auth Action Buttons -->
        <div class="space-y-4 pt-2 max-w-sm mx-auto w-full">
          <button id="googleAuthBtn" type="button" class="w-full py-3.5 px-5 rounded-xl bg-[#efe9de] sm:bg-[#faf9f5] hover:bg-white border border-[#e6dfd8] text-[#141413] text-sm font-medium flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-sm cursor-pointer">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>

          <button id="githubAuthBtn" type="button" class="w-full py-3.5 px-5 rounded-xl bg-[#efe9de] sm:bg-[#faf9f5] hover:bg-white border border-[#e6dfd8] text-[#141413] text-sm font-medium flex items-center justify-center space-x-3 transition-all active:scale-95 shadow-sm cursor-pointer">
            <svg class="w-5 h-5 fill-current text-[#141413]" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>Lanjutkan dengan GitHub</span>
          </button>

          <div class="relative my-4 flex items-center justify-center">
            <div class="border-t border-[#e6dfd8] w-full"></div>
            <span class="bg-[#faf9f5] sm:bg-[#efe9de] px-3 text-[10px] text-[#6c6a64] font-medium uppercase tracking-wider absolute">atau</span>
          </div>

          <button id="guestAuthBtn" type="button" class="w-full py-3.5 px-5 rounded-xl bg-[#cc785c] hover:bg-[#a9583e] text-white text-sm font-semibold transition-all shadow-md shadow-[#cc785c]/20 active:scale-95 cursor-pointer">
            Masuk Sesi Tamu
          </button>
        </div>

        <p class="text-xs text-[#6c6a64] leading-normal pt-1 font-normal">
          Privat & Terenkripsi. Mengadopsi pedoman MIND-SAFE.
        </p>
      </div>
    </div>
  `;
}

// Bind event handlers for Login Screen
export function bindLoginEvents(onLoginSuccess: (userId: string, userEmail: string) => void): void {
  const googleBtn = document.querySelector<HTMLButtonElement>('#googleAuthBtn');
  const githubBtn = document.querySelector<HTMLButtonElement>('#githubAuthBtn');
  const guestBtn = document.querySelector<HTMLButtonElement>('#guestAuthBtn');
  const noticeBox = document.querySelector<HTMLDivElement>('#authNoticeBox');
  const noticeText = document.querySelector<HTMLParagraphElement>('#authNoticeText');
  const noticeFallbackBtn = document.querySelector<HTMLButtonElement>('#noticeFallbackBtn');

  const executeGuestLogin = () => {
    const guestId = `guest-${Date.now()}`;
    const guestEmail = 'guest@socrates.app';
    localStorage.setItem('socrates_user_id', guestId);
    localStorage.setItem('socrates_user_email', guestEmail);
    onLoginSuccess(guestId, guestEmail);
  };

  const showNotice = (msg: string) => {
    if (noticeBox && noticeText) {
      noticeText.textContent = msg;
      noticeBox.classList.remove('hidden');
    }
  };

  if (noticeFallbackBtn) {
    noticeFallbackBtn.onclick = (e) => {
      e.preventDefault();
      executeGuestLogin();
    };
  }

  if (googleBtn) {
    googleBtn.onclick = (e) => {
      e.preventDefault();
      const result = redirectToOAuthProvider({ provider: 'google' });
      if (!result.success && result.error) {
        showNotice(result.error);
      }
    };
  }

  if (githubBtn) {
    githubBtn.onclick = (e) => {
      e.preventDefault();
      const result = redirectToOAuthProvider({ provider: 'github' });
      if (!result.success && result.error) {
        showNotice(result.error);
      }
    };
  }

  if (guestBtn) {
    guestBtn.onclick = (e) => {
      e.preventDefault();
      executeGuestLogin();
    };
  }
}
