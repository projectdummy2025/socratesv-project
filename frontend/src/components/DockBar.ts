// Floating Dock Bar - Pure Icons with Glowing Aura Effect (No square background boxes)
export function getDockBarHTML(): string {
  return `
    <nav id="dockNav" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300">
      <div 
        class="flex items-center justify-center gap-6 px-6 py-3 rounded-3xl bg-[#efe9de]/90 backdrop-blur-2xl border border-[#e6dfd8] shadow-xl"
        style="transform: perspective(600px) rotateX(4deg);"
      >
        
        <!-- Sesi Terapi Item (Active - Coral Glowing Aura) -->
        <div class="relative group flex items-center justify-center">
          <button id="dockHomeBtn" class="p-2 bg-transparent text-[#cc785c] drop-shadow-[0_0_10px_rgba(204,120,92,0.75)] hover:scale-110 transition-all flex items-center justify-center active:scale-95">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </button>
          
          <!-- Hover Tooltip -->
          <div class="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#181715] text-[#faf9f5] border border-slate-700 text-xs px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-50">
            Sesi CBT
          </div>
        </div>

        <!-- Bantuan Krisis Item (Inactive - Dark Muted to Rose Glow) -->
        <div class="relative group flex items-center justify-center">
          <button id="dockCrisisBtn" class="p-2 bg-transparent text-[#6c6a64] hover:text-rose-500 hover:drop-shadow-[0_0_10px_rgba(244,63,94,0.75)] hover:scale-110 transition-all flex items-center justify-center active:scale-95">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </button>
          
          <!-- Hover Tooltip -->
          <div class="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#181715] text-[#faf9f5] border border-slate-700 text-xs px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-50">
            Bantuan Krisis
          </div>
        </div>

        <!-- Keluar Item (Inactive - Dark Muted to Coral Glow) -->
        <div class="relative group flex items-center justify-center">
          <button id="dockLogoutBtn" class="p-2 bg-transparent text-[#6c6a64] hover:text-[#cc785c] hover:drop-shadow-[0_0_10px_rgba(204,120,92,0.75)] hover:scale-110 transition-all flex items-center justify-center active:scale-95">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>

          <!-- Hover Tooltip -->
          <div class="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#181715] text-[#faf9f5] border border-slate-700 text-xs px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-50">
            Keluar
          </div>
        </div>

      </div>
    </nav>
  `;
}
