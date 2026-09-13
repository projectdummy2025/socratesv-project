import './style.css';
import { getHeaderHTML } from './components/Header.js';
import { getCrisisModalHTML } from './components/CrisisModal.js';
import { getLoginScreenHTML, bindLoginEvents } from './components/LoginScreen.js';
import { getDockBarHTML } from './components/DockBar.js';
import { appendChatTurn } from './components/ChatTimeline.js';
import { ParticlesCanvas } from './components/ParticlesCanvas.js';
import { WaveformVisualizer } from './components/WaveformVisualizer.js';
import { requestNewSession, requestCrisisCheck, requestCbtAnalysis } from './services/apiService.js';
import { AudioStreamManager } from './services/audioStreamService.js';
import { getActiveUser, logout as doLogout } from './services/authService.js';

// Application State
const appElement = document.querySelector<HTMLDivElement>('#app')!;
let isRecordingActive = false;
let currentSessionId = '';
let cbtStepState: 'catch' | 'challenge' | 'replace' = 'catch';
const audioManager = new AudioStreamManager();
let waveformVis: WaveformVisualizer | null = null;
let particlesInst: ParticlesCanvas | null = null;

// Update Guidance Card Banner with Generous Spacing and Warm Empathetic Copy
function updateGuidanceCard(step: 'catch' | 'challenge' | 'replace'): void {
  const stepBannerEl = document.querySelector<HTMLDivElement>('#stepBanner');
  if (!stepBannerEl) return;

  if (step === 'catch') {
    stepBannerEl.innerHTML = `
      <div class="flex items-center space-x-2 mb-2">
        <span class="w-2 h-2 rounded-full bg-[#cc785c] animate-pulse"></span>
        <span class="text-xs font-semibold text-[#cc785c] uppercase tracking-wider">Ruang Aman Berbagi</span>
      </div>
      <p class="text-xs sm:text-sm text-[#3d3d3a] leading-relaxed font-sans">
        Ceritakan apa yang sedang membuat pikiran Anda terasa berat saat ini. Saya mendengarkan dengan penuh perhatian.
      </p>
    `;
  } else if (step === 'challenge') {
    stepBannerEl.innerHTML = `
      <div class="flex items-center space-x-2 mb-2">
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        <span class="text-xs font-semibold text-amber-700 uppercase tracking-wider">Refleksi Bersama</span>
      </div>
      <p class="text-xs sm:text-sm text-[#3d3d3a] leading-relaxed font-sans">
        Mari kita lihat situasi ini bersama-sama dari sudut pandang yang lebih jernih dan objektif.
      </p>
    `;
  } else if (step === 'replace') {
    stepBannerEl.innerHTML = `
      <div class="flex items-center space-x-2 mb-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Perspektif yang Tenang</span>
      </div>
      <p class="text-xs sm:text-sm text-[#3d3d3a] leading-relaxed font-sans">
        Sudut pandang alternatif yang lebih seimbang dan lega untuk menenangkan hati Anda.
      </p>
    `;
  }
}

