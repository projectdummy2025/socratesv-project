import './style.css';

// Select root application container element
const appElement = document.querySelector<HTMLDivElement>('#app')!;

// Render mobile-first CBT interface with clean text-only design
appElement.innerHTML = `
  <!-- Header section -->
  <header class="flex items-center justify-between pb-4 border-b border-slate-800">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-emerald-400">Socrates Voice</h1>
      <p class="text-xs text-slate-400">CBT Voice Therapy Assistant</p>
    </div>
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
      Online
    </span>
  </header>

  <!-- Main conversation area for CBT workflow -->
  <main class="flex-1 my-4 space-y-3 overflow-y-auto pr-1">
    <!-- CBT Step indicator container -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm">
      <span class="text-xs text-slate-500 font-semibold block mb-1">CBT STEP 1: CATCH</span>
      <p class="text-slate-300">Sampaikan pikiran negatif yang saat ini sedang mengganggu pikiran Anda.</p>
    </div>

    <!-- User dialogue turn placeholder -->
    <div class="flex justify-end">
      <div class="bg-emerald-700 text-emerald-50 rounded-2xl rounded-tr-none px-4 py-2 text-sm max-w-[85%]">
        "Saya merasa gagal karena pekerjaan hari ini belum selesai semua."
      </div>
    </div>

    <!-- Assistant dialogue turn placeholder -->
    <div class="flex justify-start">
      <div class="bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-2 text-sm max-w-[85%] space-y-1">
        <span class="text-[10px] text-emerald-400 font-bold block">CHALLENGE</span>
        <p>"Apakah ada bukti bahwa satu hari yang belum selesai berarti Anda sepenuhnya gagal?"</p>
      </div>
    </div>
  </main>

  <!-- Control area for mobile user interaction -->
  <footer class="pt-3 border-t border-slate-800 space-y-3">
    <div class="flex items-center justify-center">
      <!-- Minimalist voice record trigger button -->
      <button id="voiceBtn" class="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
        <span class="text-xs font-extrabold tracking-wider">MIC</span>
      </button>
    </div>
    <p class="text-center text-[11px] text-slate-500">
      Tekan tombol untuk mulai sesi bimbingan CBT
    </p>
  </footer>
`;