// Render Application UI Shell
function renderApp(): void {
  if (particlesInst) {
    particlesInst.destroy();
    particlesInst = null;
  }

  const activeUser = getActiveUser();

  if (!activeUser) {
    // Render Full-Screen Minimal Auth Page
    appElement.innerHTML = getLoginScreenHTML();
    const canvasEl = document.querySelector<HTMLCanvasElement>('#particlesCanvas');
    if (canvasEl) {
      particlesInst = new ParticlesCanvas(canvasEl);
    }
    bindLoginEvents(() => {
      renderApp();
    });
    return;
  }

  cbtStepState = 'catch';

  // Render Main CBT Therapy View - Plus Jakarta Sans Aesthetic
  appElement.innerHTML = `
    <div class="w-full min-h-screen bg-[#faf9f5] text-[#141413] flex flex-col px-4 md:px-8 py-3 relative font-sans overflow-hidden">
      <!-- Ambient Radial Glow -->
      <div class="absolute inset-0 pointer-events-none z-0">
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#cc785c]/10 rounded-full blur-3xl"></div>
      </div>

      ${getHeaderHTML(activeUser.userEmail)}

      <!-- Main Conversation Timeline with Extra Bottom Padding for Fixed Controls -->
      <main id="chatTimeline" class="flex-1 my-3 space-y-5 overflow-y-auto max-w-xl mx-auto w-full pr-1 pb-44 z-10 relative font-sans">
        <!-- Guidance Card with Generous Padding & Margin -->
        <div id="stepBanner" class="bg-[#efe9de] border border-[#e6dfd8] rounded-2xl p-5 text-sm shadow-sm transition-all duration-300 mt-2 mb-4">
          <div class="flex items-center space-x-2 mb-2">
            <span class="w-2 h-2 rounded-full bg-[#cc785c] animate-pulse"></span>
            <span class="text-xs font-semibold text-[#cc785c] uppercase tracking-wider">Ruang Aman Berbagi</span>
          </div>
          <p class="text-xs sm:text-sm text-[#3d3d3a] leading-relaxed font-sans">
            Ceritakan apa yang sedang membuat pikiran Anda terasa berat saat ini. Saya mendengarkan dengan penuh perhatian.
          </p>
        </div>

        <div id="messagesList" class="space-y-4 font-sans">
          <div class="flex justify-start">
            <div class="bg-[#181715] text-[#faf9f5] border border-slate-800/80 rounded-2xl rounded-tl-none p-5 text-sm max-w-[95%] space-y-2 shadow-xl">
              <span class="text-[11px] text-[#cc785c] font-semibold block tracking-widest uppercase mb-1">SOCRATES</span>
              <p class="leading-relaxed text-sm md:text-base font-normal text-[#faf9f5]">
                "Halo. Apa yang sedang membebani perasaan atau pikiran Anda saat ini?"
              </p>
            </div>
          </div>
        </div>
      </main>

      <!-- Dynamic Seamless Ambient Bottom Voice Controls Bar -->
      <footer id="controlsFooter" class="fixed bottom-24 left-0 right-0 z-30 pb-4 pt-6 px-4 bg-gradient-to-t from-[#faf9f5] via-[#faf9f5]/95 to-transparent transition-all duration-500 ease-in-out font-sans pointer-events-none">
        <div class="max-w-md mx-auto w-full pointer-events-auto">
          <!-- 32-Bar Waveform Visualizer Container -->
          <div id="waveformContainer" class="w-full mb-1"></div>

          <div class="flex items-center justify-center relative">
            <div id="pulseRing" class="hidden absolute w-24 h-24 rounded-full border-2 border-[#cc785c] animate-ping opacity-30"></div>
            
            <button id="micTriggerBtn" class="w-16 h-16 rounded-full bg-[#cc785c] hover:bg-[#a9583e] text-white font-bold flex items-center justify-center shadow-lg shadow-[#cc785c]/30 active:scale-95 transition-all z-10">
              <span id="micLabel" class="text-xs font-extrabold tracking-wider">START</span>
            </button>
          </div>
          <p id="statusHint" class="text-center text-[11px] text-[#6c6a64] font-medium mt-2">
            Tekan tombol di atas untuk mulai bicara
          </p>
        </div>
      </footer>

      ${getCrisisModalHTML()}
      ${getDockBarHTML()}
    </div>
  `;

  // Initialize Waveform visualizer
  const waveContainer = document.querySelector<HTMLDivElement>('#waveformContainer');
  if (waveContainer) {
    waveformVis = new WaveformVisualizer(waveContainer);
  }

  bindMainEvents();
}

// Bind main page controllers
function bindMainEvents(): void {
  const micBtn = document.querySelector<HTMLButtonElement>('#micTriggerBtn');
  const micLabel = document.querySelector<HTMLSpanElement>('#micLabel');
  const pulseRing = document.querySelector<HTMLDivElement>('#pulseRing');
  const messagesList = document.querySelector<HTMLDivElement>('#messagesList');
  const statusHint = document.querySelector<HTMLParagraphElement>('#statusHint');
  const crisisModal = document.querySelector<HTMLDivElement>('#crisisModal');
  const closeCrisisBtn = document.querySelector<HTMLButtonElement>('#closeCrisisBtn');
  const dockLogoutBtn = document.querySelector<HTMLButtonElement>('#dockLogoutBtn');
  const dockCrisisBtn = document.querySelector<HTMLButtonElement>('#dockCrisisBtn');
  const dockNav = document.querySelector<HTMLElement>('#dockNav');
  const controlsFooter = document.querySelector<HTMLElement>('#controlsFooter');
  const stepBanner = document.querySelector<HTMLDivElement>('#stepBanner');

  if (dockLogoutBtn) {
    dockLogoutBtn.addEventListener('click', () => {
      doLogout();
      audioManager.stopStreaming();
      if (waveformVis) waveformVis.stopAnimating();
      isRecordingActive = false;
      renderApp();
    });
  }

  if (dockCrisisBtn && crisisModal) {
    dockCrisisBtn.addEventListener('click', () => {
      crisisModal.classList.remove('hidden');
    });
  }

  if (micBtn && micLabel && messagesList && statusHint) {
    micBtn.addEventListener('click', async () => {
      if (!isRecordingActive) {
        isRecordingActive = true;
        
        // Auto-hide Guidance Card & Dock Nav, smoothly float controls footer down to bottom-0
        if (stepBanner) stepBanner.classList.add('hidden');
        if (dockNav) dockNav.classList.add('hidden');
        if (controlsFooter) {
          controlsFooter.classList.remove('bottom-24');
          controlsFooter.classList.add('bottom-0');
        }

        micBtn.className = 'w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition-all';
        micLabel.textContent = 'STOP';
        if (pulseRing) pulseRing.classList.remove('hidden');
        if (waveformVis) waveformVis.startAnimating(false);
        statusHint.textContent = 'Mendengarkan... Bicara pikiran Anda.';

        const activeUser = getActiveUser();
        const sessionData = await requestNewSession(activeUser?.userId, activeUser?.userEmail?.split('@')[0]);
        if (!isRecordingActive) {
          audioManager.stopStreaming();
          if (dockNav) dockNav.classList.remove('hidden');
          if (controlsFooter) {
            controlsFooter.classList.remove('bottom-0');
            controlsFooter.classList.add('bottom-24');
          }
          return;
        }

        currentSessionId = sessionData.sessionId;

        await audioManager.startStreaming(sessionData.websocketUrl, {
          onTranscript: async (speakerRole, transcriptText) => {
            appendChatTurn(messagesList, speakerRole, transcriptText, speakerRole === 'USER');

            if (speakerRole === 'USER') {
              if (waveformVis) waveformVis.startAnimating(false);
              
              // 1. Check Crisis Intent
              const crisisCheck = await requestCrisisCheck(currentSessionId, transcriptText);
              if (crisisCheck.isDangerous && crisisModal) {
                crisisModal.classList.remove('hidden');
                audioManager.stopStreaming();
                if (waveformVis) waveformVis.stopAnimating();
                if (dockNav) dockNav.classList.remove('hidden');
                if (controlsFooter) {
                  controlsFooter.classList.remove('bottom-0');
                  controlsFooter.classList.add('bottom-24');
                }
                return;
              }

              // 2. Human Empathetic State Progression
              if (cbtStepState === 'catch') {
                cbtStepState = 'challenge';
                updateGuidanceCard('challenge');

                const cbtResponse = await requestCbtAnalysis(transcriptText);
                appendChatTurn(messagesList, 'SOCRATES', cbtResponse.challengeQuestion, false);

                if (cbtResponse.replacementThought) {
                  setTimeout(() => {
                    cbtStepState = 'replace';
                    updateGuidanceCard('replace');
                    appendChatTurn(messagesList, 'SOCRATES', cbtResponse.replacementThought, false);
                  }, 2500);
                }
              } else {
                const cbtResponse = await requestCbtAnalysis(transcriptText);
                appendChatTurn(messagesList, 'SOCRATES', cbtResponse.challengeQuestion, false);
              }
            } else {
              if (waveformVis) waveformVis.startAnimating(true);
            }
          },
          onError: (err) => {
            console.warn('Audio stream error:', err);
          }
        });

        if (!isRecordingActive) {
          audioManager.stopStreaming();
          if (dockNav) dockNav.classList.remove('hidden');
          if (controlsFooter) {
            controlsFooter.classList.remove('bottom-0');
            controlsFooter.classList.add('bottom-24');
          }
        }

      } else {
        isRecordingActive = false;
        audioManager.stopStreaming();
        if (waveformVis) waveformVis.stopAnimating();
        if (pulseRing) pulseRing.classList.add('hidden');
        if (dockNav) dockNav.classList.remove('hidden');
        if (controlsFooter) {
          controlsFooter.classList.remove('bottom-0');
          controlsFooter.classList.add('bottom-24');
        }

        micBtn.className = 'w-16 h-16 rounded-full bg-[#cc785c] hover:bg-[#a9583e] text-white font-bold flex items-center justify-center shadow-lg shadow-[#cc785c]/30 active:scale-95 transition-all';
        micLabel.textContent = 'START';
        statusHint.textContent = 'Tekan tombol di atas untuk mulai bicara';
      }
    });
  }

  if (closeCrisisBtn && crisisModal && micBtn && micLabel) {
    closeCrisisBtn.addEventListener('click', () => {
      crisisModal.classList.add('hidden');
      isRecordingActive = false;
      audioManager.stopStreaming();
      if (waveformVis) waveformVis.stopAnimating();
      if (pulseRing) pulseRing.classList.add('hidden');
      if (dockNav) dockNav.classList.remove('hidden');
      if (controlsFooter) {
        controlsFooter.classList.remove('bottom-0');
        controlsFooter.classList.add('bottom-24');
      }
      micBtn.className = 'w-16 h-16 rounded-full bg-[#cc785c] hover:bg-[#a9583e] text-white font-bold flex items-center justify-center shadow-lg shadow-[#cc785c]/30 active:scale-95 transition-all';
      micLabel.textContent = 'START';
    });
  }
}

// Start app
renderApp();
